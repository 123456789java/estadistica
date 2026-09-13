import type { Pagina } from "../types/estadistica";

interface Propiedades {
  paginaActiva: Pagina;
  titulo: string;
  descargando: boolean;
  cambiarPagina: (pagina: Pagina) => void;
  descargarPdf: () => void;
}

function BarraNavegacion({
  paginaActiva,
  titulo,
  descargando,
  cambiarPagina,
  descargarPdf,
}: Propiedades) {
  return (
    <header className="barra-navegacion">
      <div className="marca-aplicacion">
        <h1>{titulo}</h1>
      </div>

      <nav
        className="menu-principal"
        aria-label="Navegación principal"
      >
        <button
          type="button"
          className={
            paginaActiva === "inicio"
              ? "activo"
              : ""
          }
          onClick={() =>
            cambiarPagina("inicio")
          }
        >
          Inicio
        </button>

        <button
          type="button"
          onClick={descargarPdf}
          disabled={descargando}
        >
          {descargando
            ? "Generando..."
            : "Descargar PDF"}
        </button>

        <button
          type="button"
          className={
            paginaActiva === "editar"
              ? "activo"
              : ""
          }
          onClick={() =>
            cambiarPagina("editar")
          }
        >
          Editar
        </button>
      </nav>
    </header>
  );
}

export default BarraNavegacion;