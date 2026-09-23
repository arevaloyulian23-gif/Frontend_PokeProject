import { useEffect, useState } from 'react';
import { Table, Container, Alert, Spinner, Button, Modal, Form, Badge } from 'react-bootstrap';
import api from '../services/api';

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]); // Para llenar el select de clientes
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // Estados para el Modal (Crear / Editar)
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [ventaActual, setVentaActual] = useState({
    id_venta: null,
    id_cliente: '',
    total: '',
    estado: 'Completada'
  });

  // Cargar Ventas y Clientes
  const cargarDatos = async () => {
    try {
      const [resVentas, resClientes] = await Promise.all([
        api.get('/ventas'),
        api.get('/clientes')
      ]);
      setVentas(resVentas.data);
      setClientes(resClientes.data);
      setCargando(false);
    } catch (err) {
      console.error('Error al obtener datos:', err);
      setError('No se pudieron cargar los registros.');
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Abrir Modal Crear
  const handleNuevaVenta = () => {
    setModoEdicion(false);
    setVentaActual({
      id_venta: null,
      id_cliente: clientes.length > 0 ? clientes[0].id_cliente : '',
      total: '',
      estado: 'Completada'
    });
    setShowModal(true);
  };

  // Abrir Modal Editar
  const handleEditarVenta = (v) => {
    setModoEdicion(true);
    setVentaActual({
      id_venta: v.id_venta,
      id_cliente: v.id_cliente,
      total: v.total,
      estado: v.estado
    });
    setShowModal(true);
  };

  // Submit (Guardar / Actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');

    try {
      if (modoEdicion) {
        const res = await api.put(`/ventas/${ventaActual.id_venta}`, ventaActual);
        setMensajeExito(res.data.message || 'Venta actualizada correctamente');
      } else {
        const res = await api.post('/ventas', ventaActual);
        setMensajeExito(res.data.message || 'Venta registrada con éxito');
      }
      setShowModal(false);
      cargarDatos();
    } catch (err) {
      console.error('Error al guardar la venta:', err);
      const msg = err.response?.data?.message || 'Error al procesar la venta.';
      setError(msg);
    }
  };

  // Eliminar Venta
  const handleEliminarVenta = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta venta?')) {
      setError('');
      setMensajeExito('');
      try {
        const res = await api.delete(`/ventas/${id}`);
        setMensajeExito(res.data.message || 'Venta eliminada con éxito');
        cargarDatos();
      } catch (err) {
        console.error('Error al eliminar venta:', err);
        const msg = err.response?.data?.message || 'No se pudo eliminar la venta.';
        setError(msg);
      }
    }
  };

  if (cargando) return <Container className="mt-4"><Spinner animation="border" /></Container>;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Historial de Ventas</h2>
        <Button variant="success" onClick={handleNuevaVenta}>+ Nueva Venta</Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {mensajeExito && <Alert variant="success" dismissible onClose={() => setMensajeExito('')}>{mensajeExito}</Alert>}

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Cliente</th>
            <th>Fecha de Venta</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((v) => (
            <tr key={v.id_venta}>
              <td>{v.id_venta}</td>
              <td>{v.nomCliente ? v.nomCliente : `ID Cliente: ${v.id_cliente}`}</td>
              <td>{new Date(v.fecha_venta).toLocaleString()}</td>
              <td>${v.total}</td>
              <td>
                <Badge bg={v.estado === 'Completada' ? 'success' : v.estado === 'Pendiente' ? 'warning' : 'danger'}>
                  {v.estado}
                </Badge>
              </td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditarVenta(v)}>Editar</Button>
                <Button variant="danger" size="sm" onClick={() => handleEliminarVenta(v.id_venta)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Crear / Editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modoEdicion ? 'Editar Venta' : 'Registrar Venta'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Cliente</Form.Label>
              <Form.Select
                required
                value={ventaActual.id_cliente}
                onChange={(e) => setVentaActual({ ...ventaActual, id_cliente: e.target.value })}
              >
                <option value="">Seleccione un cliente...</option>
                {clientes.map((c) => (
                  <option key={c.id_cliente} value={c.id_cliente}>
                    {c.nomCliente} (ID: {c.id_cliente})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Total ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                required
                value={ventaActual.total}
                onChange={(e) => setVentaActual({ ...ventaActual, total: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={ventaActual.estado}
                onChange={(e) => setVentaActual({ ...ventaActual, estado: e.target.value })}
              >
                <option value="Completada">Completada</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Cancelada">Cancelada</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">{modoEdicion ? 'Guardar Cambios' : 'Registrar Venta'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}