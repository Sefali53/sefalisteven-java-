import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import QuantityChart from './QuantityChart';
import './App.css';

const App = () => {
  const [products, setProducts] = useState(JSON.parse(localStorage.getItem('products')) || []);
  const [users, setUsers] = useState(JSON.parse(localStorage.getItem('users')) || []);
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('currentUser') || null);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('users', JSON.stringify(users));
  }, [products, users]);

  const handleLogin = (username) => {
    setCurrentUser(username);
    localStorage.setItem('currentUser', username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const Login = ({ onLogin, users }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      const user = users.find(user => user.username === username && user.password === password);
      if (user) {
        onLogin(username);
      } else {
        alert('Invalid username or password');
      }
    };

    return (
      <div style={styles.formContainer}>
        <h2 style={styles.formTitle}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            style={styles.input}
          />
          <div style={styles.passwordContainer}>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={styles.input}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              style={styles.showPasswordButton}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button type="submit" style={styles.button}>Login</button>
        </form>
        <p style={styles.linkText}>
          Don't have an account? <Link to="/signup" style={styles.link}>Sign Up</Link>
        </p>
      </div>
    );
  };

  const SignUp = ({ users, setUsers }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      const newUser = { username, password };
      setUsers([...users, newUser]);
      alert('Sign up successful! You can now log in.');
    };

    return (
      <div style={styles.formContainer}>
        <h2 style={styles.formTitle}>Sign Up</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            style={styles.input}
          />
          <div style={styles.passwordContainer}>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={styles.input}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              style={styles.showPasswordButton}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button type="submit" style={styles.button}>Sign Up</button>
        </form>
        <p style={styles.linkText}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
    );
  };

  return (
    <Router>
      <header style={styles.header}>
        <h1 style={styles.title}>Wings Cafe Inventory System</h1>
        <nav style={styles.nav}>
          <Link to="/" style={styles.navButton}>Dashboard</Link>
          <Link to="/product-management" style={styles.navButton}>Product Management</Link>
          <Link to="/user-management" style={styles.navButton}>User Management</Link>
          {currentUser ? (
            <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
          ) : null}
        </nav>
      </header>
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login onLogin={handleLogin} users={users} />} />
        <Route path="/signup" element={currentUser ? <Navigate to="/" /> : <SignUp users={users} setUsers={setUsers} />} />
        <Route path="/product-management" element={currentUser ? <ProductManagement products={products} setProducts={setProducts} /> : <Navigate to="/login" />} />
        <Route path="/user-management" element={currentUser ? <UserManagement users={users} setUsers={setUsers} /> : <Navigate to="/login" />} />
        <Route path="/" element={currentUser ? (
          <div>
            <Dashboard products={products} setProducts={setProducts} />
            <QuantityChart products={products} />
          </div>
        ) : <Navigate to="/login" />} />
      </Routes>
      
    </Router>
  );
};

const styles = {
  header: {
    backgroundColor: '#3498db',
    padding: '20px',
    textAlign: 'center',
    color: 'white',
    animation: 'headerAnimation 5s ease-in-out infinite',
  },
  title: {
    margin: 0,
    fontSize: '2.5rem',
    fontWeight: 'bold',
  },
  nav: {
    marginTop: '15px',
  },
  navButton: {
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    fontSize: '1.2rem',
    margin: '0 15px',
    cursor: 'pointer',
    textDecoration: 'underline',
    transition: 'color 0.3s, background-color 0.3s',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  formContainer: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#3498db',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #3498db',
    borderRadius: '5px',
  },
  passwordContainer: {
    display: 'flex',
    position: 'relative',
  },
  showPasswordButton: {
    position: 'absolute',
    right: '10px',
    top: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#3498db',
    cursor: 'pointer',
  },
  button: {
    padding: '10px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    transition: 'background-color 0.3s',
  },
  linkText: {
    textAlign: 'center',
    marginTop: '10px',
  },
  link: {
    color: '#3498db',
    textDecoration: 'underline',
    transition: 'color 0.3s',
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#3498db',
    color: 'white',
    position: 'relative',
    bottom: 0,
    width: '100%',
  },
};

// Animation Keyframes
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes headerAnimation {
    0% { transform: translateX(0); }
    50% { transform: translateX(20px); }
    100% { transform: translateX(0); }
}`, styleSheet.cssRules.length);

export default App;