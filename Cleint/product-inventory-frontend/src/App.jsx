import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import ManageStock from './pages/ManageStock';
import Report from './pages/Report';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/add-product" element={<AddProduct />} />
        <Route path="/manage-stock" element={<ManageStock />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
