import { useState } from 'react';

function FormularioAuth() {
  const [usuario, setUsuario] = useState('');
  const [pass, setPass] = useState('');
  const [mensaje, setMensaje] = useState('');

  const ValidarLogin = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: usuario,
          pass: pass,
        }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setMensaje(`Éxito: ${datos.mensaje}`);
        setUsuario('');
        setPass('');
      } else {
        setMensaje(`Error: ${datos.mensaje}`);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setMensaje('Error: No se pudo conectar con el servidor.');
    }
  };

  return (
    <div className="card p-4 shadow-sm" style={{ maxWidth: '350px', margin: '0 auto' }}>
      <h3 className="text-center mb-3">Iniciar Sesión</h3>
      <form onSubmit={ValidarLogin}>
        <div className="mb-3">
          <label className="form-label">Usuario:</label>
          <input
            type="text"
            className="form-control"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña:</label>
          <input
            type="password"
            className="form-control"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Ingresar
        </button>
      </form>

      {mensaje && (
        <div className="alert alert-info mt-3 text-center" role="alert">
          {mensaje}
        </div>
      )}
    </div>
  );
}

export default FormularioAuth;