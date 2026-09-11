interface Propiedades {
  titulo: string;
  valor: string | number;
  descripcion?: string;
}

function TarjetaEstadistica({
  titulo,
  valor,
  descripcion,
}: Propiedades) {
  return (
    <article className="tarjeta-estadistica">
      <p className="titulo-tarjeta">{titulo}</p>

      <strong className="valor-tarjeta">{valor}</strong>

      {descripcion && (
        <p className="descripcion-tarjeta">{descripcion}</p>
      )}
    </article>
  );
}

export default TarjetaEstadistica;