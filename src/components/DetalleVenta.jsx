import { useEffect, useState } from 'react';
import { Table, Container, Alert, Spinner, Button, Modal, Form } from 'react-bootstrap';
import api from '../services/api';

export default function DetalleVenta() {
  const [detalles, setDetalles] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // Estados del Modal
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [detalleActual, setDetalleActual] = useState({
    id_detalle: null,
    id_venta: '',
    id_producto: '',
    cantidad: 1,
    precio_unitario: 0,
    subtotal: 0
  });

  // Cargar datos (Detalles, Ventas y Productos)
  const cargarDatos = async () => {
    try {
      const [resDetalles, resVentas, resProductos] = await Promise.all([
        api.get('/detalle_venta'),
        api.get('/ventas'),
        api.get('/productos')
      ]);
      setDetalles(resDetalles.data);
      setVentas(resVentas.data);
      setProductos(resProductos.data);
      setCargando(false);
    } catch (err) {
      console.error('Error al obtener datos:', err);
      setError('No se pudieron cargar los registros de detalle de venta.');
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Abrir Modal Crear
  const handleNuevoDetalle = () => {
    setModoEdicion(false);
    const primerProd = productos.length > 0 ? productos[0] : null;
    const precio = primerProd ? primerProd.precio : 0;

    setDetalleActual({
      id_detalle: null,
      id_venta: ventas.length > 0 ? ventas[0].id_venta : '',
      id_producto: primerProd ? (primerProd.id_producto || primerProd.id) : '',
      cantidad: 1,
      precio_unitario: precio,
      subtotal: precio * 1
    });
    setShowModal(true);
  };

  // Abrir Modal Editar
  const handleEditarDetalle = (d) => {
    setModoEdicion(true);
    setDetalleActual({
      id_detalle: d.id_detalle,
      id_venta: d.id_venta,
      id_producto: d.id_producto,
      cantidad: d.cantidad,
      precio_unitario: d.precio_unitario,
      subtotal: d.subtotal || (d.cantidad * d.precio_unitario)
    });
    setShowModal(true);
  };

  // Manejadores de cambios dinámicos
  const handleProductoChange = (idProd) => {
    const prodSeleccionado = productos.find(p => (p.id_producto || p.id) == idProd);
    const nuevoPrecio = prodSeleccionado ? prodSeleccionado.precio : 0;
    const nuevaCant = detalleActual.cantidad;

    setDetalleActual({
      ...detalleActual,
      id_producto: idProd,
      precio_unitario: nuevoPrecio,
      subtotal: nuevoPrecio * nuevaCant
    });
  };

  const handleCantidadChange = (cant) => {
    const cantidad = Number(cant);
    setDetalleActual({
      ...detalleActual,
      cantidad,
      subtotal: cantidad * detalleActual.precio_unitario
    });
  };

  // Guardar (Crear / Editar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');

    try {
      if (modoEdicion) {
        const res = await api.put(`/detalle_venta/${detalleActual.id_detalle}`, detalleActual);
        setMensajeExito(res.data.message || 'Detalle actualizado correctamente.');
      } else {
        const res = await api.post('/detalle_venta', detalleActual);
        setMensajeExito(res.data.message || 'Detalle registrado con éxito.');
      }
      setShowModal(false);
      cargarDatos();
    } catch (err) {
      console.error('Error al guardar detalle:', err);
      const msg = err.response?.data?.message || 'Error al procesar el detalle de venta.';
      setError(msg);
    }
  };

  // Eliminar
  const handleEliminar = async (id) => {
    if (window.confirm('¿Deseas eliminar este registro de detalle?')) {
      setError('');
      setMensajeExito('');
      try {
        const res = await api.delete(`/detalle_venta/${id}`);
        setMensajeExito(res.data.message || 'Detalle eliminado con éxito.');
        cargarDatos();
      } catch (err) {
        console.error('Error al eliminar detalle:', err);
        const msg = err.response?.data?.message || 'No se pudo eliminar el detalle.';
        setError(msg);
      }
    }
  };

  if (cargando) return <Container className="mt-4"><Spinner animation="border" /></Container>;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Detalle de Ventas</h2>
        <Button variant="success" onClick={handleNuevoDetalle}>+ Agregar Detalle</Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {mensajeExito && <Alert variant="success" dismissible onClose={() => setMensajeExito('')}>{mensajeExito}</Alert>}

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID Detalle</th>
            <th>ID Venta</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((d) => (
            <tr key={d.id_detalle}>
              <td>{d.id_detalle}</td>
              <td>Venta #{d.id_venta}</td>
              <td>{d.nomProducto ? d.nomProducto : `ID Producto: ${d.id_producto}`}</td>
              <td>{d.cantidad}</td>
              <td>${Number(d.precio_unitario).toFixed(2)}</td>
              <td>${Number(d.subtotal || (d.cantidad * d.precio_unitario)).toFixed(2)}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditarDetalle(d)}>Editar</Button>
                <Button variant="danger" size="sm" onClick={() => handleEliminar(d.id_detalle)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Crear / Editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modoEdicion ? 'Editar Detalle' : 'Nuevo Detalle de Venta'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Venta Perteneciente</Form.Label>
              <Form.Select
                required
                value={detalleActual.id_venta}
                onChange={(e) => setDetalleActual({ ...detalleActual, id_venta: e.target.value })}
              >
                <option value="">Seleccione una venta...</option>
                {ventas.map((v) => (
                  <option key={v.id_venta} value={v.id_venta}>
                    Venta #{v.id_venta} - Cliente: {v.nomCliente || v.id_cliente}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Producto</Form.Label>
              <Form.Select
                required
                value={detalleActual.id_producto}
                onChange={(e) => handleProductoChange(e.target.value)}
              >
                <option value="">Seleccione un producto...</option>
                {productos.map((p) => {
                  const idProd = p.id_producto || p.id;
                  return (
                    <option key={idProd} value={idProd}>
                      {p.nomProducto} (${p.precio})
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                min="1"
                required
                value={detalleActual.cantidad}
                onChange={(e) => handleCantidadChange(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio Unitario ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                readOnly
                value={detalleActual.precio_unitario}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Subtotal ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                readOnly
                value={detalleActual.subtotal}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">{modoEdicion ? 'Guardar Cambios' : 'Guardar Detalle'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}