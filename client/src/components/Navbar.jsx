//لاستخدام مكونات React Router و Context API
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
// تعريف مكون Navbar لعرض شريط التنقل
export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <nav style={{ padding: '15px 30px', background: '#222', color: 'white', display: 'flex', gap: '20px', alignItems: 'center' }}>
      <h2 style={{ margin: 0 }}>Alzikrayat </h2>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
      <Link to="/gallery" style={{ color: 'white', textDecoration: 'none' }}>Gallery</Link>
      
      <div style={{ marginLeft: 'auto' }}>
        {user ? (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span>Hi, {user.firstName}</span>
            <Link to="/add-photo" style={{ color: '#facc15', textDecoration: 'none', fontWeight: 'bold' }}>Add Photo</Link>
            <button onClick={handleLogout} style={{ padding: '5px 10px', cursor: 'pointer', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>Logout</button>
          </div>
        ) : (
          <Link to="/login" style={{ color: '#facc15', textDecoration: 'none', fontWeight: 'bold' }}>Please Login</Link>
        )}
      </div>
    </nav>
  );
}