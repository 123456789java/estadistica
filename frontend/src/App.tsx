import { useState } from "react";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import BarraNavegacion from "./components/BarraNavegacion";
import Encuesta from "./pages/Encuesta";
import Inicio from "./pages/Inicio";

import {
  datosPrueba,
} from "./data/datosPrueba";

import type {
  ConfiguracionEncuesta,
  Pagina,
  RegistroEncuesta,
} from "./types/estadistica";

const CLAVE_ALMACENAMIENTO =
  "estadistica-configuracion-v2";

function clonarDatosIniciales():
  ConfiguracionEncuesta {
  return {
    ...datosPrueba,
    registros:
      datosPrueba.registros.map(
        (registro) => ({
          ...registro,
        }),
      ),
  };
}

function esRegistroValido(
  valor: unknown,
): valor is RegistroEncuesta {
  if (
    !valor ||
    typeof valor !== "object"
  ) {
    return false;
  }

  const registro =
    valor as Record<
      string,
      unknown
    >;

  return (
    typeof registro.id ===
      "number" &&
    typeof registro.nombre ===
      "string" &&
    typeof registro.valor ===
      "string"
  );
}

function cargarConfiguracion():
  ConfiguracionEncuesta {
  if (
    typeof window ===
    "undefined"
  ) {
    return clonarDatosIniciales();
  }

  try {
    const guardado =
      window.localStorage.getItem(
        CLAVE_ALMACENAMIENTO,
      );

    if (!guardado) {
      return clonarDatosIniciales();
    }

    const datos =
      JSON.parse(
        guardado,
      ) as Partial<ConfiguracionEncuesta>;

    if (
      typeof datos.titulo !==
        "string" ||
      typeof datos.nombreMuestra !==
        "string" ||
      typeof datos.nombreVariable !==
        "string" ||
      !Array.isArray(
        datos.registros,
      ) ||
      !datos.registros.every(
        esRegistroValido,
      )
    ) {
      return clonarDatosIniciales();
    }

    return {
      titulo:
        datos.titulo,
      nombreMuestra:
        datos.nombreMuestra,
      nombreVariable:
        datos.nombreVariable,
      registros:
        datos.registros,
    };
  } catch {
    return clonarDatosIniciales();
  }
}

function nombreArchivoSeguro(
  titulo: string,
): string {
  const limpio = titulo
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .replace(
      /[^a-zA-Z0-9-_ ]/g,
      "",
    )
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();

  return (
    limpio ||
    "reporte-estadistico"
  );
}

function App() {
  const [
    paginaActiva,
    setPaginaActiva,
  ] =
    useState<Pagina>(
      "inicio",
    );

  const [
    configuracion,
    setConfiguracion,
  ] =
    useState<ConfiguracionEncuesta>(
      cargarConfiguracion,
    );

  const [
    descargando,
    setDescargando,
  ] = useState(false);

  function guardarConfiguracion(
    nuevaConfiguracion:
      ConfiguracionEncuesta,
  ) {
    setConfiguracion(
      nuevaConfiguracion,
    );

    window.localStorage.setItem(
      CLAVE_ALMACENAMIENTO,
      JSON.stringify(
        nuevaConfiguracion,
      ),
    );

    setPaginaActiva("inicio");
  }

  async function descargarPdf() {
    if (descargando) {
      return;
    }

    setDescargando(true);
    setPaginaActiva("inicio");

    try {
      await new Promise<void>(
        (resolver) => {
          window.setTimeout(
            resolver,
            150,
          );
        },
      );

      if (
        document.fonts?.ready
      ) {
        await document.fonts.ready;
      }

      const reporte =
        document.getElementById(
          "reporte-estadistico",
        );

      if (!reporte) {
        throw new Error(
          "No se encontró el reporte",
        );
      }

      const lienzo =
        await html2canvas(
          reporte,
          {
            scale: 2,
            useCORS: true,
            backgroundColor:
              "#ffffff",
            logging: false,
            onclone: (
              documentoClonado,
            ) => {
              documentoClonado.body.classList.add(
                "modo-pdf",
              );
            },
          },
        );

      const imagen =
        lienzo.toDataURL(
          "image/png",
          1,
        );

      const pdf =
        new jsPDF({
          orientation:
            "portrait",
          unit: "mm",
          format: "a4",
        });

      const anchoPagina =
        pdf.internal.pageSize.getWidth();

      const altoPagina =
        pdf.internal.pageSize.getHeight();

      const margen = 8;

      const anchoUtil =
        anchoPagina -
        margen * 2;

      const altoUtil =
        altoPagina -
        margen * 2;

      const altoImagen =
        (lienzo.height *
          anchoUtil) /
        lienzo.width;

      let desplazamiento = 0;

      while (
        desplazamiento <
        altoImagen
      ) {
        if (
          desplazamiento > 0
        ) {
          pdf.addPage();
        }

        pdf.addImage(
          imagen,
          "PNG",
          margen,
          margen -
            desplazamiento,
          anchoUtil,
          altoImagen,
          undefined,
          "FAST",
        );

        desplazamiento +=
          altoUtil;
      }

      pdf.save(
        `${nombreArchivoSeguro(
          configuracion.titulo,
        )}.pdf`,
      );
    } catch (error) {
      console.error(error);

      window.alert(
        "No se pudo generar el PDF.",
      );
    } finally {
      setDescargando(
        false,
      );
    }
  }

  return (
    <div className="aplicacion">
      <BarraNavegacion
        paginaActiva={
          paginaActiva
        }
        titulo={
          configuracion.titulo
        }
        descargando={
          descargando
        }
        cambiarPagina={
          setPaginaActiva
        }
        descargarPdf={
          descargarPdf
        }
      />

      {paginaActiva ===
      "inicio" ? (
        <Inicio
          configuracion={
            configuracion
          }
        />
      ) : null}

      {paginaActiva ===
      "editar" ? (
        <Encuesta
          configuracion={
            configuracion
          }
          guardarConfiguracion={
            guardarConfiguracion
          }
          cancelar={() =>
            setPaginaActiva(
              "inicio",
            )
          }
        />
      ) : null}
    </div>
  );
}

export default App;