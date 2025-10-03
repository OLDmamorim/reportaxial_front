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
      background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '32px',
            letterSpacing: '-0.5px'
          }}>
            <span style={{color: '#E31837'}}>EXPRESS</span>
            <span style={{color: '#1B2B4D'}}>GLASS</span>
          </div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#1F2937',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>Bem-vindo</h2>
          <p style={{
            color: '#6B7280',
            fontSize: '15px',
            margin: 0
          }}>Faça login na sua conta</p>
        </div>

        {error && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            padding: '12px',
            borderRadius: '12px',
            marginBottom: '24px',
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
              color: '#1F2937',
              marginBottom: '8px'
            }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@portal.com"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#F3F4F6',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                outline: 'none',
                color: '#1F2937'
              }}
              required
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#1F2937',
              marginBottom: '8px'
            }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#F3F4F6',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                outline: 'none',
                color: '#1F2937'
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              background: '#7c3aed',
              color: 'white',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '8px'
            }}
          >
            Entrar
          </button>
        </form>

        <div style={{
          marginTop: '28px',
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
              color: '#7c3aed',
              fontWeight: '500',
              cursor: 'pointer',
              textDecoration: 'none',
              padding: 0
            }}
          >
            Criar conta
          </button>
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
          width: '100%',
          padding: '0 24px',
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

      <div style={{padding: '24px'}}>
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
  const { logout, token } = React.useContext(AuthContext);
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/supplier/problems`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProblems(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const loadProblemDetails = async (problemId) => {
    try {
      const res = await fetch(`${API_URL}/supplier/problems/${problemId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedProblem(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!responseText.trim() || !selectedProblem) return;

    try {
      const res = await fetch(`${API_URL}/supplier/problems/${selectedProblem.id}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ responseText })
      });

      if (res.ok) {
        setResponseText('');
        loadProblemDetails(selectedProblem.id);
        loadProblems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FEF3C7';
      case 'in_progress': return '#DBEAFE';
      case 'resolved': return '#D1FAE5';
      case 'closed': return '#F3F4F6';
      default: return '#F3F4F6';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'pending': return '#92400E';
      case 'in_progress': return '#1E40AF';
      case 'resolved': return '#065F46';
      case 'closed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Progresso';
      case 'resolved': return 'Resolvido';
      case 'closed': return 'Fechado';
      default: return status;
    }
  };

  const pendingProblems = problems.filter(p => p.status === 'pending');
  const inProgressProblems = problems.filter(p => p.status === 'in_progress');
  const resolvedProblems = problems.filter(p => p.status === 'resolved' || p.status === 'closed');

  return (
    <div style={{minHeight: '100vh', background: '#F9FAFB', display: 'flex', flexDirection: 'column'}}>
      <header style={{
        background: 'white',
        borderBottom: '1px solid #E5E7EB',
        padding: '16px 24px'
      }}>
        <div style={{
          maxWidth: '1600px',
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
              Monitor de Pedidos
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

      <div style={{
        flex: 1,
        display: 'flex',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        overflow: 'hidden'
      }}>
        <div style={{
          flex: selectedProblem ? '1' : '1',
          padding: '24px',
          overflowY: 'auto',
          transition: 'flex 0.3s'
        }}>
          {loading ? (
            <p style={{color: '#6B7280', textAlign: 'center', marginTop: '40px'}}>A carregar pedidos...</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: selectedProblem ? 'repeat(auto-fill, minmax(280px, 1fr))' : 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6B7280',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Pendentes ({pendingProblems.length})
                </h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  {pendingProblems.map(problem => (
                    <ProblemCard 
                      key={problem.id} 
                      problem={problem} 
                      onClick={() => loadProblemDetails(problem.id)}
                      selected={selectedProblem?.id === problem.id}
                      getStatusColor={getStatusColor}
                      getStatusTextColor={getStatusTextColor}
                      getStatusText={getStatusText}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6B7280',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Em Progresso ({inProgressProblems.length})
                </h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  {inProgressProblems.map(problem => (
                    <ProblemCard 
                      key={problem.id} 
                      problem={problem} 
                      onClick={() => loadProblemDetails(problem.id)}
                      selected={selectedProblem?.id === problem.id}
                      getStatusColor={getStatusColor}
                      getStatusTextColor={getStatusTextColor}
                      getStatusText={getStatusText}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6B7280',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Resolvidos ({resolvedProblems.length})
                </h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  {resolvedProblems.map(problem => (
                    <ProblemCard 
                      key={problem.id} 
                      problem={problem} 
                      onClick={() => loadProblemDetails(problem.id)}
                      selected={selectedProblem?.id === problem.id}
                      getStatusColor={getStatusColor}
                      getStatusTextColor={getStatusTextColor}
                      getStatusText={getStatusText}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {selectedProblem && (
          <div style={{
            flex: '0 0 500px',
            background: 'white',
            borderLeft: '1px solid #E5E7EB',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 'calc(100vh - 73px)'
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{fontSize: '18px', fontWeight: '600', color: '#1F2937', margin: 0}}>
                Detalhes do Pedido
              </h2>
              <button
                onClick={() => setSelectedProblem(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#6B7280'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px'
            }}>
              <div style={{marginBottom: '24px'}}>
                <h3 style={{fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '8px'}}>
                  {selectedProblem.store_name}
                </h3>
                <p style={{fontSize: '14px', color: '#6B7280', marginBottom: '4px'}}>
                  Contacto: {selectedProblem.contact_person}
                </p>
                <p style={{fontSize: '14px', color: '#6B7280'}}>
                  Tel: {selectedProblem.phone}
                </p>
              </div>

              <div style={{
                background: '#F9FAFB',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <h4 style={{fontSize: '14px', fontWeight: '600', color: '#1F2937', marginBottom: '8px'}}>
                  {selectedProblem.title}
                </h4>
                <p style={{fontSize: '14px', color: '#6B7280', lineHeight: '1.5'}}>
                  {selectedProblem.description}
                </p>
                <div style={{marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center'}}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: getStatusColor(selectedProblem.status),
                    color: getStatusTextColor(selectedProblem.status)
                  }}>
                    {getStatusText(selectedProblem.status)}
                  </span>
                  <span style={{fontSize: '12px', color: '#9CA3AF'}}>
                    {new Date(selectedProblem.created_at).toLocaleString('pt-PT')}
                  </span>
                </div>
              </div>

              <h4 style={{fontSize: '14px', fontWeight: '600', color: '#1F2937', marginBottom: '12px'}}>
                Histórico de Respostas
              </h4>

              {selectedProblem.responses && selectedProblem.responses.length > 0 ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px'}}>
                  {selectedProblem.responses.map((response) => (
                    <div key={response.id} style={{
                      background: '#F0F9FF',
                      padding: '12px',
                      borderRadius: '8px',
                      borderLeft: '3px solid #3B82F6'
                    }}>
                      <p style={{fontSize: '13px', color: '#1F2937', marginBottom: '8px'}}>
                        {response.response_text}
                      </p>
                      <p style={{fontSize: '11px', color: '#6B7280'}}>
                        {response.supplier_name} • {new Date(response.created_at).toLocaleString('pt-PT')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{fontSize: '14px', color: '#9CA3AF', marginBottom: '24px', fontStyle: 'italic'}}>
                  Ainda sem respostas
                </p>
              )}
            </div>

            <div style={{
              padding: '20px 24px',
              borderTop: '1px solid #E5E7EB',
              background: '#F9FAFB'
            }}>
              <form onSubmit={handleSubmitResponse}>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Escreva a sua resposta..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical',
                    minHeight: '80px',
                    marginBottom: '12px',
                    fontFamily: 'inherit'
                  }}
                  required
                />
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    background: '#7c3aed',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Send size={16} />
                  Enviar Resposta
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProblemCard = ({ problem, onClick, selected, getStatusColor, getStatusTextColor, getStatusText }) => {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        padding: '16px',
        borderRadius: '12px',
        border: selected ? '2px solid #7c3aed' : '1px solid #E5E7EB',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: selected ? '0 4px 12px rgba(124, 58, 237, 0.15)' : '0 1px 3px rgba(0,0,0,0.1)'
      }}
    >
      <h4 style={{
        fontSize: '15px',
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: '8px'
      }}>
        {problem.store_name}
      </h4>
      <p style={{
        fontSize: '13px',
        color: '#6B7280',
        marginBottom: '12px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      }}>
        {problem.title}
      </p>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <span style={{
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: '500',
          background: getStatusColor(problem.status),
          color: getStatusTextColor(problem.status)
        }}>
          {getStatusText(problem.status)}
        </span>
        {problem.response_count > 0 && (
          <span style={{fontSize: '12px', color: '#9CA3AF'}}>
            {problem.response_count} resposta{problem.response_count > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
};

const StorePanel = () => {
  const { logout, token, user } = React.useContext(AuthContext);
  const [problems, setProblems] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'normal'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/store/problems`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProblems(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_URL}/store/problems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSuccess('Problema reportado com sucesso!');
        setFormData({ title: '', description: '', priority: 'normal' });
        setShowCreateForm(false);
        loadProblems();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Erro ao criar problema');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FEF3C7';
      case 'in_progress': return '#DBEAFE';
      case 'resolved': return '#D1FAE5';
      case 'closed': return '#F3F4F6';
      default: return '#F3F4F6';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'pending': return '#92400E';
      case 'in_progress': return '#1E40AF';
      case 'resolved': return '#065F46';
      case 'closed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Progresso';
      case 'resolved': return 'Resolvido';
      case 'closed': return 'Fechado';
      default: return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#FEE2E2';
      case 'high': return '#FED7AA';
      case 'normal': return '#E0E7FF';
      case 'low': return '#F3F4F6';
      default: return '#F3F4F6';
    }
  };

  const getPriorityTextColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#991B1B';
      case 'high': return '#9A3412';
      case 'normal': return '#3730A3';
      case 'low': return '#6B7280';
      default: return '#6B7280';
    }
  };

  return (
    <div style={{minHeight: '100vh', background: '#F9FAFB', display: 'flex', flexDirection: 'column'}}>
      <header style={{
        background: 'white',
        borderBottom: '1px solid #E5E7EB',
        padding: '16px 24px'
      }}>
        <div style={{
          width: '100%',
          padding: '0 24px',
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
              {user.profile?.store_name || 'Minha Loja'}
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

      <div style={{
        flex: 1,
        display: 'flex',
        width: '100%',
        margin: '0 auto',
        padding: '24px',
        gap: '24px'
      }}>
        <div style={{flex: '0 0 400px'}}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '24px',
            position: 'sticky',
            top: '24px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '20px'
            }}>
              Reportar Problema
            </h2>

            {success && (
              <div style={{
                background: '#D1FAE5',
                border: '1px solid #6EE7B7',
                color: '#065F46',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {success}
              </div>
            )}

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
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Título do Problema
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Vidro partido na porta"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
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
                }}>
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descreva o problema em detalhe..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minHeight: '120px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
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
                }}>
                  Prioridade
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="low">Baixa</option>
                  <option value="normal">Normal</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: '#7c3aed',
                  color: 'white',
                  padding: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '8px'
                }}
              >
                <Plus size={18} />
                Reportar Problema
              </button>
            </form>
          </div>
        </div>

        <div style={{flex: 1}}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{padding: '20px 24px', borderBottom: '1px solid #E5E7EB'}}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1F2937',
                margin: 0
              }}>
                Meus Problemas ({problems.length})
              </h2>
            </div>

            {loading ? (
              <div style={{padding: '40px', textAlign: 'center', color: '#6B7280'}}>
                A carregar problemas...
              </div>
            ) : problems.length === 0 ? (
              <div style={{padding: '40px', textAlign: 'center'}}>
                <AlertCircle size={48} style={{color: '#D1D5DB', margin: '0 auto 16px'}} />
                <p style={{color: '#6B7280', fontSize: '14px'}}>
                  Ainda não reportou nenhum problema
                </p>
              </div>
            ) : (
              <div style={{overflowX: 'auto'}}>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{background: '#F9FAFB', borderBottom: '1px solid #E5E7EB'}}>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6B7280',
                        textTransform: 'uppercase'
                      }}>
                        Problema
                      </th>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6B7280',
                        textTransform: 'uppercase'
                      }}>
                        Status
                      </th>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6B7280',
                        textTransform: 'uppercase'
                      }}>
                        Prioridade
                      </th>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6B7280',
                        textTransform: 'uppercase'
                      }}>
                        Respostas
                      </th>
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6B7280',
                        textTransform: 'uppercase'
                      }}>
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {problems.map((problem) => (
                      <tr key={problem.id} style={{
                        borderBottom: '1px solid #F3F4F6',
                        cursor: 'pointer'
                      }}>
                        <td style={{padding: '16px'}}>
                          <div>
                            <p style={{
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#1F2937',
                              marginBottom: '4px'
                            }}>
                              {problem.title}
                            </p>
                            <p style={{
                              fontSize: '13px',
                              color: '#6B7280',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '300px'
                            }}>
                              {problem.description}
                            </p>
                          </div>
                        </td>
                        <td style={{padding: '16px'}}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            background: getStatusColor(problem.status),
                            color: getStatusTextColor(problem.status),
                            whiteSpace: 'nowrap'
                          }}>
                            {getStatusText(problem.status)}
                          </span>
                        </td>
                        <td style={{padding: '16px'}}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '500',
                            background: getPriorityColor(problem.priority),
                            color: getPriorityTextColor(problem.priority),
                            textTransform: 'capitalize'
                          }}>
                            {problem.priority}
                          </span>
                        </td>
                        <td style={{padding: '16px', fontSize: '14px', color: '#6B7280'}}>
                          {problem.responses && problem.responses.length > 0 ? (
                            <div>
                              <p style={{fontSize: '13px', fontWeight: '500', color: '#3B82F6', marginBottom: '4px'}}>
                                {problem.responses.length} resposta{problem.responses.length > 1 ? 's' : ''}
                              </p>
                              {problem.responses.slice(0, 1).map(r => (
                                <p key={r.id} style={{
                                  fontSize: '12px',
                                  color: '#6B7280',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '200px'
                                }}>
                                  {r.response_text}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <span style={{fontSize: '13px', color: '#9CA3AF', fontStyle: 'italic'}}>
                              Sem respostas
                            </span>
                          )}
                        </td>
                        <td style={{padding: '16px', fontSize: '13px', color: '#6B7280'}}>
                          {new Date(problem.created_at).toLocaleDateString('pt-PT')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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