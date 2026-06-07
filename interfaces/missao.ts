import { Sensor } from "./sensor";


export interface Alerta {
  id: string;
  sensorId: number;
  nomeSensor: string;
  mensagem: string;
  timestamp: string;
  ativo: boolean;
}

export interface Missao {
  id: string;
  nome: string;
  dataLancamento: string;
  diasEmOrbita: number;
  sensores: Sensor[];
  alertas: Alerta[];
  ativa: boolean;
}

export interface ConfiguracaoMissao {
  nomeMissao: string;
  nomeOperador: string;
  frequenciaAtualizacao: number; // segundos
  alertaSonoro: boolean;
  notasMissao?: string;
}
