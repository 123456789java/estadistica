export type HoraDormir =
  | "22:00"
  | "23:00"
  | "00:00"
  | "01:00"
  | "02:00"
  | "03:00"
  | "04:00"
  | "05:00"
  | "06:00";

export type Pagina = "inicio" | "encuesta" | "graficos";

export interface RegistroEncuesta {
  id: number;
  horaDormir: HoraDormir;
}

export interface FilaFrecuencia {
  hora: HoraDormir;
  frecuenciaAbsoluta: number;
  frecuenciaAcumulada: number;
  frecuenciaRelativa: number;
  frecuenciaRelativaAcumulada: number;
  porcentaje: number;
}

export interface ResumenEstadistico {
  totalPersonas: number;
  media: string;
  mediana: string;
  moda: string;
  varianza: number;
  desviacionEstandar: number;
}