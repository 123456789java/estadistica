import type { Pagina } from "../types/estadistica";

interface Propiedades {
  paginaActiva: Pagina;
  cambiarPagina: (pagina: Pagina) => void;
}

function BarraNavegacion({
  paginaActiva,
  cambiarPagina,
}: Propiedades) {
  return (
    <header className="barra-navegacion">
      <div>
        <h1>Estadística del Sueño</h1>
        <p>Encuesta realizada a 80 personas</p>
      </div>

      <nav className="menu-principal">
        <button
          className={paginaActiva === "inicio" ? "activo" : ""}
          onClick={() => cambiarPagina("inicio")}
        >
          Inicio
        </button>

        <button
          className={paginaActiva === "encuesta" ? "activo" : ""}
          onClick={() => cambiarPagina("encuesta")}
        >
          Encuesta
        </button>

        <button
          className={paginaActiva === "graficos" ? "activo" : ""}
          onClick={() => cambiarPagina("graficos")}
        >
          Gráficos
        </button>
      </nav>
    </header>
  );
}

export default BarraNavegacion;