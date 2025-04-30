import './App.css'
import Navbar from './components/Navbar/Navbar.tsx';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home.tsx';
import Book from './pages/Book/Book.tsx';
import Host from './pages/Host/Host.tsx';
import HostDashboard from './pages/HostDashboard/HostDashboard.tsx';
import List from './pages/List/List.tsx';
import Listings from './pages/Listings/Listings.tsx';
import Login from './pages/Login/Login.tsx';
import Notifications from './pages/Notifications/Notifications.tsx';
import Property from './pages/Property/Property.tsx';
import Register from './pages/Register/Register.tsx';
import ResetPassword from './pages/ResetPassword/ResetPassword.tsx';
import Settings from './pages/Settings/Settings.tsx';
import Support from './pages/Support/Support.tsx';
import Trips from './pages/Trips/Trips.tsx';
import NotFound from './pages/NotFound/NotFound.tsx';
import Saved from './pages/Saved/Saved.tsx';

function App() {
  return (
    <>
      {/* navbar */}
      <Navbar />

      <div className='custom-container'>
        {/* Navigation, in order flow / hierarchical*/}
        <Routes>
          {/* 404, not found */}
          <Route path="*" element={<NotFound />} />
          {/* core */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/settings" element={<Settings />} />
          {/* airbnb camping specific */}
          {/* user & owner */}
          <Route path="/listings" element={<Listings />} />
          <Route path="/property" element={<Property />} />
          <Route path="/book" element={<Book />} />
          <Route path="/trips" element={<Trips />} />
          {/* owner only */}
          <Route path="/host" element={<Host />} />
          <Route path="/host-dashboard" element={<HostDashboard />} />
          <Route path="/list" element={<List />} />
          {/* additional */}
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/support" element={<Support />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/saved" element={<Saved />} />
        </Routes>
      </div>
    </>
  )
}

export default App