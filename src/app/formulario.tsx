

import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useMissao } from "../context/MissaoContext";
import { CORES } from "../utils/tema";

type TipoEvento = "anomalia" | "manutencao" | "observacao" | "comunicacao" | "eva";
type Criticidade = "baixa" | "media" | "alta" | "critica";

interface DadosFormulario {
  operador: string;
  tipoEvento: TipoEvento | "";
  sensorAfetado: string;
  criticidade: Criticidade | "";
  descricao: string;
  dataEvento: string;
}

interface ErrosFormulario {
  operador?: string;
  tipoEvento?: string;
  criticidade?: string;
  descricao?: string;
  dataEvento?: string;
}

const TIPOS_EVENTO: { valor: TipoEvento; label: string }[] = [
  { valor: "anomalia", label: "⚠️ Anomalia Técnica" },
  { valor: "manutencao", label: "🔧 Manutenção" },
  { valor: "observacao", label: "🔭 Observação Científica" },
  { valor: "comunicacao", label: "📡 Falha de Comunicação" },
  { valor: "eva", label: "🚀 Atividade EVA" },
];

const CRITICIDADES: { valor: Criticidade; label: string; cor: string }[] = [
  { valor: "baixa", label: "Baixa", cor: CORES.ok },
  { valor: "media", label: "Média", cor: CORES.alerta },
  { valor: "alta", label: "Alta", cor: "#ff8c00" },
  { valor: "critica", label: "Crítica", cor: CORES.critico },
];

const MAX_DESCRICAO = 300;

export default function FormularioScreen() {
  const { missao } = useMissao();

  const [dados, setDados] = useState<DadosFormulario>({
    operador: "",
    tipoEvento: "",
    sensorAfetado: "",
    criticidade: "",
    descricao: "",
    dataEvento: "",
  });

  const [erros, setErros] = useState<ErrosFormulario>({});
  const [enviado, setEnviado] = useState(false);
  const [resumoEnvio, setResumoEnvio] = useState<DadosFormulario | null>(null);

  function validar(): boolean {
    const novosErros: ErrosFormulario = {};

    if (!dados.operador.trim()) {
      novosErros.operador = "Nome do operador é obrigatório.";
    }

    if (!dados.tipoEvento) {
      novosErros.tipoEvento = "Selecione o tipo de evento.";
    }

    if (!dados.criticidade) {
      novosErros.criticidade = "Selecione a criticidade.";
    }

    if (!dados.descricao.trim()) {
      novosErros.descricao = "Descrição é obrigatória.";
    } else if (dados.descricao.trim().length < 10) {
      novosErros.descricao = "Descrição muito curta (mín. 10 caracteres).";
    }

    if (dados.dataEvento) {
      const regexData = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!regexData.test(dados.dataEvento)) {
        novosErros.dataEvento = "Use o formato DD/MM/AAAA.";
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function atualizar<K extends keyof DadosFormulario>(
    campo: K,
    valor: DadosFormulario[K]
  ) {
    setDados((prev) => ({ ...prev, [campo]: valor }));
    // Remove erro do campo ao editar
    if (erros[campo as keyof ErrosFormulario]) {
      setErros((prev) => ({ ...prev, [campo]: undefined }));
    }
  }

  function enviar() {
    if (!validar()) return;
    setResumoEnvio({ ...dados });
    setEnviado(true);
  }

  function novoRegistro() {
    setDados({
      operador: "",
      tipoEvento: "",
      sensorAfetado: "",
      criticidade: "",
      descricao: "",
      dataEvento: "",
    });
    setErros({});
    setEnviado(false);
    setResumoEnvio(null);
  }

  if (enviado && resumoEnvio) {
    const tipoLabel =
      TIPOS_EVENTO.find((t) => t.valor === resumoEnvio.tipoEvento)?.label || "";
    const critLabel =
      CRITICIDADES.find((c) => c.valor === resumoEnvio.criticidade)?.label || "";
    const critCor =
      CRITICIDADES.find((c) => c.valor === resumoEnvio.criticidade)?.cor || CORES.ok;

    return (
      <View style={styles.sucesso}>
        <Text style={styles.sucessoIcone}>✅</Text>
        <Text style={styles.sucessoTitulo}>Evento Registrado!</Text>
        <View style={styles.card}>
          <LinhaSucesso label="Operador" valor={resumoEnvio.operador} />
          <LinhaSucesso label="Evento" valor={tipoLabel} />
          <LinhaSucesso
            label="Criticidade"
            valor={critLabel}
            cor={critCor}
          />
          {resumoEnvio.sensorAfetado ? (
            <LinhaSucesso label="Sensor" valor={resumoEnvio.sensorAfetado} />
          ) : null}
          {resumoEnvio.dataEvento ? (
            <LinhaSucesso label="Data" valor={resumoEnvio.dataEvento} />
          ) : null}
          <Text style={styles.descricaoSucesso}>{resumoEnvio.descricao}</Text>
        </View>
        <TouchableOpacity style={styles.btnPrimario} onPress={novoRegistro}>
          <Text style={styles.btnPrimarioTexto}>📋 Novo Registro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: CORES.fundoBody }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.subtitulo}>REGISTRO DE EVENTO — {missao.nome}</Text>

        {/* ── Campo: Operador ── */}
        <Campo label="👤 Nome do Operador *" erro={erros.operador}>
          <TextInput
            style={[styles.input, erros.operador && styles.inputErro]}
            placeholder="Ex: Carlos Andrade"
            placeholderTextColor={CORES.textoSecundario}
            value={dados.operador}
            onChangeText={(v) => atualizar("operador", v)}
            autoCapitalize="words"
          />
        </Campo>

        {/* ── Campo: Data do evento ── */}
        <Campo label="📅 Data do Evento" erro={erros.dataEvento}>
          <TextInput
            style={[styles.input, erros.dataEvento && styles.inputErro]}
            placeholder="DD/MM/AAAA"
            placeholderTextColor={CORES.textoSecundario}
            value={dados.dataEvento}
            onChangeText={(v) => atualizar("dataEvento", v)}
            keyboardType="numeric"
            maxLength={10}
          />
        </Campo>

        {/* ── Campo: Tipo de evento ── */}
        <Campo label="🔖 Tipo de Evento *" erro={erros.tipoEvento}>
          <View style={styles.grid2}>
            {TIPOS_EVENTO.map((tipo) => (
              <TouchableOpacity
                key={tipo.valor}
                style={[
                  styles.opcao,
                  dados.tipoEvento === tipo.valor && styles.opcaoSelecionada,
                ]}
                onPress={() => atualizar("tipoEvento", tipo.valor)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.opcaoTexto,
                    dados.tipoEvento === tipo.valor &&
                      styles.opcaoTextoSelecionado,
                  ]}
                >
                  {tipo.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Campo>

        {/* ── Campo: Sensor afetado ── */}
        <Campo label="🛰️ Sensor Afetado (opcional)">
          <View style={styles.grid2}>
            <TouchableOpacity
              style={[
                styles.opcao,
                dados.sensorAfetado === "" && styles.opcaoPequena,
              ]}
              onPress={() => atualizar("sensorAfetado", "")}
              activeOpacity={0.7}
            >
              <Text style={styles.opcaoTexto}>— Nenhum —</Text>
            </TouchableOpacity>
            {missao.sensores.map((sensor) => (
              <TouchableOpacity
                key={sensor.id}
                style={[
                  styles.opcao,
                  dados.sensorAfetado === sensor.nome && styles.opcaoSelecionada,
                ]}
                onPress={() => atualizar("sensorAfetado", sensor.nome)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.opcaoTexto,
                    dados.sensorAfetado === sensor.nome &&
                      styles.opcaoTextoSelecionado,
                  ]}
                >
                  {sensor.icone} {sensor.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Campo>

        {/* ── Campo: Criticidade ── */}
        <Campo label="⚠️ Criticidade *" erro={erros.criticidade}>
          <View style={styles.grid4}>
            {CRITICIDADES.map((crit) => (
              <TouchableOpacity
                key={crit.valor}
                style={[
                  styles.opcao,
                  dados.criticidade === crit.valor && {
                    backgroundColor: crit.cor + "22",
                    borderColor: crit.cor,
                  },
                ]}
                onPress={() => atualizar("criticidade", crit.valor)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.opcaoTexto,
                    dados.criticidade === crit.valor && { color: crit.cor },
                  ]}
                >
                  {crit.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Campo>

        {/* ── Campo: Descrição ── */}
        <Campo
          label={`📝 Descrição * (${dados.descricao.length}/${MAX_DESCRICAO})`}
          erro={erros.descricao}
        >
          <TextInput
            style={[
              styles.input,
              styles.textarea,
              erros.descricao && styles.inputErro,
            ]}
            placeholder="Descreva o evento ocorrido na missão..."
            placeholderTextColor={CORES.textoSecundario}
            value={dados.descricao}
            onChangeText={(v) => {
              if (v.length <= MAX_DESCRICAO) atualizar("descricao", v);
            }}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </Campo>

        {/* ── Botão submit ── */}
        <TouchableOpacity
          style={styles.btnPrimario}
          onPress={enviar}
          activeOpacity={0.8}
        >
          <Text style={styles.btnPrimarioTexto}>🚀 Registrar Evento</Text>
        </TouchableOpacity>

        <Text style={styles.nota}>* Campos obrigatórios</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
function Campo({
  label,
  erro,
  children,
}: {
  label: string;
  erro?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.campo}>
      <Text style={styles.campoLabel}>{label}</Text>
      {children}
      {erro && <Text style={styles.campoErro}>{erro}</Text>}
    </View>
  );
}

function LinhaSucesso({
  label,
  valor,
  cor,
}: {
  label: string;
  valor: string;
  cor?: string;
}) {
  return (
    <View style={styles.linhaSucesso}>
      <Text style={styles.linhaSucessoLabel}>{label}:</Text>
      <Text style={[styles.linhaSucessoValor, cor ? { color: cor } : null]}>
        {valor}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundoBody,
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  subtitulo: {
    fontSize: 11,
    color: CORES.textoSecundario,
    letterSpacing: 2,
    marginBottom: 20,
    marginTop: 8,
  },
  campo: {
    marginBottom: 20,
  },
  campoLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: CORES.textoSecundario,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  campoErro: {
    fontSize: 12,
    color: CORES.critico,
    marginTop: 4,
    fontWeight: "500",
  },
  input: {
    backgroundColor: CORES.fundoCard,
    borderWidth: 1,
    borderColor: "rgba(214,105,40,0.3)",
    borderRadius: 10,
    padding: 12,
    color: CORES.textoPrincipal,
    fontSize: 15,
  },
  inputErro: {
    borderColor: CORES.critico,
  },
  textarea: {
    minHeight: 120,
  },
  grid2: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  grid4: {
    flexDirection: "row",
    gap: 8,
  },
  opcao: {
    backgroundColor: CORES.fundoCard,
    borderWidth: 1,
    borderColor: "rgba(214,105,40,0.25)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  opcaoPequena: {
    opacity: 0.5,
  },
  opcaoSelecionada: {
    backgroundColor: CORES.primaria + "22",
    borderColor: CORES.primaria,
  },
  opcaoTexto: {
    color: CORES.textoSecundario,
    fontSize: 12,
    fontWeight: "600",
  },
  opcaoTextoSelecionado: {
    color: CORES.primaria,
  },
  btnPrimario: {
    backgroundColor: CORES.primaria,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  btnPrimarioTexto: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  nota: {
    fontSize: 11,
    color: CORES.textoSecundario,
    textAlign: "center",
    opacity: 0.6,
  },
  sucesso: {
    flex: 1,
    backgroundColor: CORES.fundoBody,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  sucessoIcone: {
    fontSize: 64,
  },
  sucessoTitulo: {
    fontSize: 22,
    fontWeight: "900",
    color: CORES.ok,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: CORES.fundoCard,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 14,
    padding: 20,
    width: "100%",
    gap: 8,
  },
  linhaSucesso: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(214,105,40,0.1)",
  },
  linhaSucessoLabel: {
    fontSize: 12,
    color: CORES.textoSecundario,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  linhaSucessoValor: {
    fontSize: 14,
    color: CORES.textoPrincipal,
    fontWeight: "700",
  },
  descricaoSucesso: {
    fontSize: 13,
    color: CORES.textoPrincipal,
    fontStyle: "italic",
    lineHeight: 20,
    marginTop: 8,
  },
});
