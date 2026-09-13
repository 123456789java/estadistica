import type {
  FilaFrecuencia,
  RegistroEncuesta,
  ResumenEstadistico,
} from "../types/estadistica";

interface ValorNumerico {
  original: string;
  numero: number;
}

type TipoDatos = "hora" | "numero" | "texto";

function esHora(valor: string): boolean {
  const coincidencia = valor.trim().match(/^(\d{1,2}):(\d{2})$/);

  if (!coincidencia) {
    return false;
  }

  const hora = Number(coincidencia[1]);
  const minutos = Number(coincidencia[2]);

  return hora >= 0 && hora <= 23 && minutos >= 0 && minutos <= 59;
}

function horaANumero(valor: string): number {
  const [horaTexto, minutosTexto] = valor.trim().split(":");

  const hora = Number(horaTexto);
  const minutos = Number(minutosTexto);

  const horaAjustada = hora < 12 ? hora + 24 : hora;

  return horaAjustada + minutos / 60;
}

function numeroAHora(valor: number): string {
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

function esNumero(valor: string): boolean {
  const limpio = valor.trim().replace(",", ".");

  return limpio !== "" && Number.isFinite(Number(limpio));
}

function detectarTipo(
  registros: RegistroEncuesta[],
): TipoDatos {
  const valores = registros
    .map((registro) => registro.valor.trim())
    .filter(Boolean);

  if (valores.length === 0) {
    return "texto";
  }

  if (valores.every(esHora)) {
    return "hora";
  }

  if (valores.every(esNumero)) {
    return "numero";
  }

  return "texto";
}

function prepararValoresNumericos(
  registros: RegistroEncuesta[],
  tipo: TipoDatos,
): ValorNumerico[] {
  return registros
    .map((registro) => registro.valor.trim())
    .filter(Boolean)
    .map((original) => ({
      original,
      numero:
        tipo === "hora"
          ? horaANumero(original)
          : Number(original.replace(",", ".")),
    }));
}

function formatearNumero(valor: number): string {
  return new Intl.NumberFormat("es-BO", {
    maximumFractionDigits: 2,
  }).format(valor);
}

function calcularModa(
  registros: RegistroEncuesta[],
): string {
  const conteo = new Map<string, number>();

  registros.forEach((registro) => {
    const valor = registro.valor.trim();

    if (valor) {
      conteo.set(
        valor,
        (conteo.get(valor) ?? 0) + 1,
      );
    }
  });

  if (conteo.size === 0) {
    return "-";
  }

  const frecuenciaMayor = Math.max(...conteo.values());

  const modas = [...conteo.entries()]
    .filter(
      ([, frecuencia]) =>
        frecuencia === frecuenciaMayor,
    )
    .map(([valor]) => valor);

  return modas.join(", ");
}

function compararValores(
  a: string,
  b: string,
  tipo: TipoDatos,
): number {
  if (tipo === "hora") {
    return horaANumero(a) - horaANumero(b);
  }

  if (tipo === "numero") {
    return (
      Number(a.replace(",", ".")) -
      Number(b.replace(",", "."))
    );
  }

  return 0;
}

export function calcularFrecuencias(
  registros: RegistroEncuesta[],
): FilaFrecuencia[] {
  const registrosValidos = registros.filter(
    (registro) => registro.valor.trim() !== "",
  );

  const total = registrosValidos.length;
  const tipo = detectarTipo(registrosValidos);

  const conteo = new Map<string, number>();
  const ordenOriginal: string[] = [];

  registrosValidos.forEach((registro) => {
    const valor = registro.valor.trim();

    if (!conteo.has(valor)) {
      ordenOriginal.push(valor);
    }

    conteo.set(
      valor,
      (conteo.get(valor) ?? 0) + 1,
    );
  });

  const valores = [...ordenOriginal];

  if (tipo !== "texto") {
    valores.sort((a, b) =>
      compararValores(a, b, tipo),
    );
  }

  let frecuenciaAcumulada = 0;
  let frecuenciaRelativaAcumulada = 0;

  return valores.map((valor, indice) => {
    const frecuenciaAbsoluta =
      conteo.get(valor) ?? 0;

    frecuenciaAcumulada += frecuenciaAbsoluta;

    const frecuenciaRelativa =
      total > 0
        ? frecuenciaAbsoluta / total
        : 0;

    frecuenciaRelativaAcumulada +=
      frecuenciaRelativa;

    if (
      indice === valores.length - 1 &&
      total > 0
    ) {
      frecuenciaRelativaAcumulada = 1;
    }

    return {
      valor,
      frecuenciaAbsoluta,
      frecuenciaAcumulada,
      frecuenciaRelativa,
      frecuenciaRelativaAcumulada,
      porcentaje:
        frecuenciaRelativa * 100,
    };
  });
}

export function calcularResumen(
  registros: RegistroEncuesta[],
): ResumenEstadistico {
  const registrosValidos = registros.filter(
    (registro) => registro.valor.trim() !== "",
  );

  const totalMuestras =
    registrosValidos.length;

  if (totalMuestras === 0) {
    return {
      totalMuestras: 0,
      media: "-",
      mediana: "-",
      moda: "-",
    };
  }

  const tipo =
    detectarTipo(registrosValidos);

  const moda =
    calcularModa(registrosValidos);

  if (tipo === "texto") {
    return {
      totalMuestras,
      media: "No aplica",
      mediana: "No aplica",
      moda,
    };
  }

  const valores =
    prepararValoresNumericos(
      registrosValidos,
      tipo,
    )
      .map((dato) => dato.numero)
      .sort((a, b) => a - b);

  const suma = valores.reduce(
    (acumulador, valor) =>
      acumulador + valor,
    0,
  );

  const mediaNumerica =
    suma / valores.length;

  const mitad =
    Math.floor(valores.length / 2);

  const medianaNumerica =
    valores.length % 2 === 0
      ? (
          valores[mitad - 1] +
          valores[mitad]
        ) / 2
      : valores[mitad];

  return {
    totalMuestras,

    media:
      tipo === "hora"
        ? numeroAHora(mediaNumerica)
        : formatearNumero(
            mediaNumerica,
          ),

    mediana:
      tipo === "hora"
        ? numeroAHora(
            medianaNumerica,
          )
        : formatearNumero(
            medianaNumerica,
          ),

    moda,
  };
}