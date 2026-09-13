import {
  useEffect,
  useState,
} from "react";

import type {
  ConfiguracionEncuesta,
  RegistroEncuesta,
} from "../types/estadistica";

interface Propiedades {
  configuracion: ConfiguracionEncuesta;
  guardarConfiguracion: (
    configuracion: ConfiguracionEncuesta,
  ) => void;
  cancelar: () => void;
}

function clonarConfiguracion(
  configuracion: ConfiguracionEncuesta,
): ConfiguracionEncuesta {
  return {
    ...configuracion,
    registros:
      configuracion.registros.map(
        (registro) => ({
          ...registro,
        }),
      ),
  };
}

function Encuesta({
  configuracion,
  guardarConfiguracion,
  cancelar,
}: Propiedades) {
  const [
    borrador,
    setBorrador,
  ] =
    useState<ConfiguracionEncuesta>(
      () =>
        clonarConfiguracion(
          configuracion,
        ),
    );

  useEffect(() => {
    setBorrador(
      clonarConfiguracion(
        configuracion,
      ),
    );
  }, [configuracion]);

  function actualizarCampo(
    campo:
      | "titulo"
      | "nombreMuestra"
      | "nombreVariable",
    valor: string,
  ) {
    setBorrador(
      (actual) => ({
        ...actual,
        [campo]: valor,
      }),
    );
  }

  function actualizarRegistro(
    id: number,
    campo:
      | "nombre"
      | "valor",
    valor: string,
  ) {
    setBorrador(
      (actual) => ({
        ...actual,
        registros:
          actual.registros.map(
            (registro) =>
              registro.id === id
                ? {
                    ...registro,
                    [campo]:
                      valor,
                  }
                : registro,
          ),
      }),
    );
  }

  function eliminarRegistro(
    id: number,
  ) {
    setBorrador(
      (actual) => ({
        ...actual,
        registros:
          actual.registros.filter(
            (registro) =>
              registro.id !== id,
          ),
      }),
    );
  }

  function agregarRegistro() {
    setBorrador(
      (actual) => {
        const id =
          Math.max(
            0,
            ...actual.registros.map(
              (registro) =>
                registro.id,
            ),
          ) + 1;

        const nombreBase =
          actual.nombreMuestra.trim() ||
          "Muestra";

        return {
          ...actual,
          registros: [
            ...actual.registros,
            {
              id,
              nombre:
                `${nombreBase} ${id}`,
              valor: "",
            },
          ],
        };
      },
    );
  }

  function cambiarCantidad(
    nuevaCantidad: number,
  ) {
    const cantidad = Math.max(
      0,
      Math.min(
        1000,
        Math.trunc(
          nuevaCantidad,
        ),
      ),
    );

    setBorrador(
      (actual) => {
        if (
          cantidad ===
          actual.registros.length
        ) {
          return actual;
        }

        if (
          cantidad <
          actual.registros.length
        ) {
          return {
            ...actual,
            registros:
              actual.registros.slice(
                0,
                cantidad,
              ),
          };
        }

        const registrosNuevos:
          RegistroEncuesta[] =
            [];

        const nombreBase =
          actual.nombreMuestra.trim() ||
          "Muestra";

        let id =
          Math.max(
            0,
            ...actual.registros.map(
              (registro) =>
                registro.id,
            ),
          ) + 1;

        for (
          let i =
            actual.registros.length;
          i < cantidad;
          i += 1
        ) {
          registrosNuevos.push({
            id,
            nombre:
              `${nombreBase} ${id}`,
            valor: "",
          });

          id += 1;
        }

        return {
          ...actual,
          registros: [
            ...actual.registros,
            ...registrosNuevos,
          ],
        };
      },
    );
  }

  function renombrarMuestras() {
    setBorrador(
      (actual) => {
        const nombreBase =
          actual.nombreMuestra.trim() ||
          "Muestra";

        return {
          ...actual,
          registros:
            actual.registros.map(
              (
                registro,
                indice,
              ) => ({
                ...registro,
                nombre:
                  `${nombreBase} ${
                    indice + 1
                  }`,
              }),
            ),
        };
      },
    );
  }

  function guardar() {
    const configuracionLimpia:
      ConfiguracionEncuesta = {
      titulo:
        borrador.titulo.trim() ||
        "Datos estadísticos",

      nombreMuestra:
        borrador.nombreMuestra.trim() ||
        "Muestra",

      nombreVariable:
        borrador.nombreVariable.trim() ||
        "Dato",

      registros:
        borrador.registros.map(
          (
            registro,
            indice,
          ) => ({
            ...registro,
            nombre:
              registro.nombre.trim() ||
              `${
                borrador.nombreMuestra.trim() ||
                "Muestra"
              } ${indice + 1}`,
            valor:
              registro.valor.trim(),
          }),
        ),
    };

    guardarConfiguracion(
      configuracionLimpia,
    );
  }

  return (
    <main className="pagina pagina-edicion">
      <section className="encabezado-pagina-edicion">
        <h2>
          Configura las muestras y sus datos
        </h2>

        <div className="acciones-edicion-superiores">
          <button
            type="button"
            className="boton-general"
            onClick={cancelar}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="boton-general"
            onClick={guardar}
          >
            Guardar datos
          </button>
        </div>
      </section>

      <section className="seccion seccion-configuracion">
        <div className="rejilla-configuracion">
          <label className="campo-formulario">
            <strong>
              Título de la aplicación
            </strong>

            <input
              type="text"
              value={
                borrador.titulo
              }
              onChange={(
                evento,
              ) =>
                actualizarCampo(
                  "titulo",
                  evento.target
                    .value,
                )
              }
            />
          </label>

          <label className="campo-formulario">
            <strong>
              Nombre de la muestra
            </strong>

            <input
              type="text"
              value={
                borrador.nombreMuestra
              }
              onChange={(
                evento,
              ) =>
                actualizarCampo(
                  "nombreMuestra",
                  evento.target
                    .value,
                )
              }
            />
          </label>

          <label className="campo-formulario">
            <strong>
              Nombre del dato o variable
            </strong>

            <input
              type="text"
              value={
                borrador.nombreVariable
              }
              onChange={(
                evento,
              ) =>
                actualizarCampo(
                  "nombreVariable",
                  evento.target
                    .value,
                )
              }
            />
          </label>
        </div>

        <div className="controles-cantidad">
          <div className="control-cantidad">
            <strong>
              Cantidad de muestras
            </strong>

            <div className="selector-cantidad">
              <button
                type="button"
                onClick={() =>
                  cambiarCantidad(
                    borrador
                      .registros
                      .length - 1,
                  )
                }
              >
                −
              </button>

              <input
                type="number"
                min="0"
                max="1000"
                value={
                  borrador
                    .registros
                    .length
                }
                onChange={(
                  evento,
                ) =>
                  cambiarCantidad(
                    Number(
                      evento.target
                        .value,
                    ),
                  )
                }
              />

              <button
                type="button"
                onClick={() =>
                  cambiarCantidad(
                    borrador
                      .registros
                      .length + 1,
                  )
                }
              >
                +
              </button>
            </div>
          </div>

          <div className="acciones-muestras">
            <button
              type="button"
              className="boton-general"
              onClick={
                renombrarMuestras
              }
            >
              Renombrar muestras
            </button>

            <button
              type="button"
              className="boton-general"
              onClick={
                agregarRegistro
              }
            >
              + Agregar muestra
            </button>
          </div>
        </div>
      </section>

      <section className="seccion seccion-tabla-edicion">
        <div className="cabecera-tabla-edicion">
          <h3>
            Datos de la encuesta
          </h3>
        </div>

        <div className="contenedor-tabla tabla-edicion-contenedor">
          <table className="tabla-frecuencias tabla-edicion">
            <thead>
              <tr>
                <th>
                  {borrador.nombreMuestra ||
                    "Muestra"}
                </th>

                <th>
                  {borrador.nombreVariable ||
                    "Dato"}
                </th>

                <th>
                  Acción
                </th>
              </tr>
            </thead>

            <tbody>
              {borrador
                .registros
                .length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="tabla-vacia"
                  >
                    No hay muestras
                  </td>
                </tr>
              ) : (
                borrador.registros.map(
                  (registro) => (
                    <tr
                      key={
                        registro.id
                      }
                    >
                      <td>
                        <input
                          type="text"
                          value={
                            registro.nombre
                          }
                          onChange={(
                            evento,
                          ) =>
                            actualizarRegistro(
                              registro.id,
                              "nombre",
                              evento
                                .target
                                .value,
                            )
                          }
                        />
                      </td>

                      <td>
                        <input
                          type="text"
                          value={
                            registro.valor
                          }
                          onChange={(
                            evento,
                          ) =>
                            actualizarRegistro(
                              registro.id,
                              "valor",
                              evento
                                .target
                                .value,
                            )
                          }
                        />
                      </td>

                      <td>
                        <button
                          type="button"
                          className="boton-eliminar"
                          onClick={() =>
                            eliminarRegistro(
                              registro.id,
                            )
                          }
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ),
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="acciones-finales-edicion">
          <button
            type="button"
            className="boton-general"
            onClick={cancelar}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="boton-general"
            onClick={guardar}
          >
            Guardar datos
          </button>
        </div>
      </section>
    </main>
  );
}

export default Encuesta;