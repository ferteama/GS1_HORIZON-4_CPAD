import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Alerta, ConfiguracaoMissao, Missao } from "../interfaces/missao";
import { Sensor } from "../interfaces/sensor";
import {
  calcularDiasEmOrbita,
  calcularStatus,
} from "../utils/formatadores";

const STORAGE_KEY_MISSAO = "@horizon4:missao";
const STORAGE_KEY_CONFIG = "@horizon4:config";

const SENSORES_INICIAIS: Sensor[] = [
  {
    id: 1,
    nome: "Temperatura",
    valor: -142,
    unidade: "°C",
    limiteMin: -160,
    limiteMax: -110,
    status: "nominal",
    icone: "🌡️",
  },
  {
    id: 2,
    nome: "Nível de Energia",
    valor: 78,
    unidade: "%",
    limiteMin: 20,
    limiteMax: 100,
    status: "nominal",
    icone: "⚡",
  },
  {
    id: 3,
    nome: "Sinal (dBm)",
    valor: 88,
    unidade: "dBm",
    limiteMin: 60,
    limiteMax: 120,
    status: "nominal",
    icone: "📡",
  },
  {
    id: 4,
    nome: "Velocidade Orbital",
    valor: 27580,
    unidade: "km/h",
    limiteMin: 25000,
    limiteMax: 30000,
    status: "nominal",
    icone: "🚀",
  },
  {
    id: 5,
    nome: "Pressão do Casco",
    valor: 101.3,
    unidade: "kPa",
    limiteMin: 95,
    limiteMax: 110,
    status: "nominal",
    icone: "🔩",
  },
  {
    id: 6,
    nome: "Sensores Ativos",
    valor: 12,
    unidade: "/12",
    limiteMin: 10,
    limiteMax: 12,
    status: "nominal",
    icone: "🛰️",
  },
];

const MISSAO_INICIAL: Missao = {
  id: "horizon-4-2026",
  nome: "HORIZON-4",
  dataLancamento: "2025-06-15T00:00:00.000Z",
  diasEmOrbita: 0,
  sensores: SENSORES_INICIAIS,
  alertas: [],
  ativa: true,
};

const CONFIG_INICIAL: ConfiguracaoMissao = {
  nomeMissao: "HORIZON-4",
  nomeOperador: "Operador",
  frequenciaAtualizacao: 15,
  alertaSonoro: false,
  notasMissao: "",
};

interface MissaoContextType {
  missao: Missao;
  config: ConfiguracaoMissao;
  carregando: boolean;
  /** Força atualização manual dos sensores */
  atualizarTelemetria: () => void;
  /** Reconhece (resolve) um alerta pelo id */
  resolverAlerta: (alertaId: string) => void;
  /** Salva as configurações da missão */
  salvarConfig: (novaConfig: ConfiguracaoMissao) => Promise<void>;
  /** Limpa o histórico de alertas resolvidos */
  limparHistoricoAlertas: () => void;
}

const MissaoContext = createContext<MissaoContextType | undefined>(undefined);

export function MissaoProvider({ children }: { children: React.ReactNode }) {
  const [missao, setMissao] = useState<Missao>(MISSAO_INICIAL);
  const [config, setConfig] = useState<ConfiguracaoMissao>(CONFIG_INICIAL);
  const [carregando, setCarregando] = useState(true);

  const missaoRef = useRef(missao);
  missaoRef.current = missao;
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    async function carregar() {
      try {
        const [missaoJson, configJson] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_MISSAO),
          AsyncStorage.getItem(STORAGE_KEY_CONFIG),
        ]);

        if (missaoJson) {
          const missaoSalva: Missao = JSON.parse(missaoJson);
          missaoSalva.diasEmOrbita = calcularDiasEmOrbita(
            missaoSalva.dataLancamento
          );
          setMissao(missaoSalva);
        } else {
          const missaoBase = {
            ...MISSAO_INICIAL,
            diasEmOrbita: calcularDiasEmOrbita(MISSAO_INICIAL.dataLancamento),
          };
          setMissao(missaoBase);
        }

        if (configJson) {
          setConfig(JSON.parse(configJson));
        }
      } catch (e) {
        console.error("Erro ao carregar AsyncStorage:", e);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  useEffect(() => {
    if (!carregando) {
      AsyncStorage.setItem(STORAGE_KEY_MISSAO, JSON.stringify(missao)).catch(
        (e) => console.error("Erro ao salvar missão:", e)
      );
    }
  }, [missao, carregando]);

  const atualizarTelemetria = useCallback(() => {
    setMissao((prev) => {
      const novosAlertas: Alerta[] = [...prev.alertas];

      const novosSensores = prev.sensores.map((sensor) => {
        const faixa = sensor.limiteMax - sensor.limiteMin;
        const delta = (Math.random() - 0.5) * faixa * 0.06;
        const novoValor = parseFloat((sensor.valor + delta).toFixed(2));

        const novoStatus = calcularStatus(
          novoValor,
          sensor.limiteMin,
          sensor.limiteMax
        );

        if (
          novoStatus !== "nominal" &&
          novoStatus !== sensor.status
        ) {
          const alerta: Alerta = {
            id: `${sensor.id}-${Date.now()}`,
            sensorId: sensor.id,
            nomeSensor: sensor.nome,
            mensagem: `${sensor.icone} ${sensor.nome} em ${novoStatus.toUpperCase()}: ${novoValor} ${sensor.unidade}`,
            timestamp: new Date().toISOString(),
            ativo: true,
          };
          novosAlertas.push(alerta);
        }

        return { ...sensor, valor: novoValor, status: novoStatus };
      });

      return {
        ...prev,
        sensores: novosSensores,
        alertas: novosAlertas,
        diasEmOrbita: calcularDiasEmOrbita(prev.dataLancamento),
      };
    });
  }, []);

  useEffect(() => {
    if (carregando) return;

    const intervaloMs = (configRef.current.frequenciaAtualizacao || 15) * 1000;
    const timer = setInterval(() => {
      atualizarTelemetria();
    }, intervaloMs);

    return () => clearInterval(timer);
  }, [carregando, config.frequenciaAtualizacao, atualizarTelemetria]);

  const resolverAlerta = useCallback((alertaId: string) => {
    setMissao((prev) => ({
      ...prev,
      alertas: prev.alertas.map((a) =>
        a.id === alertaId ? { ...a, ativo: false } : a
      ),
    }));
  }, []);

  const salvarConfig = useCallback(async (novaConfig: ConfiguracaoMissao) => {
    setConfig(novaConfig);
    await AsyncStorage.setItem(
      STORAGE_KEY_CONFIG,
      JSON.stringify(novaConfig)
    );
    setMissao((prev) => ({ ...prev, nome: novaConfig.nomeMissao }));
  }, []);

  const limparHistoricoAlertas = useCallback(() => {
    setMissao((prev) => ({
      ...prev,
      alertas: prev.alertas.filter((a) => a.ativo),
    }));
  }, []);

  return (
    <MissaoContext.Provider
      value={{
        missao,
        config,
        carregando,
        atualizarTelemetria,
        resolverAlerta,
        salvarConfig,
        limparHistoricoAlertas,
      }}
    >
      {children}
    </MissaoContext.Provider>
  );
}

export function useMissao(): MissaoContextType {
  const ctx = useContext(MissaoContext);
  if (!ctx) {
    throw new Error("useMissao deve ser usado dentro de <MissaoProvider>");
  }
  return ctx;
}
