import { useState } from "react";

import TablaFrecuencias from "../components/TablaFrecuencias";
import TarjetaEstadistica from "../components/TarjetaEstadistica";

import Graficos, {
  VistaGrafico,
} from "./Graficos";

import {
  calcularFrecuencias,
  calcularResumen,
} from "../services/puenteCpp";

import type {
  ConfiguracionEncuesta,
  TipoGrafico,
} from "../types/estadistica";

interface Propiedades {
  configuracion: ConfiguracionEncuesta;
}

function Inicio({
  configuracion,
}: Propiedades) {
  const [
    graficoActivo,
    setGraficoActivo,
  ] = useState<TipoGrafico | null>(
    null,
  );

  const resumen =
    calcularResumen(
      configuracion.registros,
    );

  const frecuencias =
    calcularFrecuencias(
      configuracion.registros,
    );

  return (
    <main className="pagina pagina-inicio">
      <div
        id="reporte-estadistico"
        className="reporte-estadistico"
      >
        <header className="cabecera-reporte-pdf">
          <h1>
            {configuracion.titulo}
          </h1>

          <strong>
            {
              configuracion.nombreVariable
            }
          </strong>
        </header>

        <section className="seccion seccion-tabla-principal">
          <div className="titulo-seccion-tabla">
            <h2>
              Tabla de frecuencias
            </h2>

            <strong className="contador-muestras">
              {resumen.totalMuestras} muestras
            </strong>
          </div>

          <TablaFrecuencias
            frecuencias={frecuencias}
            nombreVariable={
              configuracion.nombreVariable
            }
          />
        </section>

        <section className="panel-inferior">
          <div className="columna-estadisticas">
            <TarjetaEstadistica
              titulo="Media"
              valor={resumen.media}
            />

            <TarjetaEstadistica
              titulo="Mediana"
              valor={resumen.mediana}
            />

            <TarjetaEstadistica
              titulo="Moda"
              valor={resumen.moda}
            />
          </div>

          <div className="columna-graficos no-pdf">
            <button
              type="button"
              className="boton-grafico"
              onClick={() =>
                setGraficoActivo(
                  "barras",
                )
              }
            >
              <span>
                Gráfico de
              </span>

              <strong>
                barras
              </strong>
            </button>

            <button
              type="button"
              className="boton-grafico"
              onClick={() =>
                setGraficoActivo(
                  "grupos",
                )
              }
            >
              <span>
                Gráfico por
              </span>

              <strong>
                grupos
              </strong>
            </button>

            <button
              type="button"
              className="boton-grafico"
              onClick={() =>
                setGraficoActivo(
                  "circular",
                )
              }
            >
              <span>
                Gráfico
              </span>

              <strong>
                circular
              </strong>
            </button>

            <button
              type="button"
              className="boton-grafico"
              onClick={() =>
                setGraficoActivo(
                  "histograma",
                )
              }
            >
              <span>
                Ver
              </span>

              <strong>
                histograma
              </strong>
            </button>
          </div>
        </section>

        <section className="graficos-pdf">
          <h2>
            Gráficos estadísticos
          </h2>

          <div className="rejilla-graficos-pdf">
            <article className="grafico-pdf-item">
              <h3>
                Gráfico de barras
              </h3>

              <VistaGrafico
                tipo="barras"
                frecuencias={
                  frecuencias
                }
              />
            </article>

            <article className="grafico-pdf-item">
              <h3>
                Gráfico por grupos
              </h3>

              <VistaGrafico
                tipo="grupos"
                frecuencias={
                  frecuencias
                }
              />
            </article>

            <article className="grafico-pdf-item">
              <h3>
                Gráfico circular
              </h3>

              <VistaGrafico
                tipo="circular"
                frecuencias={
                  frecuencias
                }
              />
            </article>

            <article className="grafico-pdf-item">
              <h3>
                Histograma
              </h3>

              <VistaGrafico
                tipo="histograma"
                frecuencias={
                  frecuencias
                }
              />
            </article>
          </div>
        </section>
      </div>

      {graficoActivo ? (
        <Graficos
          tipo={graficoActivo}
          frecuencias={frecuencias}
          nombreVariable={
            configuracion.nombreVariable
          }
          cerrar={() =>
            setGraficoActivo(null)
          }
        />
      ) : null}
    </main>
  );
}

export default Inicio;