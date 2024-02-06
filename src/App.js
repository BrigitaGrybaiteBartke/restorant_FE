// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/Header';
import NotFound from './components/NotFound';
import Restaurants from './components/Restaurants';
import Restaurant from './components/Restaurant';
import Dishes from './components/Dishes';
import Dish from './components/Dish';
import Register from './components/Register';
import Login from './components/Login';
import { AuthProvider } from './components/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <div className="container py-3">
          <Routes>
            <Route path='/' element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/rest" element={<Restaurants />} />
            <Route path="/rest/:id" element={<Restaurant />} />  {/* update/create (pagal tai, koks mygtukas paspaustas */}
            <Route path="/rest/create" element={<Restaurant />} />
            <Route path="/dishes" element={<Dishes />} />
            <Route path="/dishes/:id" element={<Dish />} />
            <Route path="/dishes/create" element={<Dish />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='/notfound' element={<NotFound />} />
            <Route
              path='*'
              element={<Navigate to="notfound" />}
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
