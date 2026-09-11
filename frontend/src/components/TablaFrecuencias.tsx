import type { FilaFrecuencia } from "../types/estadistica";

interface Propiedades {
  frecuencias: FilaFrecuencia[];
}

function TablaFrecuencias({ frecuencias }: Propiedades) {
  return (
    <div className="contenedor-tabla">
      <table className="tabla-frecuencias">
        <thead>
          <tr>
            <th>Hora</th>
            <th>fi</th>
            <th>Fi</th>
            <th>hi</th>
            <th>Hi</th>
            <th>%</th>
          </tr>
        </thead>

        <tbody>
          {frecuencias.map((fila) => (
            <tr key={fila.hora}>
              <td>{fila.hora}</td>

              <td>{fila.frecuenciaAbsoluta}</td>

              <td>{fila.frecuenciaAcumulada}</td>

              <td>{fila.frecuenciaRelativa.toFixed(3)}</td>

              <td>
                {fila.frecuenciaRelativaAcumulada.toFixed(3)}
              </td>

              <td>{fila.porcentaje.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaFrecuencias;