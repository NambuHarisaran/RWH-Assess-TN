import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Assess from './pages/Assess.jsx'
import History from './pages/History.jsx'
import Admin from './pages/Admin.jsx'
import Login from './pages/Login.jsx'

export default function App() {
  return (
    <div className="app">
      <Nav />
      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assess" element={<Assess />} />
            <Route path="/history" element={<History />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </main>
      <footer className="foot">
        RWH Assess TN · Rainwater Harvesting Assessment for Tamil Nadu · Phase 1 MVP
      </footer>
    </div>
  )
}

function Nav() {
  useLocation() // re-render on route change for active state
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          <span className="logo">💧</span>
          <span>RWH Assess <span className="full">TN</span></span>
        </Link>
        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/assess">Assess</NavLink>
          <NavLink to="/history">History</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </div>
      </div>
    </nav>
  )
}
