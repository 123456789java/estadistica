export type Pagina = "inicio" | "editar";

export type TipoGrafico =
  | "barras"
  | "grupos"
  | "circular"
  | "histograma";

export interface RegistroEncuesta {
  id: number;
  nombre: string;
  valor: string;
}

export interface ConfiguracionEncuesta {
  titulo: string;
  nombreMuestra: string;
  nombreVariable: string;
  registros: RegistroEncuesta[];
}

export interface FilaFrecuencia {
  valor: string;
  frecuenciaAbsoluta: number;
  frecuenciaAcumulada: number;
  frecuenciaRelativa: number;
  frecuenciaRelativaAcumulada: number;
  porcentaje: number;
}

export interface ResumenEstadistico {
  totalMuestras: number;
  media: string;
  mediana: string;
  moda: string;
}