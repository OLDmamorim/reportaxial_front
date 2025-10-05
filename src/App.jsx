// App.jsx - CÓDIGO ATUALIZADO (Portal Reportaxial)
// Nova interface de login conforme design fornecido

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const API_URL = 'https://reportaxialback-production.up.railway.app/api';

// ============ COMPONENTE LOGO ============

const ExpressGlassLogo = () => (
  <div style={{
    background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
    padding: '32px',
    borderRadius: '16px',
    marginBottom: '32px',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <img 
      src="/expressglass-logo.png" 
      alt="EXPRESSGLASS - Vidros para Viaturas" 
      style={{
        maxWidth: '100%',
        height: 'auto',
        maxHeight: '80px'
      }}
    />
  </div>
);

// ============ COMPONENTE DE AUTENTICAÇÃO ============

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.username, // Backend espera 'email'
          password: credentials.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userType', data.user.user_type);
        localStorage.setItem('userId', data.user.id);
        onLogin(data.user.user_type);
      } else {
        setError(data.message || 'Credenciais inválidas');
      }
    } catch (error) {
      setError('Erro ao conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '48px',
        maxWidth: '480px',
        width: '100%'
      }}>
        <ExpressGlassLogo />

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>
            Bem-vindo
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6B7280',
            margin: 0
          }}>
            Faça login na sua conta
          </p>
        </div>

        <form onSubmit={handleLogin} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '15px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              placeholder="Insira o seu username"
              style={{
                width: '100%',
                padding: '16px',
                background: '#FFFFFF',
                border: '2px solid #E5E7EB',
                borderRadius: '12px',
                fontSize: '15px',
                color: '#1F2937',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366F1';
                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB';
                e.target.style.boxShadow = 'none';
              }}
              required
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '15px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '16px',
                background: '#FFFFFF',
                border: '2px solid #E5E7EB',
                borderRadius: '12px',
                fontSize: '15px',
                color: '#1F2937',
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366F1';
                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB';
                e.target.style.boxShadow = 'none';
              }}
              required
            />
          </div>

          {error && (
            <div style={{
              padding: '12px',
              background: '#FEE2E2',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              color: '#DC2626',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#9CA3AF' : '#6366F1',
              color: '#FFFFFF',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              marginTop: '8px'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = '#4F46E5';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.background = '#6366F1';
            }}
          >
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ============ VISTA ADMIN ============

const AdminDashboard = ({ onLogout }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F3F4F6',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            <span style={{ color: '#DC2626' }}>EXPRESS</span>
            <span style={{ color: '#1E3A8A' }}>GLASS</span>
          </div>
          <span style={{ color: '#6B7280', fontSize: '14px' }}>| Painel Admin</span>
        </div>
        <button 
          onClick={onLogout}
          style={{
            padding: '8px 16px',
            background: '#EF4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Sair
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', marginBottom: '16px' }}>
          Dashboard Administrativo
        </h1>
        <div style={{
          background: '#FFFFFF',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <p style={{ color: '#6B7280', fontSize: '16px' }}>
            Vista Admin em desenvolvimento...
          </p>
        </div>
      </div>
    </div>
  );
};

// ============ VISTA FORNECEDOR ============

const SupplierDashboard = ({ onLogout }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F3F4F6',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            <span style={{ color: '#DC2626' }}>EXPRESS</span>
            <span style={{ color: '#1E3A8A' }}>GLASS</span>
          </div>
          <span style={{ color: '#6B7280', fontSize: '14px' }}>| Painel Fornecedor</span>
        </div>
        <button 
          onClick={onLogout}
          style={{
            padding: '8px 16px',
            background: '#EF4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Sair
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', marginBottom: '16px' }}>
          Dashboard Fornecedor
        </h1>
        <div style={{
          background: '#FFFFFF',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <p style={{ color: '#6B7280', fontSize: '16px' }}>
            Vista Fornecedor em desenvolvimento...
          </p>
        </div>
      </div>
    </div>
  );
};

// ============ VISTA LOJA ============

const StoreDashboard = ({ onLogout }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F3F4F6',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            <span style={{ color: '#DC2626' }}>EXPRESS</span>
            <span style={{ color: '#1E3A8A' }}>GLASS</span>
          </div>
          <span style={{ color: '#6B7280', fontSize: '14px' }}>| Painel Loja</span>
        </div>
        <button 
          onClick={onLogout}
          style={{
            padding: '8px 16px',
            background: '#EF4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Sair
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', marginBottom: '16px' }}>
          Dashboard Loja
        </h1>
        <div style={{
          background: '#FFFFFF',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <p style={{ color: '#6B7280', fontSize: '16px' }}>
            Vista Loja em desenvolvimento...
          </p>
        </div>
      </div>
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
