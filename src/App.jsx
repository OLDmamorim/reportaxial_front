// App.jsx - CÓDIGO COMPLETO (Portal Reportaxial)
// Copie este ficheiro COMPLETO para substituir o src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const API_URL = 'https://seu-backend.railway.app/api'; // ⚠️ ALTERAR para URL do Railway

// ============ COMPONENTES DE AUTENTICAÇÃO ============

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userType', data.user.user_type);
        localStorage.setItem('userId', data.user.id);
        onLogin(data.user.user_type);
      } else {
        alert(data.message || 'Erro no login');
      }
    } catch (error) {
      alert('Erro ao conectar ao servidor');
    }
  };

  if (showRegister) {
    return <RegisterForm onBack={() => setShowRegister(false)} />;
  }

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
      <div style={{background: 'white', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', padding: '48px', maxWidth: '440px', width: '100%'}}>
        <div style={{textAlign: 'center', marginBottom: '32px'}}>
          <h1 style={{fontSize: '32px', fontWeight: 'bold', color: '#1F2937', marginBottom: '8px'}}>EXPRESSGLASS</h1>
          <p style={{color: '#6B7280', fontSize: '14px'}}>Braga</p>
        </div>

        <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Email</label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              style={{width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}}
              required
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              style={{width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}}
              required
            />
          </div>

          <button type="submit" style={{width: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer'}}>
            Entrar
          </button>

          <p style={{textAlign: 'center', color: '#6B7280', fontSize: '14px'}}>
            Não tem conta?{' '}
            <button type="button" onClick={() => setShowRegister(true)} style={{color: '#667eea', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'}}>
              Criar conta
            </button>
          </p>
        </form>

        <p style={{textAlign: 'center', color: '#9CA3AF', fontSize: '12px', marginTop: '24px'}}>
          Powered by Neon PostgreSQL
        </p>
      </div>
    </div>
  );
};

const RegisterForm = ({ onBack }) => {
  const [formData, setFormData] = useState({ email: '', password: '', storeName: '', contactPerson: '', phone: '', address: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        alert('Registo efetuado com sucesso!');
        onBack();
      } else {
        alert(data.message || 'Erro no registo');
      }
    } catch (error) {
      alert('Erro ao conectar ao servidor');
    }
  };

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
      <div style={{background: 'white', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', padding: '48px', maxWidth: '440px', width: '100%'}}>
        <h2 style={{fontSize: '24px', fontWeight: 'bold', color: '#1F2937', marginBottom: '24px', textAlign: 'center'}}>Registo de Loja</h2>
        <form onSubmit={handleRegister} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <input type="text" placeholder="Nome da Loja" value={formData.storeName} onChange={(e) => setFormData({...formData, storeName: e.target.value})} style={{padding: '12px', border: '2px solid #E5E7EB', borderRadius: '8px'}} required />
          <input type="text" placeholder="Pessoa de Contacto" value={formData.contactPerson} onChange={(e) => setFormData({...formData, contactPerson: e.target.value})} style={{padding: '12px', border: '2px solid #E5E7EB', borderRadius: '8px'}} />
          <input type="tel" placeholder="Telefone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{padding: '12px', border: '2px solid #E5E7EB', borderRadius: '8px'}} />
          <textarea placeholder="Morada" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} style={{padding: '12px', border: '2px solid #E5E7EB', borderRadius: '8px'}} rows="2" />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{padding: '12px', border: '2px solid #E5E7EB', borderRadius: '8px'}} required />
          <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={{padding: '12px', border: '2px solid #E5E7EB', borderRadius: '8px'}} required />
          <button type="submit" style={{padding: '14px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer'}}>Registar</button>
          <button type="button" onClick={onBack} style={{padding: '14px', background: 'white', color: '#6B7280', borderRadius: '8px', border: '2px solid #E5E7EB', fontWeight: '600', cursor: 'pointer'}}>Voltar</button>
        </form>
      </div>
    </div>
  );
};

// ============ VISTA ADMIN ============

const AdminDashboard = ({ onLogout }) => {
  return (
    <div style={{padding: '20px'}}>
      <h1>Painel Admin</h1>
      <button onClick={onLogout}>Sair</button>
      <p>Vista Admin em desenvolvimento...</p>
    </div>
  );
};

// ============ VISTA FORNECEDOR ============

const SupplierDashboard = ({ onLogout }) => {
  return (
    <div style={{padding: '20px'}}>
      <h1>Painel Fornecedor</h1>
      <button onClick={onLogout}>Sair</button>
      <p>Vista Fornecedor em desenvolvimento...</p>
    </div>
  );
};

// ============ VISTA LOJA ============

const StoreDashboard = ({ onLogout }) => {
  return (
    <div style={{padding: '20px'}}>
      <h1>Painel Loja</h1>
      <button onClick={onLogout}>Sair</button>
      <p>Vista Loja em desenvolvimento...</p>
    </div>
  );
};

// ============ APP PRINCIPAL ============

function App() {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const savedUserType = localStorage.getItem('userType');
    if (savedUserType) setUserType(savedUserType);
  }, []);

  const handleLogin = (type) => {
    setUserType(type);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserType(null);
  };

  if (!userType) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          userType === 'admin' ? <AdminDashboard onLogout={handleLogout} /> :
          userType === 'supplier' ? <SupplierDashboard onLogout={handleLogout} /> :
          <StoreDashboard onLogout={handleLogout} />
        } />
      </Routes>
    </Router>
  );
}

export default App;