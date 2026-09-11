import { useState } from "react";

import BarraNavegacion from "./components/BarraNavegacion";

import Inicio from "./pages/Inicio";
import Encuesta from "./pages/Encuesta";
import Graficos from "./pages/Graficos";

import { datosPrueba } from "./data/datosPrueba";

import type {
  HoraDormir,
  Pagina,
  RegistroEncuesta,
} from "./types/estadistica";

function App() {
  const [paginaActiva, setPaginaActiva] =
    useState<Pagina>("inicio");

  const [registros, setRegistros] =
    useState<RegistroEncuesta[]>(datosPrueba);

  function actualizarHora(
    id: number,
    nuevaHora: HoraDormir,
  ) {
    setRegistros((datosActuales) =>
      datosActuales.map((registro) =>
        registro.id === id
          ? {
              ...registro,
              horaDormir: nuevaHora,
            }
          : registro,
      ),
    );
  }

  return (
    <div className="aplicacion">
      <BarraNavegacion
        paginaActiva={paginaActiva}
        cambiarPagina={setPaginaActiva}
      />

      {paginaActiva === "inicio" && (
        <Inicio registros={registros} />
      )}

      {paginaActiva === "encuesta" && (
        <Encuesta
          registros={registros}
          actualizarHora={actualizarHora}
        />
      )}

      {paginaActiva === "graficos" && (
        <Graficos registros={registros} />
      )}
    </div>
  );
}

export default App;