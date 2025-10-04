// APP.JSX - FRONTEND PARTE 1 (Portal Reportaxial - CORRIGIDO)

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

// Componente de Login
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

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
      <div style={{background: 'white', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', padding: '48px', maxWidth: '440px', width: '100%'}}>
        <div style={{textAlign: 'center', marginBottom: '32px'}}>
          <h1 style={{fontSize: '32px', fontWeight: 'bold', color: '#1F2937', marginBottom: '8px'}}>EXPRESSGLASS</h1>
          <p style={{color: '#6B7280', fontSize: '14px'}}>Braga</p>
        </div>

        {!showRegister ? (
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
              Entrar
            </button>

            <p style={{textAlign: 'center', color: '#6B7280', fontSize: '14px'}}>
              Não tem conta?{' '}
              <button
                type="button"
                onClick={() => setShowRegister(true)}
                style={{color: '#667eea', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline'}}
              >
                Criar conta
              </button>
            </p>
          </form>
        ) : (
          <RegisterForm onBack={() => setShowRegister(false)} />
        )}

        <p style={{textAlign: 'center', color: '#9CA3AF', fontSize: '12px', marginTop: '24px'}}>
          Powered by Neon PostgreSQL
        </p>
      </div>
    </div>
  );
};

// Componente de Registo
const RegisterForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    storeName: '',
    contactPerson: '',
    phone: '',
    address: ''
  });

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
        alert('Registo efetuado com sucesso! Pode fazer login.');
        onBack();
      } else {
        alert(data.message || 'Erro no registo');
      }
    } catch (error) {
      alert('Erro ao conectar ao servidor');
    }
  };

  return (
    <div>
      <h2 style={{fontSize: '24px', fontWeight: 'bold', color: '#1F2937', marginBottom: '24px', textAlign: 'center'}}>Registo de Loja</h2>
      <form onSubmit={handleRegister} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
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
          />
        </div>

        <div>
          <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Telefone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            style={{width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}}
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
  );
};

