import imagenDescarga from '../assets/images/Groudon.jpg';

function Servicios() {
  return (
    <div className="page-container">
      <h1 className="page-title">💼 Nuestros Servicios</h1>
      
      <div className="row">
        <div className="col-md-4">
          <div className="card-custom text-center">
            <h2>📱</h2>
            <h3>Desarrollo Web</h3>
            <p className="page-content">
              Creamos sitios web modernos y responsivos usando React y las 
              últimas tecnologías.
            </p>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card-custom text-center">
            <h2>📊</h2>
            <h3>Aplicaciones Móviles</h3>
            <p className="page-content">
              Desarrollamos apps móviles nativas y multiplataforma para 
              iOS y Android.
            </p>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card-custom text-center">
            <h2>☁️</h2>
            <h3>Consultoría Cloud</h3>
            <p className="page-content">
              Asesoramiento en infraestructura cloud y migración de 
              aplicaciones.
            </p>
          </div>
        </div>
      </div>

      <div className="card-custom text-center">
        <img 
          src={imagenDescarga}
          alt="Servicios"
          className="img-responsive mb-3"
        />
        <h3>¿Necesitas algo más?</h3>
        <p className="page-content">
          ¡Contáctanos y te ayudaremos con tu proyecto!
        </p>
        <button className="btn-custom">Contáctanos</button>
      </div>
    </div>
  );
}

export default Servicios;