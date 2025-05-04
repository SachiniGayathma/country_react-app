import logo from './logo.svg';
import './App.css';
import AllCountries from './components/AllCountries';
import ViewMore from './components/ViewMore';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
//import RegisterUser from './components/RegisterUser.jsx';
//<Route path="/" element={<RegisterUser />} />

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        
        <Route path="/countries" element={<AllCountries />} />
        <Route path="/view/:country" element={<ViewMore />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
