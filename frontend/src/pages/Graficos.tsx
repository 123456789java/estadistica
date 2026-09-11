import { calcularFrecuencias } from "../services/puenteCpp";
import type { RegistroEncuesta } from "../types/estadistica";

interface Propiedades {
  registros: RegistroEncuesta[];
}

function Graficos({ registros }: Propiedades) {
  const frecuencias = calcularFrecuencias(registros);

  const frecuenciaMayor = Math.max(
    ...frecuencias.map((fila) => fila.frecuenciaAbsoluta),
    1,
  );

  return (
    <main className="pagina">
      <section className="encabezado-pagina">
        <h2>Gráficos estadísticos</h2>

        <p>
          Representación visual de los horarios de sueño obtenidos en la
          encuesta.
        </p>
      </section>

      <section className="seccion">
        <h2>Gráfico de barras</h2>

        <div className="grafico-barras">
          {frecuencias.map((fila) => {
            const altura =
              (fila.frecuenciaAbsoluta / frecuenciaMayor) * 250;

            return (
              <div className="grupo-barra" key={fila.hora}>
                <span className="numero-barra">
                  {fila.frecuenciaAbsoluta}
                </span>

                <div
                  className="barra"
                  style={{
                    height: `${altura}px`,
                  }}
                />

                <span className="etiqueta-barra">
                  {fila.hora}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default Graficos;