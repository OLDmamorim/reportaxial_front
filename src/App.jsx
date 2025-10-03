import React, { useState, useEffect } from 'react';
import { X, Plus, AlertCircle, CheckCircle, Clock, Send } from 'lucide-react';

const API_URL = 'https://reportaxialback-production.up.railway.app/api';

const AuthContext = React.createContext();

function App() {
  const [authState, setAuthState] = useState({
    user: null,
    token: localStorage.getItem('token')
  });

  useEffect(() => {
    if (authState.token) {
      const userData = JSON.parse(localStorage.getItem('user'));
      setAuthState({ user: userData, token: authState.token });
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setAuthState({ token, user: userData });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({ user: null, token: null });
  };

  if (!authState.user) {
    return (
      <AuthContext.Provider value={{ user: authState.user, token: authState.token, login, logout }}>
        <Login />
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ user: authState.user, token: authState.token, login, logout }}>
      {authState.user.userType === 'admin' && <div style={{padding: '20px', fontFamily: 'Arial'}}>
        <h1>Painel Admin</h1>
        <button onClick={logout} style={{padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Sair</button>
        <p style={{marginTop: '20px'}}>Vista Admin em desenvolvimento. As funcionalidades completas estão no código original com Tailwind.</p>
      </div>}
      {authState.user.userType === 'supplier' && <div style={{padding: '20px', fontFamily: 'Arial'}}>
        <h1>Monitor de Pedidos</h1>
        <button onClick={logout} style={{padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Sair</button>
        <p style={{marginTop: '20px'}}>Vista Fornecedor em desenvolvimento.</p>
      </div>}
      {authState.user.userType === 'store' && <div style={{padding: '20px', fontFamily: 'Arial'}}>
        <h1>Minha Loja</h1>
        <button onClick={logout} style={{padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Sair</button>
        <p style={{marginTop: '20px'}}>Vista Loja em desenvolvimento.</p>
      </div>}
    </AuthContext.Provider>
  );
}

const Login = () => {
  const { login } = React.useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
    }
  };

  if (showRegister) {
    return <RegisterStore onBack={() => setShowRegister(false)} />;
  }

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
      <div style={{background: 'white', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', padding: '40px', width: '100%', maxWidth: '400px'}}>
        <h2 style={{fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '30px', textAlign: 'center'}}>Portal de Gestão</h2>
        
        {error && (
          <div style={{background: '#fee', border: '1px solid #fcc', color: '#c33', padding: '12px', borderRadius: '6px', marginBottom: '20px'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '8px'}}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px'}}
              required
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '8px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px'}}
              required
            />
          </div>

          <button
            type="submit"
            style={{width: '100%', background: '#667eea', color: 'white', padding: '14px', borderRadius: '6px', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer'}}
          >
            Entrar
          </button>
        </form>

        <div style={{marginTop: '24px', textAlign: 'center'}}>
          <button
            onClick={() => setShowRegister(true)}
            style={{background: 'none', border: 'none', color: '#667eea', fontSize: '14px', fontWeight: '500', cursor: 'pointer', textDecoration: 'underline'}}
          >
            Registar nova loja
          </button>
        </div>
      </div>
    </div>
  );
};

const RegisterStore = ({ onBack }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    storeName: '',
    contactPerson: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/register/store`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => onBack(), 2000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
    }
  };

  if (success) {
    return (
      <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
        <div style={{background: 'white', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center'}}>
          <CheckCircle style={{width: '64px', height: '64px', color: '#10b981', margin: '0 auto 20px'}} />
          <h3 style={{fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '10px'}}>Registo Concluído!</h3>
          <p style={{color: '#666'}}>A redirecionar para o login...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
      <div style={{background: 'white', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', padding: '40px', width: '100%', maxWidth: '400px'}}>
        <h2 style={{fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '30px', textAlign: 'center'}}>Registar Loja</h2>
        
        {error && (
          <div style={{background: '#fee', border: '1px solid #fcc', color: '#c33', padding: '12px', borderRadius: '6px', marginBottom: '20px'}}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '8px'}}>Nome da Loja</label>
            <input
              type="text"
              value={formData.storeName}
              onChange={(e) => setFormData({...formData, storeName: e.target.value})}
              style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px'}}
              required
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '8px'}}>Pessoa de Contacto</label>
            <input
              type="text"
              value={formData.contactPerson}
              onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
              style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px'}}
              required
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '8px'}}>Telefone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px'}}
              required
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '8px'}}>Morada</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px'}}
              rows="2"
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '8px'}}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px'}}
              required
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '8px'}}>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px'}}
              required
            />
          </div>

          <button
            type="submit"
            style={{width: '100%', background: '#667eea', color: 'white', padding: '14px', borderRadius: '6px', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer'}}
          >
            Registar
          </button>

          <button
            type="button"
            onClick={onBack}
            style={{width: '100%', background: 'white', color: '#666', padding: '14px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px', fontWeight: '600', cursor: 'pointer'}}
          >
            Voltar ao Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
