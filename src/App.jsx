import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';

// Importación de los nuevos componentes
import Clientes from './components/Clientes';
import Productos from './components/Productos';
import Ventas from './components/Ventas';
import DetalleVenta from './components/DetalleVenta';

import './App.css';

function App() {
  useEffect(() => {
    console.log('¡Bienvenido al Sistema de Ventas!');
  }, []);

  return (
    <BrowserRouter>
      <Menu />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<h2>¡Bienvenido al sistema!</h2>} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/detalle-venta" element={<DetalleVenta />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;