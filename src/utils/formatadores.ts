import { StatusSensor } from "../types/statusSensor";

export function calcularDiasEmOrbita(dataLancamento: string): number {
  const lancamento = new Date(dataLancamento);
  const agora = new Date();
  const diffMs = agora.getTime() - lancamento.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function formatarTimestamp(iso: string): string {
  const data = new Date(iso);
  const dd = String(data.getDate()).padStart(2, "0");
  const mm = String(data.getMonth() + 1).padStart(2, "0");
  const hh = String(data.getHours()).padStart(2, "0");
  const min = String(data.getMinutes()).padStart(2, "0");
  return `${dd}/${mm} às ${hh}:${min}`;
}

export function calcularStatus(
  valor: number,
  limiteMin: number,
  limiteMax: number
): StatusSensor {
  const faixa = limiteMax - limiteMin;
  const margem = faixa * 0.1;

  if (valor < limiteMin - margem || valor > limiteMax + margem) {
    return "critico";
  }
  if (valor < limiteMin || valor > limiteMax) {
    return "alerta";
  }
  return "nominal";
}

export function corDoStatus(status: StatusSensor): string {
  switch (status) {
    case "nominal":
      return "#00e632";
    case "alerta":
      return "#dbc905";
    case "critico":
      return "#da0505";
    case "offline":
      return "#555555";
  }
}

export function calcularPercentual(
  valor: number,
  limiteMin: number,
  limiteMax: number
): number {
  const perc = ((valor - limiteMin) / (limiteMax - limiteMin)) * 100;
  return Math.max(0, Math.min(100, perc));
}
