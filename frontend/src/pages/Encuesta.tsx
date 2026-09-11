import { horasDisponibles } from "../services/puenteCpp";

import type {
  HoraDormir,
  RegistroEncuesta,
} from "../types/estadistica";

interface Propiedades {
  registros: RegistroEncuesta[];

  actualizarHora: (
    id: number,
    nuevaHora: HoraDormir,
  ) => void;
}

function Encuesta({
  registros,
  actualizarHora,
}: Propiedades) {
  return (
    <main className="pagina">
      <section className="encabezado-pagina">
        <h2>Datos de la encuesta</h2>

        <p>
          Modifica la hora de dormir correspondiente a cada persona.
        </p>
      </section>

      <section className="seccion">
        <div className="contenedor-tabla">
          <table className="tabla-frecuencias">
            <thead>
              <tr>
                <th>Persona</th>
                <th>Hora de dormir</th>
              </tr>
            </thead>

            <tbody>
              {registros.map((registro) => (
                <tr key={registro.id}>
                  <td>Persona {registro.id}</td>

                  <td>
                    <select
                      value={registro.horaDormir}
                      onChange={(evento) =>
                        actualizarHora(
                          registro.id,
                          evento.target.value as HoraDormir,
                        )
                      }
                    >
                      {horasDisponibles.map((hora) => (
                        <option key={hora} value={hora}>
                          {hora}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default Encuesta;