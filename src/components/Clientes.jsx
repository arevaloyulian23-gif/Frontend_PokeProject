import { useEffect, useState } from 'react';
import { Table, Container, Alert, Spinner, Button, Modal, Form } from 'react-bootstrap';
import api from '../services/api';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // Estados del Modal y Formulario
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    nomCliente: '',
    contacto: '',
    departamento: '',
    ciudad: ''
  });

  // Cargar lista de clientes
  const cargarClientes = () => {
    api.get('/clientes')
      .then((res) => {
        setClientes(res.data);
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al obtener clientes:', err);
        setError('No se pudieron cargar los clientes.');
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  // Manejo de Inputs
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Abrir y Limpiar Modal
  const handleOpenModal = (cliente = null) => {
    if (cliente) {
      setEditId(cliente.id_cliente);
      setForm({
        nomCliente: cliente.nomCliente || '',
        contacto: cliente.contacto || '',
        departamento: cliente.departamento || '',
        ciudad: cliente.ciudad || ''
      });
    } else {
      setEditId(null);
      setForm({ nomCliente: '', contacto: '', departamento: '', ciudad: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // Guardar (Crear o Editar)
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMensajeExito('');

    if (editId) {
      api.put(`/clientes/${editId}`, form)
        .then((res) => {
          setMensajeExito(res.data.message || 'Cliente actualizado correctamente.');
          cargarClientes();
          handleCloseModal();
        })
        .catch((err) => {
          const msg = err.response?.data?.message || 'Error al actualizar el cliente.';
          setError(msg);
        });
    } else {
      api.post('/clientes', form)
        .then((res) => {
          setMensajeExito('Cliente registrado correctamente.');
          cargarClientes();
          handleCloseModal();
        })
        .catch((err) => {
          const msg = err.response?.data?.message || 'Error al crear el cliente.';
          setError(msg);
        });
    }
  };

  // Eliminar
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      setError('');
      setMensajeExito('');

      api.delete(`/clientes/${id}`)
        .then((res) => {
          setMensajeExito(res.data.message || 'Cliente eliminado correctamente.');
          cargarClientes();
        })
        .catch((err) => {
          const msg = err.response?.data?.message || 'Error al eliminar el cliente.';
          setError(msg);
        });
    }
  };

  if (cargando) return <Container className="mt-4"><Spinner animation="border" /></Container>;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lista de Clientes</h2>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          + Agregar Cliente
        </Button>
      </div>

      {/* Alertas de Éxito y Error */}
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {mensajeExito && <Alert variant="success" dismissible onClose={() => setMensajeExito('')}>{mensajeExito}</Alert>}

      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Departamento</th>
            <th>Ciudad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id_cliente}>
              <td>{c.id_cliente}</td>
              <td>{c.nomCliente}</td>
              <td>{c.contacto}</td>
              <td>{c.departamento}</td>
              <td>{c.ciudad}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleOpenModal(c)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(c.id_cliente)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Crear/Editar */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Editar Cliente' : 'Nuevo Cliente'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Cliente</Form.Label>
              <Form.Control
                type="text"
                name="nomCliente"
                value={form.nomCliente}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contacto</Form.Label>
              <Form.Control
                type="text"
                name="contacto"
                value={form.contacto}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Departamento</Form.Label>
              <Form.Control
                type="text"
                name="departamento"
                value={form.departamento}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ciudad</Form.Label>
              <Form.Control
                type="text"
                name="ciudad"
                value={form.ciudad}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="success" type="submit">
              {editId ? 'Guardar Cambios' : 'Crear'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}