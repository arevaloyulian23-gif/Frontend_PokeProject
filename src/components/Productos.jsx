import { useEffect, useState } from 'react';
import { Table, Container, Alert, Spinner, Button, Modal, Form } from 'react-bootstrap';
import api from '../services/api';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // Estados para el Modal (Crear / Editar)
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoActual, setProductoActual] = useState({ id_producto: null, nomProducto: '', cantidad: '', precio: '' });

  // 1. LEER (Obtener productos)
  const cargarProductos = async () => {
    try {
      const res = await api.get('/productos');
      setProductos(res.data);
      setCargando(false);
    } catch (err) {
      console.error('Error al obtener productos:', err);
      setError('No se pudieron cargar los productos.');
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // Abrir modal para Crear
  const handleNuevo = () => {
    setModoEdicion(false);
    setProductoActual({ id_producto: null, nomProducto: '', cantidad: '', precio: '' });
    setShowModal(true);
  };

  // Abrir modal para Editar
  const handleEditar = (producto) => {
    setModoEdicion(true);
    setProductoActual(producto);
    setShowModal(true);
  };

  // 2 y 3. CREAR O ACTUALIZAR (Submit del Formulario)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');

    try {
      if (modoEdicion) {
        const res = await api.put(`/productos/${productoActual.id_producto}`, productoActual);
        setMensajeExito(res.data.message || 'Producto actualizado correctamente');
      } else {
        await api.post('/productos', productoActual);
        setMensajeExito('Producto agregado correctamente');
      }
      setShowModal(false);
      cargarProductos();
    } catch (err) {
      console.error('Error al guardar el producto:', err);
      const msg = err.response?.data?.message || 'Error al guardar la información.';
      setError(msg);
    }
  };

  // 4. ELIMINAR
  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      setError('');
      setMensajeExito('');
      try {
        const res = await api.delete(`/productos/${id}`);
        setMensajeExito(res.data.message || 'Producto eliminado con éxito');
        cargarProductos();
      } catch (err) {
        console.error('Error al eliminar producto:', err);
        const msg = err.response?.data?.message || 'No se pudo eliminar el producto.';
        setError(msg);
      }
    }
  };

  if (cargando) return <Container className="mt-4"><Spinner animation="border" /></Container>;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de Productos</h2>
        <Button variant="success" onClick={handleNuevo}>+ Nuevo Producto</Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {mensajeExito && <Alert variant="success" dismissible onClose={() => setMensajeExito('')}>{mensajeExito}</Alert>}

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id_producto}>
              <td>{p.id_producto}</td>
              <td>{p.nomProducto}</td>
              <td>{p.cantidad}</td>
              <td>${p.precio}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditar(p)}>Editar</Button>
                <Button variant="danger" size="sm" onClick={() => handleEliminar(p.id_producto)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para Crear/Editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modoEdicion ? 'Editar Producto' : 'Nuevo Producto'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Producto</Form.Label>
              <Form.Control
                type="text"
                required
                value={productoActual.nomProducto}
                onChange={(e) => setProductoActual({ ...productoActual, nomProducto: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                required
                value={productoActual.cantidad}
                onChange={(e) => setProductoActual({ ...productoActual, cantidad: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                required
                value={productoActual.precio}
                onChange={(e) => setProductoActual({ ...productoActual, precio: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">{modoEdicion ? 'Guardar Cambios' : 'Crear'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}