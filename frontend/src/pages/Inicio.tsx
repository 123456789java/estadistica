import TablaFrecuencias from "../components/TablaFrecuencias";
import TarjetaEstadistica from "../components/TarjetaEstadistica";

import {
  calcularFrecuencias,
  calcularResumen,
} from "../services/puenteCpp";

import type { RegistroEncuesta } from "../types/estadistica";

interface Propiedades {
  registros: RegistroEncuesta[];
}

function Inicio({ registros }: Propiedades) {
  const resumen = calcularResumen(registros);
  const frecuencias = calcularFrecuencias(registros);

  return (
    <main className="pagina">
      <section className="encabezado-pagina">
        <h2>Resumen estadístico</h2>

        <p>
          Análisis de los horarios en los que las personas se van a dormir.
        </p>
      </section>

      <section className="contenedor-tarjetas">
        <TarjetaEstadistica
          titulo="Personas encuestadas"
          valor={resumen.totalPersonas}
        />

        <TarjetaEstadistica
          titulo="Media"
          valor={resumen.media}
          descripcion="Hora promedio"
        />

        <TarjetaEstadistica
          titulo="Mediana"
          valor={resumen.mediana}
        />

        <TarjetaEstadistica
          titulo="Moda"
          valor={resumen.moda}
        />

        <TarjetaEstadistica
          titulo="Desviación estándar"
          valor={resumen.desviacionEstandar.toFixed(2)}
          descripcion="Expresada en horas"
        />
      </section>

      <section className="seccion">
        <h2>Tabla de frecuencias</h2>

        <p>
          Distribución de las personas según su hora de dormir.
        </p>

        <TablaFrecuencias frecuencias={frecuencias} />
      </section>
    </main>
  );
}

export default Inicio;