import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SnackbarProvider from 'react-simple-snackbar'
import Dashboard from './Components/Dashboard/Dashboard';
import Header from './Components/Header/Header';
// Components
import Home from './Components/Home/Home';
import Invoice from './Components/Invoice/Invoice';
import InvoiceDetails from './Components/InvoiceDetails/InvoiceDetails';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';

function App() {

  return (
    <div>
      <Router>
        <SnackbarProvider>
          <Header />
          {/* <h1 style={{ backgroundColor: 'lightgrey' }}>Nav Bar</h1> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Invoice" element={<Invoice />} />
            <Route path="/edit/invoice/:id" element={<Invoice />} />
            <Route path="/invoice/:id" element={<InvoiceDetails />} />
          </Routes>
        </SnackbarProvider>
      </Router>
    </div>
  );
}

export default App;
