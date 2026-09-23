import imagenBTS from '../assets/images/Kyogre.jpg';

function Nosotros() {
  return (
    <div className="page-container">
      <h1 className="page-title">👥 Sobre Nosotros</h1>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card-custom">
            <h3>Nuestra Misión</h3>
            <p className="page-content">
              Crear aplicaciones web excepcionales que resuelvan problemas reales 
              y mejoren la vida de las personas a través de la tecnología.
            </p>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card-custom">
            <h3>Nuestra Visión</h3>
            <p className="page-content">
              Ser líderes en desarrollo de software, reconocidos por nuestra 
              calidad, innovación y compromiso con la excelencia.
            </p>
          </div>
        </div>
      </div>

      <div className="card-custom">
        <h3>Nuestro Equipo</h3>
        <p className="page-content">
          Somos un grupo de desarrolladores apasionados por la tecnología, 
          siempre aprendiendo y mejorando nuestras habilidades.
        </p>
        <img 
          src={imagenBTS}
          alt="Equipo de trabajo"
          className="img-responsive"
        />
      </div>
    </div>
  );
}

export default Nosotros;