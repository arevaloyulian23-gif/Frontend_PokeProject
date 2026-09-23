import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import imagenContacto from '../assets/images/KiogreAndGroudon.jpg';

function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('¡Mensaje enviado! Gracias por contactarnos.');
    setFormData({
      nombre: '',
      email: '',
      mensaje: ''
    });
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Contáctanos</h1>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card-custom">
            <h3>Información de Contacto</h3>
            <p className="page-content">
              <strong> Dirección:</strong> Calle Principal #123<br />
              <strong> Email:</strong> info@miproyecto.com<br />
              <strong> Teléfono:</strong> +123 456 7890<br />
              <strong> Horario:</strong> Lunes a Viernes 9am - 6pm
            </p>
            
            <img 
              src={imagenContacto}
              alt="Oficina"
              className="img-responsive mt-3"
            />
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card-custom">
            <h3>Envíanos un Mensaje</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre completo</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ingresa tu nombre"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tucorreo@email.com"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mensaje</Form.Label>
                <Form.Control
                  as="textarea"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Escribe tu mensaje aquí..."
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="btn-custom w-100">
                Enviar mensaje
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacto;