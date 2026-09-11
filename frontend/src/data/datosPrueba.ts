import type { HoraDormir, RegistroEncuesta } from "../types/estadistica";

const distribucion: Array<[HoraDormir, number]> = [
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

export const datosPrueba: RegistroEncuesta[] = distribucion.flatMap(
  ([hora, cantidad]) =>
    Array.from({ length: cantidad }, () => ({
      id: identificador++,
      horaDormir: hora,
    })),
);