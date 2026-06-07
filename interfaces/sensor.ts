import { StatusSensor } from "../types/statusSensor";

export interface Sensor {
  id: number;
  nome: string;
  valor: number;
  unidade: string;
  limiteMin: number;
  limiteMax: number;
  status: StatusSensor;
  icone: string;
}
