import type {
  FilaFrecuencia,
} from "../types/estadistica";

interface Propiedades {
  frecuencias: FilaFrecuencia[];
  nombreVariable: string;
}

function TablaFrecuencias({
  frecuencias,
  nombreVariable,
}: Propiedades) {
  return (
    <div className="contenedor-tabla">
      <table className="tabla-frecuencias">
        <thead>
          <tr>
            <th>
              {nombreVariable || "Dato"}
            </th>

            <th>fi</th>
            <th>Fi</th>
            <th>hi</th>
            <th>Hi</th>
            <th>%</th>
          </tr>
        </thead>

        <tbody>
          {frecuencias.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="tabla-vacia"
              >
                No hay datos guardados
                para calcular frecuencias.
              </td>
            </tr>
          ) : (
            frecuencias.map((fila) => (
              <tr key={fila.valor}>
                <td>{fila.valor}</td>

                <td>
                  {
                    fila.frecuenciaAbsoluta
                  }
                </td>

                <td>
                  {
                    fila.frecuenciaAcumulada
                  }
                </td>

                <td>
                  {fila.frecuenciaRelativa.toFixed(
                    3,
                  )}
                </td>

                <td>
                  {fila.frecuenciaRelativaAcumulada.toFixed(
                    3,
                  )}
                </td>

                <td>
                  {fila.porcentaje.toFixed(
                    2,
                  )}
                  %
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TablaFrecuencias;