import type {
  ConfiguracionEncuesta,
  RegistroEncuesta,
} from "../types/estadistica";

const distribucion: Array<[string, number]> = [
  ["22:00", 8],
  ["23:00", 12],
  ["00:00", 18],
  ["01:00", 16],
  ["02:00", 10],
  ["03:00", 7],
  ["04:00", 4],
  ["05:00", 3],
  ["06:00", 2],
];

let identificador = 1;

const registros: RegistroEncuesta[] = distribucion.flatMap(
  ([valor, cantidad]) =>
    Array.from({ length: cantidad }, () => {
      const id = identificador++;

      return {
        id,
        nombre: `Persona ${id}`,
        valor,
      };
    }),
);

export const datosPrueba: ConfiguracionEncuesta = {
  titulo: "Datos Estadísticos COLAP",
  nombreMuestra: "Persona",
  nombreVariable: "Hora de dormir",
  registros,
};