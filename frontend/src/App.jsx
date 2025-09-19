import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import BusDetail from './pages/BusDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bus/:id" element={<BusDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