// Vista Admin
const AdminDashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [showCreateSupplier, setShowCreateSupplier] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao carregar utilizadores:', error);
    }
  };

  return (
    <div style={{minHeight: '100vh', background: '#F3F4F6', padding: '20px'}}>
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        <div style={{background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h1 style={{fontSize: '24px', fontWeight: 'bold', color: '#1F2937'}}>Painel Admin - ExpressGlass</h1>
            <button onClick={onLogout} style={{padding: '8px 16px', background: '#EF4444', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer'}}>Sair</button>
          </div>
        </div>

        <div style={{background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <h2 style={{fontSize: '20px', fontWeight: '600'}}>Gestão de Utilizadores</h2>
            <button
              onClick={() => setShowCreateSupplier(!showCreateSupplier)}
              style={{padding: '10px 20px', background: '#667eea', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer'}}
            >
              + Criar Fornecedor
            </button>
          </div>

          {showCreateSupplier && <CreateSupplierForm onSuccess={() => { setShowCreateSupplier(false); fetchUsers(); }} />}

          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{background: '#F9FAFB', borderBottom: '2px solid #E5E7EB'}}>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: '600'}}>Email</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: '600'}}>Tipo</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: '600'}}>Status</th>
                <th style={{padding: '12px', textAlign: 'left', fontWeight: '600'}}>Data</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{borderBottom: '1px solid #E5E7EB'}}>
                  <td style={{padding: '12px'}}>{user.email}</td>
                  <td style={{padding: '12px'}}>
                    <span style={{padding: '4px 12px', borderRadius: '12px', fontSize: '12px', background: user.user_type === 'admin' ? '#FEE2E2' : user.user_type === 'supplier' ? '#DBEAFE' : '#D1FAE5', color: user.user_type === 'admin' ? '#991B1B' : user.user_type === 'supplier' ? '#1E40AF' : '#065F46'}}>
                      {user.user_type}
                    </span>
                  </td>
                  <td style={{padding: '12px'}}>{user.is_active ? '✅ Ativo' : '❌ Inativo'}</td>
                  <td style={{padding: '12px'}}>{new Date(user.created_at).toLocaleDateString('pt-PT')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Criar Fornecedor
const CreateSupplierForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '', supplierName: '', contactPerson: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/admin/create-supplier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Fornecedor criado com sucesso!');
        onSuccess();
      }
    } catch (error) {
      alert('Erro ao criar fornecedor');
    }
  };

  return (
    <div style={{background: '#F9FAFB', padding: '20px', borderRadius: '8px', marginBottom: '20px'}}>
      <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px'}}>Novo Fornecedor</h3>
      <form onSubmit={handleSubmit} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
        <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px'}} required />
        <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={{padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px'}} required />
        <input type="text" placeholder="Nome Fornecedor" value={formData.supplierName} onChange={(e) => setFormData({...formData, supplierName: e.target.value})} style={{padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px'}} required />
        <input type="text" placeholder="Pessoa Contacto" value={formData.contactPerson} onChange={(e) => setFormData({...formData, contactPerson: e.target.value})} style={{padding: '10px', border: '1px solid #D1D5DB', borderRadius: '6px'}} />
        <button type="submit" style={{gridColumn: '1 / -1', padding: '10px', background: '#10B981', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer'}}>Criar</button>
      </form>
    </div>
  );
};

// APP.JSX - FRONTEND PARTE 2 CONTINUAÇÃO (Portal Reportaxial - CORRIGIDO)

                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {selectedProblem.response_text ? '📝 Atualizar Resposta' : '✉️ Enviar Resposta'}
            </button>
          </form>

          {/* 🆕 BOTÃO MARCAR COMO RESOLVIDO - Só aparece se já tiver respondido e não estiver resolvido */}
          {selectedProblem.response_text && selectedProblem.status !== 'resolved' && (
            <button
              onClick={() => handleResolve(selectedProblem.id)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#10B981',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              ✅ Marcar como Resolvido
            </button>
          )}

          {/* Indicador se já está resolvido */}
          {selectedProblem.status === 'resolved' && (
            <div style={{padding: '16px', background: '#D1FAE5', borderRadius: '8px', textAlign: 'center', border: '2px solid #10B981'}}>
              <p style={{fontSize: '16px', fontWeight: '600', color: '#065F46'}}>✅ Problema Resolvido</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 🆕 VISTA LOJA - MELHORADA (mostra status colorido)
const StoreDashboard = ({ onLogout }) => {
  const [problems, setProblems] = useState([]);
  const [formData, setFormData] = useState({
    problem_description: '',
    order_date: '',
    supplier_order: '',
    product: '',
    eurocode: '',
    observations: ''
  });

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${API_URL}/problems/store`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setProblems(data);
    } catch (error) {
      console.error('Erro ao carregar problemas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`${API_URL}/problems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      alert('Problema reportado com sucesso!');
      setFormData({ problem_description: '', order_date: '', supplier_order: '', product: '', eurocode: '', observations: '' });
      fetchProblems();
    } catch (error) {
      alert('Erro ao reportar problema');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: '#FEF3C7', color: '#92400E', text: 'Pendente' },
      in_progress: { bg: '#DBEAFE', color: '#1E40AF', text: 'Em Progresso' },
      resolved: { bg: '#D1FAE5', color: '#065F46', text: 'Resolvido' }
    };
    const s = styles[status] || styles.pending;
    return <span style={{padding: '6px 12px', borderRadius: '12px', fontSize: '12px', background: s.bg, color: s.color, fontWeight: '600'}}>{s.text}</span>;
  };

  return (
    <div style={{minHeight: '100vh', background: '#F3F4F6', display: 'flex'}}>
      {/* Formulário */}
      <div style={{width: '40%', padding: '20px', overflowY: 'auto'}}>
        <div style={{background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <h1 style={{fontSize: '20px', fontWeight: 'bold', color: '#1F2937'}}>EXPRESSGLASS</h1>
              <p style={{fontSize: '12px', color: '#6B7280'}}>Braga</p>
            </div>
            <button onClick={onLogout} style={{padding: '8px 16px', background: '#EF4444', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer'}}>Sair</button>
          </div>
        </div>

        <div style={{background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <h2 style={{fontSize: '18px', fontWeight: '600', marginBottom: '20px'}}>Reportar Problema</h2>
          
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Problema a Reportar *</label>
              <input
                type="text"
                value={formData.problem_description}
                onChange={(e) => setFormData({...formData, problem_description: e.target.value})}
                style={{width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}}
                required
              />
            </div>

            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Data do Pedido *</label>
              <input
                type="date"
                value={formData.order_date}
                onChange={(e) => setFormData({...formData, order_date: e.target.value})}
                style={{width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}}
                required
              />
            </div>

            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Encomenda Fornecedor *</label>
              <input
                type="text"
                placeholder="Apenas números"
                value={formData.supplier_order}
                onChange={(e) => setFormData({...formData, supplier_order: e.target.value})}
                style={{width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}}
                required
              />
            </div>

            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Produto *</label>
              <input
                type="text"
                value={formData.product}
                onChange={(e) => setFormData({...formData, product: e.target.value})}
                style={{width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}}
                required
              />
            </div>

            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Eurocode</label>
              <input
                type="text"
                placeholder="Referência (opcional)"
                value={formData.eurocode}
                onChange={(e) => setFormData({...formData, eurocode: e.target.value})}
                style={{width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px'}}
              />
            </div>

            <div>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>Observações *</label>
              <textarea
                placeholder="Descreva o problema em detalhe..."
                value={formData.observations}
                onChange={(e) => setFormData({...formData, observations: e.target.value})}
                style={{width: '100%', padding: '12px 16px', border: '2px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', minHeight: '100px'}}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              + Reportar Problema
            </button>
          </form>
        </div>
      </div>

      {/* Lista de Problemas */}
      <div style={{width: '60%', padding: '20px', overflowY: 'auto'}}>
        <h2 style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#1F2937'}}>Meus Problemas ({problems.length})</h2>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
          {problems.map(problem => (
            <div key={problem.id} style={{background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px'}}>
                <div style={{flex: 1}}>
                  <h3 style={{fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '4px'}}>{problem.problem_description}</h3>
                  <p style={{fontSize: '12px', color: '#6B7280'}}>Enc: {problem.supplier_order} | {problem.product}</p>
                </div>
                {getStatusBadge(problem.status)}
              </div>

              <div style={{fontSize: '12px', color: '#6B7280', marginBottom: '12px'}}>
                <strong>Data Pedido:</strong> {problem.order_date ? new Date(problem.order_date).toLocaleDateString('pt-PT') : 'N/A'}
              </div>

              {problem.response_text && (
                <div style={{background: '#F3F4F6', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #667eea'}}>
                  <p style={{fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px'}}>📩 Resposta do Fornecedor:</p>
                  <p style={{fontSize: '13px', color: '#4B5563'}}>{problem.response_text}</p>
                  <p style={{fontSize: '11px', color: '#9CA3AF', marginTop: '6px'}}>
                    {problem.response_date ? new Date(problem.response_date).toLocaleString('pt-PT') : ''}
                  </p>
                </div>
              )}
            </div>
          ))}

          {problems.length === 0 && (
            <div style={{background: 'white', padding: '40px', borderRadius: '8px', textAlign: 'center', color: '#9CA3AF'}}>
              <p>Nenhum problema reportado ainda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente Principal
const App = () => {
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
};

export default App;