import React, { useState, useEffect } from 'react';
import { X, Plus, AlertCircle, CheckCircle, Clock, Send, Users, UserPlus, LogOut } from 'lucide-react';

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
      {authState.user.userType === 'admin' && <AdminPanel />}
      {authState.user.userType === 'supplier' && <SupplierPanel />}
      {authState.user.userType === 'store' && <StorePanel />}
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
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '0',
        width: '100%',
        maxWidth: '460px',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          textAlign: 'center'
        }}>
          <img 
            src="https://i.imgur.com/expressglass-logo.png" 
            alt="ExpressGlass"
            style={{
              height: '60px',
              marginBottom: '30px'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div style={{
            display: 'none',
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '30px'
          }}>
            <span style={{color: '#E31837'}}>EXPRESS</span>
            <span style={{color: '#1B2B4D'}}>GLASS</span>
          </div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1B2B4D',
            marginBottom: '8px'
          }}>Bem-vindo</h2>
          <p style={{
            color: '#6B7280',
            fontSize: '14px'
          }}>Faça login na sua conta</p>
        </div>

        <div style={{padding: '0 40px 40px'}}>
          {error && (
            <div style={{
              background: '#FEE2E2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                required
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '14px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                marginTop: '10px'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Entrar
            </button>
          </form>

          <div style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#6B7280'
          }}>
            Não tem conta?{' '}
            <button
              onClick={() => setShowRegister(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              Criar conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const { logout, user, token } = React.useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [showCreateSupplier, setShowCreateSupplier] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight: '100vh', background: '#F9FAFB'}}>
      <header style={{
        background: 'white',
        borderBottom: '1px solid #E5E7EB',
        padding: '16px 24px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1B2B4D',
              margin: 0
            }}>
              <span style={{color: '#E31837'}}>EXPRESS</span>
              <span style={{color: '#1B2B4D'}}>GLASS</span>
            </h1>
            <p style={{fontSize: '14px', color: '#6B7280', margin: '4px 0 0'}}>
              Painel Administrativo
            </p>
          </div>
          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: '#E31837',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </header>

      <div style={{maxWidth: '1400px', margin: '0 auto', padding: '24px'}}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            borderBottom: '1px solid #E5E7EB',
            padding: '0 24px',
            display: 'flex',
            gap: '32px'
          }}>
            <button
              onClick={() => setActiveTab('users')}
              style={{
                padding: '16px 0',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'users' ? '2px solid #667eea' : '2px solid transparent',
                color: activeTab === 'users' ? '#667eea' : '#6B7280',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Users size={18} />
              Utilizadores
            </button>
            <button
              onClick={() => setActiveTab('suppliers')}
              style={{
                padding: '16px 0',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'suppliers' ? '2px solid #667eea' : '2px solid transparent',
                color: activeTab === 'suppliers' ? '#667eea' : '#6B7280',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <UserPlus size={18} />
              Criar Fornecedor
            </button>
          </div>

          <div style={{padding: '24px'}}>
            {activeTab === 'users' && (
              <div>
                <h2 style={{fontSize: '20px', fontWeight: '600', color: '#1F2937', marginBottom: '20px'}}>
                  Lista de Utilizadores
                </h2>
                {loading ? (
                  <p style={{color: '#6B7280'}}>A carregar...</p>
                ) : (
                  <div style={{overflowX: 'auto'}}>
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                      <thead>
                        <tr style={{borderBottom: '2px solid #E5E7EB'}}>
                          <th style={{padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase'}}>Email</th>
                          <th style={{padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase'}}>Tipo</th>
                          <th style={{padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase'}}>Nome</th>
                          <th style={{padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase'}}>Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id} style={{borderBottom: '1px solid #F3F4F6'}}>
                            <td style={{padding: '16px 12px', fontSize: '14px', color: '#1F2937'}}>{u.email}</td>
                            <td style={{padding: '16px 12px'}}>
                              <span style={{
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '500',
                                background: u.user_type === 'admin' ? '#FEE2E2' : u.user_type === 'supplier' ? '#DBEAFE' : '#D1FAE5',
                                color: u.user_type === 'admin' ? '#991B1B' : u.user_type === 'supplier' ? '#1E40AF' : '#065F46'
                              }}>
                                {u.user_type}
                              </span>
                            </td>
                            <td style={{padding: '16px 12px', fontSize: '14px', color: '#6B7280'}}>
                              {u.store_name || u.supplier_name || '-'}
                            </td>
                            <td style={{padding: '16px 12px', fontSize: '14px', color: '#6B7280'}}>
                              {new Date(u.created_at).toLocaleDateString('pt-PT')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'suppliers' && <CreateSupplierForm onSuccess={loadUsers} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateSupplierForm = ({ onSuccess }) => {
  const { token } = React.useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    supplierName: '',
    contactPerson: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const res = await fetch(`${API_URL}/admin/suppliers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setFormData({
          email: '',
          password: '',
          supplierName: '',
          contactPerson: '',
          phone: ''
        });
        onSuccess();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro ao criar fornecedor');
    }
  };

  return (
    <div style={{maxWidth: '600px'}}>
      <h2 style={{fontSize: '20px', fontWeight: '600', color: '#1F2937', marginBottom: '20px'}}>
        Criar Novo Fornecedor
      </h2>

      {success && (
        <div style={{
          background: '#D1FAE5',
          border: '1px solid #6EE7B7',
          color: '#065F46',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          Fornecedor criado com sucesso!
        </div>
      )}

      {error && (
        <div style={{
          background: '#FEE2E2',
          border: '1px solid #FCA5A5',
          color: '#991B1B',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
        <div>
          <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
            Nome do Fornecedor
          </label>
          <input
            type="text"
            value={formData.supplierName}
            onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px'
            }}
            required
          />
        </div>

        <div>
          <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
            Pessoa de Contacto
          </label>
          <input
            type="text"
            value={formData.contactPerson}
            onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px'
            }}
            required
          />
        </div>

        <div>
          <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
            Telefone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px'
            }}
            required
          />
        </div>

        <div>
          <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px'
            }}
            required
          />
        </div>

        <div>
          <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
            Password
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px'
            }}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '14px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Criar Fornecedor
        </button>
      </form>
    </div>
  );
};

const SupplierPanel = () => {
  const { logout } = React.useContext(AuthContext);
  return (
    <div style={{padding: '20px', fontFamily: 'Arial'}}>
      <h1>Monitor de Pedidos - Fornecedor</h1>
      <button onClick={logout} style={{padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Sair</button>
      <p style={{marginTop: '20px'}}>Vista Fornecedor em desenvolvimento.</p>
    </div>
  );
};

const StorePanel = () => {
  const { logout } = React.useContext(AuthContext);
  return (
    <div style={{padding: '20px', fontFamily: 'Arial'}}>
      <h1>Minha Loja</h1>
      <button onClick={logout} style={{padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Sair</button>
      <p style={{marginTop: '20px'}}>Vista Loja em desenvolvimento.</p>
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
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          padding: '40px',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <CheckCircle style={{width: '64px', height: '64px', color: '#10b981', margin: '0 auto 20px'}} />
          <h3 style={{fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '10px'}}>Registo Concluído!</h3>
          <p style={{color: '#666'}}>A redirecionar para o login...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '40px',
        width: '100%',
        maxWidth: '500px'
      }}>
        <h2 style={{fontSize: '28px', fontWeight: 'bold', color: '#1B2B4D', marginBottom: '30px', textAlign: 'center'}}>Registar Loja</h2>
        
        {error && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Nome da Loja</label>
            <input
              type="text"
              value={formData.storeName}
              onChange={(e) => setFormData({...formData, storeName: e.target.value})}
              style={{width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}}
              required
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Pessoa de Contacto</label>
            <input
              type="text"
              value={formData.contactPerson}
              onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
              style={{width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}}
              required
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Telefone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              style={{width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}}
              required
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Morada</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              style={{width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}}
              rows="2"
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}}
              required
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Registar
          </button>

          <button
            type="button"
            onClick={onBack}
            style={{
              width: '100%',
              background: 'white',
              color: '#6B7280',
              padding: '14px',
              borderRadius: '8px',
              border: '2px solid #E5E7EB',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Voltar ao Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
