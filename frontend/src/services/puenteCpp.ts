import type {
  FilaFrecuencia,
  HoraDormir,
  RegistroEncuesta,
  ResumenEstadistico,
} from "../types/estadistica";

export const horasDisponibles: HoraDormir[] = [
  "22:00",
  "23:00",
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
];

function convertirHoraANumero(hora: HoraDormir): number {
  const horaNumerica = Number(hora.split(":")[0]);

  if (horaNumerica < 22) {
    return horaNumerica + 24;
  }

  return horaNumerica;
}

function convertirNumeroAHora(valor: number): string {
  let minutosTotales = Math.round(valor * 60);

  minutosTotales %= 24 * 60;

  if (minutosTotales < 0) {
    minutosTotales += 24 * 60;
  }

  const hora = Math.floor(minutosTotales / 60);
  const minutos = minutosTotales % 60;

  return `${hora.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}`;
}

export function calcularFrecuencias(
  registros: RegistroEncuesta[],
): FilaFrecuencia[] {
  const total = registros.length;

  let frecuenciaAcumulada = 0;
  let frecuenciaRelativaAcumulada = 0;

  return horasDisponibles.map((hora) => {
    const frecuenciaAbsoluta = registros.filter(
      (registro) => registro.horaDormir === hora,
    ).length;

    frecuenciaAcumulada += frecuenciaAbsoluta;

    const frecuenciaRelativa =
      total > 0 ? frecuenciaAbsoluta / total : 0;

    frecuenciaRelativaAcumulada += frecuenciaRelativa;

    return {
      hora,
      frecuenciaAbsoluta,
      frecuenciaAcumulada,
      frecuenciaRelativa,
      frecuenciaRelativaAcumulada,
      porcentaje: frecuenciaRelativa * 100,
    };
  });
}

export function calcularResumen(
  registros: RegistroEncuesta[],
): ResumenEstadistico {
  if (registros.length === 0) {
    return {
      totalPersonas: 0,
      media: "-",
      mediana: "-",
      moda: "-",
      varianza: 0,
      desviacionEstandar: 0,
    };
  }

  const valores = registros
    .map((registro) => convertirHoraANumero(registro.horaDormir))
    .sort((a, b) => a - b);

  const total = valores.length;

  const suma = valores.reduce((acumulador, valor) => acumulador + valor, 0);

  const mediaNumerica = suma / total;

  let medianaNumerica: number;

  if (total % 2 === 0) {
    medianaNumerica =
      (valores[total / 2 - 1] + valores[total / 2]) / 2;
  } else {
    medianaNumerica = valores[Math.floor(total / 2)];
  }

  const conteo = new Map<number, number>();

  valores.forEach((valor) => {
    conteo.set(valor, (conteo.get(valor) ?? 0) + 1);
  });

  const frecuenciaMayor = Math.max(...conteo.values());

  const modas = [...conteo.entries()]
    .filter(([, cantidad]) => cantidad === frecuenciaMayor)
    .map(([valor]) => convertirNumeroAHora(valor));

  const varianza =
    valores.reduce(
      (acumulador, valor) =>
        acumulador + Math.pow(valor - mediaNumerica, 2),
      0,
    ) / total;

  const desviacionEstandar = Math.sqrt(varianza);

  return {
    totalPersonas: total,
    media: convertirNumeroAHora(mediaNumerica),
    mediana: convertirNumeroAHora(medianaNumerica),
    moda: modas.join(", "),
    varianza,
    desviacionEstandar,
  };
}