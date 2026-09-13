import type {
  FilaFrecuencia,
  TipoGrafico,
} from "../types/estadistica";

interface Propiedades {
  tipo: TipoGrafico;
  frecuencias: FilaFrecuencia[];
  nombreVariable: string;
  cerrar: () => void;
}

interface PropiedadesVista {
  tipo: TipoGrafico;
  frecuencias: FilaFrecuencia[];
}

const colores = [
  "#172a46",
  "#2d6cdf",
  "#3d7ee8",
  "#39675f",
  "#5d4b8a",
  "#79559b",
  "#a26142",
  "#9b772e",
  "#49677f",
  "#2e5278",
];

export function tituloGrafico(
  tipo: TipoGrafico,
): string {
  switch (tipo) {
    case "barras":
      return "Gráfico de barras";

    case "grupos":
      return "Gráfico por grupos";

    case "circular":
      return "Gráfico circular";

    case "histograma":
      return "Histograma";
  }
}

function GraficoBarras({
  frecuencias,
  histograma = false,
}: {
  frecuencias: FilaFrecuencia[];
  histograma?: boolean;
}) {
  const maximo = Math.max(
    ...frecuencias.map(
      (fila) =>
        fila.frecuenciaAbsoluta,
    ),
    1,
  );

  return (
    <div className="zona-grafico-desplazable">
      <div
        className={
          histograma
            ? "grafico-histograma"
            : "grafico-barras"
        }
        style={{
          minWidth: `${Math.max(
            600,
            frecuencias.length * 70,
          )}px`,
        }}
      >
        {frecuencias.map(
          (fila) => {
            const altura =
              Math.max(
                8,
                (fila.frecuenciaAbsoluta /
                  maximo) *
                  230,
              );

            return (
              <div
                className="grupo-barra"
                key={fila.valor}
              >
                <span className="numero-barra">
                  {
                    fila.frecuenciaAbsoluta
                  }
                </span>

                <div
                  className="barra"
                  style={{
                    height: `${altura}px`,
                  }}
                />

                <span
                  className="etiqueta-barra"
                  title={fila.valor}
                >
                  {fila.valor}
                </span>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}

function GraficoGrupos({
  frecuencias,
}: {
  frecuencias: FilaFrecuencia[];
}) {
  const tamanoGrupo = Math.max(
    1,
    Math.ceil(
      frecuencias.length / 4,
    ),
  );

  const grupos: Array<{
    etiqueta: string;
    frecuencia: number;
  }> = [];

  for (
    let i = 0;
    i < frecuencias.length;
    i += tamanoGrupo
  ) {
    const bloque =
      frecuencias.slice(
        i,
        i + tamanoGrupo,
      );

    const primero =
      bloque[0]?.valor ?? "";

    const ultimo =
      bloque[
        bloque.length - 1
      ]?.valor ?? "";

    grupos.push({
      etiqueta:
        primero === ultimo
          ? primero
          : `${primero} - ${ultimo}`,

      frecuencia:
        bloque.reduce(
          (suma, fila) =>
            suma +
            fila.frecuenciaAbsoluta,
          0,
        ),
    });
  }

  const maximo = Math.max(
    ...grupos.map(
      (grupo) =>
        grupo.frecuencia,
    ),
    1,
  );

  return (
    <div className="grafico-grupos">
      {grupos.map(
        (grupo, indice) => (
          <div
            className="grupo-horizontal"
            key={grupo.etiqueta}
          >
            <span className="etiqueta-grupo">
              {grupo.etiqueta}
            </span>

            <div className="pista-grupo">
              <div
                className="relleno-grupo"
                style={{
                  width: `${
                    (grupo.frecuencia /
                      maximo) *
                    100
                  }%`,
                  backgroundColor:
                    colores[
                      indice %
                        colores.length
                    ],
                }}
              />
            </div>

            <strong>
              {grupo.frecuencia}
            </strong>
          </div>
        ),
      )}
    </div>
  );
}

function GraficoCircular({
  frecuencias,
}: {
  frecuencias: FilaFrecuencia[];
}) {
  let acumulado = 0;

  return (
    <div className="grafico-circular-contenedor">
      <div className="contenedor-svg-circular">
        <svg
          className="grafico-circular-svg"
          viewBox="0 0 120 120"
        >
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="#e8edf3"
            strokeWidth="24"
          />

          {frecuencias.map(
            (fila, indice) => {
              const porcentaje =
                fila.porcentaje;

              const desplazamiento =
                acumulado;

              acumulado +=
                porcentaje;

              return (
                <circle
                  key={fila.valor}
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke={
                    colores[
                      indice %
                        colores.length
                    ]
                  }
                  strokeWidth="24"
                  pathLength="100"
                  strokeDasharray={`${porcentaje} ${
                    100 -
                    porcentaje
                  }`}
                  strokeDashoffset={
                    -desplazamiento
                  }
                  transform="rotate(-90 60 60)"
                />
              );
            },
          )}

          <circle
            cx="60"
            cy="60"
            r="29"
            fill="#ffffff"
          />

          <text
            x="60"
            y="64"
            textAnchor="middle"
            className="texto-circular"
          >
            100%
          </text>
        </svg>
      </div>

      <div className="leyenda-circular">
        {frecuencias.map(
          (fila, indice) => (
            <div
              className="item-leyenda"
              key={fila.valor}
            >
              <span
                className="muestra-color"
                style={{
                  backgroundColor:
                    colores[
                      indice %
                        colores.length
                    ],
                }}
              />

              <span>
                {fila.valor}
              </span>

              <strong>
                {fila.porcentaje.toFixed(
                  2,
                )}
                %
              </strong>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export function VistaGrafico({
  tipo,
  frecuencias,
}: PropiedadesVista) {
  if (frecuencias.length === 0) {
    return (
      <div className="grafico-vacio">
        No hay datos.
      </div>
    );
  }

  if (tipo === "barras") {
    return (
      <GraficoBarras
        frecuencias={frecuencias}
      />
    );
  }

  if (tipo === "grupos") {
    return (
      <GraficoGrupos
        frecuencias={frecuencias}
      />
    );
  }

  if (tipo === "circular") {
    return (
      <GraficoCircular
        frecuencias={frecuencias}
      />
    );
  }

  return (
    <GraficoBarras
      frecuencias={frecuencias}
      histograma
    />
  );
}

function Graficos({
  tipo,
  frecuencias,
  nombreVariable,
  cerrar,
}: Propiedades) {
  return (
    <div
      className="modal-fondo"
      role="presentation"
      onMouseDown={cerrar}
    >
      <section
        className="modal-grafico"
        role="dialog"
        aria-modal="true"
        aria-label={tituloGrafico(
          tipo,
        )}
        onMouseDown={(evento) =>
          evento.stopPropagation()
        }
      >
        <div className="modal-encabezado">
          <div>
            <strong className="modal-variable">
              {nombreVariable}
            </strong>

            <h2>
              {tituloGrafico(
                tipo,
              )}
            </h2>
          </div>

          <button
            type="button"
            className="boton-cerrar"
            onClick={cerrar}
            aria-label="Cerrar gráfico"
          >
            ×
          </button>
        </div>

        <VistaGrafico
          tipo={tipo}
          frecuencias={frecuencias}
        />
      </section>
    </div>
  );
}

export default Graficos;