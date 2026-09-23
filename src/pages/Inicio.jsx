import { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import './Inicio.css';

// Imágenes
import imagen1 from '../assets/images/Kyogre.jpg';
import imagen2 from '../assets/images/Groudon.jpg';
import imagen3 from '../assets/images/Rayquaza.jpg';

// Componentes
import FormularioAuth from '../components/FormularioAuth.jsx';

function Inicio() {
  const [count, setCount] = useState(0);

  // Actualiza el título de la pestaña según el contador
  useEffect(() => {
    document.title = `Inicio - Clics: ${count}`;
  }, [count]);

  return (
    <div className="page-container">

      <h2 className="text-center mb-3">Pokémon Legendarios</h2>

      <div className="my-4">
        <FormularioAuth />
      </div>
      
      {/* Carrusel con imágenes de Pokémon */}
      <Carousel className="mb-5" indicators={true} controls={true}>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={imagen1}
            alt="Kyogre"
          />
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={imagen2}
            alt="Groudon"
          />
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={imagen3}
            alt="Rayquaza"
          />
        </Carousel.Item>
      </Carousel>

      {/* Formulario de Autenticación */}
      

      {/* Contenido principal y Contador */}
      <h1 className="page-title text-center">Bienvenido</h1>
      <div className="card-custom text-center">
        <p className="page-content">
          Este es mi primer proyecto React con Vite. Aquí aprenderé a crear 
          aplicaciones web modernas usando las mejores herramientas del mercado.
        </p>

        <div className="d-flex flex-column align-items-center my-3">
          <button
            type="button"
            className="btn btn-primary btn-custom"
            onClick={() => setCount((prev) => prev + 1)}
          >
            ¡Comenzar! (Clics: {count})
          </button>
        </div>
      </div>
    </div>
  );
}

export default Inicio;