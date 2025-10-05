// App.jsx - CÓDIGO COMPLETO com Dashboards Funcionais
// Portal Reportaxial - EXPRESSGLASS

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const API_URL = 'https://reportaxialback-production.up.railway.app/api';

// ============ FUNÇÕES AUXILIARES ============

const exportToPDF = (problems, storeName) => {
  const printWindow = window.open('', '_blank');
  const getPriorityLabel = (priority) => {
    const labels = { low: 'Baixa', normal: 'Normal', high: 'Alta', urgent: 'Urgente' };
    return labels[priority] || 'Normal';
  };
  const getStatusLabel = (status) => {
    const labels = { pending: 'Pendente', in_progress: 'Em Progresso', resolved: 'Resolvido', closed: 'Fechado' };
    return labels[status] || 'Pendente';
  };
  
  const html = \`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Relatório de Problemas - \${storeName || 'ReportAxial'}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #1F2937; border-bottom: 3px solid #6366F1; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #E5E7EB; padding: 12px; text-align: left; }
        th { background: #F3F4F6; font-weight: 600; }
        .priority-urgent { color: #DC2626; font-weight: bold; }
        .priority-high { color: #EA580C; }
        .footer { margin-top: 40px; text-align: center; color: #6B7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>Relatório de Problemas\${storeName ? ' - ' + storeName : ''}</h1>
      <p>Gerado em: \${new Date().toLocaleString('pt-PT')}</p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Descrição</th>
            <th>Prioridade</th>
            <th>Status</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          \${problems.map(p => \`
            <tr>
              <td>#\${p.id}</td>
              <td>\${p.problem_description || p.description}</td>
              <td class="priority-\${p.priority}">\${getPriorityLabel(p.priority)}</td>
              <td>\${getStatusLabel(p.status)}</td>
              <td>\${new Date(p.created_at).toLocaleDateString('pt-PT')}</td>
            </tr>
          \`).join('')}
        </tbody>
      </table>
      <div class="footer">
        <p>EXPRESSGLASS - Vidros para Viaturas</p>
        <p>ReportAxial © \${new Date().getFullYear()}</p>
      </div>
      <script>
        window.print();
        window.onafterprint = () => window.close();
      </script>
    </body>
    </html>
  \`;
  printWindow.document.write(html);
  printWindow.document.close();
};

const getPriorityBadge = (priority) => {
  const colors = {
    low: { bg: '#F3F4F6', text: '#6B7280', label: 'Baixa' },
    normal: { bg: '#DBEAFE', text: '#1E40AF', label: 'Normal' },
    high: { bg: '#FED7AA', text: '#9A3412', label: 'Alta' },
    urgent: { bg: '#FEE2E2', text: '#991B1B', label: 'Urgente' }
  };
  const style = colors[priority] || colors.normal;
  return (
    <span style={{
      padding: '4px 12px', borderRadius: '12px', fontSize: '12px',
      fontWeight: '600', background: style.bg, color: style.text
    }}>
      {style.label}
    </span>
  );
};



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
          email: credentials.username,
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
        maxWidth: '500px',
        width: '100%'
      }}>
        <ExpressGlassLogo />

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#1F2937',
            marginBottom: '12px',
            margin: '0 0 12px 0'
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
          gap: '24px'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '10px'
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
              fontSize: '16px',
              fontWeight: '600',
              color: '#1F2937',
              marginBottom: '10px'
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
              padding: '18px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '17px',
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

// ============ COMPONENTE HEADER ============

const DashboardHeader = ({ title, onLogout }) => (
  <div style={{
    background: '#FFFFFF',
    borderBottom: '1px solid #E5E7EB',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <img 
        src="/expressglass-logo.png" 
        alt="EXPRESSGLASS" 
        style={{ height: '32px' }}
      />
      <span style={{ color: '#6B7280', fontSize: '14px' }}>| {title}</span>
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
);

// ============ VISTA LOJA ============

const StoreDashboard = ({ onLogout }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filteredProblems, setFilteredProblems] = useState([]);
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
      const response = await fetch(`${API_URL}/problems/store`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error('Erro ao carregar problemas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/problems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Problema reportado com sucesso!');
        setShowForm(false);
        setFormData({
          problem_description: '',
          order_date: '',
          supplier_order: '',
          product: '',
          eurocode: '',
          observations: ''
        });
        fetchProblems();
      }
    } catch (error) {
      alert('Erro ao reportar problema');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: { bg: '#FEF3C7', text: '#92400E', label: 'Pendente' },
      in_progress: { bg: '#DBEAFE', text: '#1E40AF', label: 'Em Progresso' },
      resolved: { bg: '#D1FAE5', text: '#065F46', label: 'Resolvido' }
    };
    const style = colors[status] || colors.pending;
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        background: style.bg,
        color: style.text
      }}>
        {style.label}
      </span>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F3F4F6',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <DashboardHeader title="Painel Loja" onLogout={onLogout} />

      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Estatísticas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total', value: stats.total, color: '#6366F1' },
            { label: 'Pendentes', value: stats.pending, color: '#F59E0B' },
            { label: 'Em Progresso', value: stats.in_progress, color: '#3B82F6' },
            { label: 'Resolvidos', value: stats.resolved, color: '#10B981' }
          ].map((stat, i) => (
            <div key={i} style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>{stat.label}</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>


                {/* Controles e Filtros */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="🔍 Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: '8px',
                fontSize: '14px', minWidth: '200px'
              }}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px' }}
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="in_progress">Em Progresso</option>
              <option value="resolved">Resolvido</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{ padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px' }}
            >
              <option value="all">Todas as Prioridades</option>
              <option value="low">Baixa</option>
              <option value="normal">Normal</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => exportToPDF(filteredProblems.length > 0 ? filteredProblems : problems, localStorage.getItem('userName'))}
              style={{
                padding: '10px 20px', background: '#10B981', color: 'white', border: 'none',
                borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600'
              }}
            >
              📄 Exportar PDF
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '10px 20px', background: '#6366F1', color: 'white', border: 'none',
                borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600'
              }}
            >
              {showForm ? 'Cancelar' : '+ Novo Reporte'}
            </button>
          </div>
        </div>



        {showForm && (
          <div style={{
            background: '#FFFFFF',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937', marginBottom: '20px' }}>
              Reportar Problema
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Descrição do Problema *
                </label>
                <textarea
                  value={formData.problem_description}
                  onChange={(e) => setFormData({...formData, problem_description: e.target.value})}
                  required
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Data da Encomenda
                  </label>
                  <input
                    type="date"
                    value={formData.order_date}
                    onChange={(e) => setFormData({...formData, order_date: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Nº Encomenda Fornecedor
                  </label>
                  <input
                    type="text"
                    value={formData.supplier_order}
                    onChange={(e) => setFormData({...formData, supplier_order: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Produto
                  </label>
                  <input
                    type="text"
                    value={formData.product}
                    onChange={(e) => setFormData({...formData, product: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Eurocódigo
                  </label>
                  <input
                    type="text"
                    value={formData.eurocode}
                    onChange={(e) => setFormData({...formData, eurocode: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Observações
                </label>
                <textarea
                  value={formData.observations}
                  onChange={(e) => setFormData({...formData, observations: e.target.value})}
                  rows="2"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '12px',
                  background: '#6366F1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Enviar Reporte
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
            A carregar...
          </div>
        ) : problems.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#6B7280'
          }}>
            Nenhum problema reportado ainda.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(filteredProblems.length > 0 ? filteredProblems : problems).map((problem) => (
              <div key={problem.id} style={{
                background: '#FFFFFF',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <h3style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      {getPriorityBadge(problem.priority)}
                      {getStatusBadge(problem.status)}
                    </div>
                    <h3style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      {getPriorityBadge(problem.priority)}
                      {getStatusBadge(problem.status)}
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: '0 0 4px 0' }}>
                      {problem.problem_description}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                      {new Date(problem.created_at).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                </div>
                {problem.response_text && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: '#F9FAFB',
                    borderLeft: '3px solid #6366F1',
                    borderRadius: '4px'
                  }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#1F2937', margin: '0 0 4px 0' }}>
                      Resposta do Fornecedor:
                    </p>
                    <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>
                      {problem.response_text}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============ VISTA FORNECEDOR ============

const SupplierDashboard = ({ onLogout }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/problems/supplier`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error('Erro ao carregar problemas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (problemId) => {
    if (!responseText.trim()) {
      alert('Por favor, escreva uma resposta');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/problems/${problemId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ response_text: responseText })
      });

      if (response.ok) {
        alert('Resposta enviada com sucesso!');
        setSelectedProblem(null);
        setResponseText('');
        fetchProblems();
      }
    } catch (error) {
      alert('Erro ao enviar resposta');
    }
  };

  useEffect(() => {
    let filtered = [...problems];
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        (p.problem_description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.product || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.store_name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }
    
    if (filterPriority !== 'all') {
      filtered = filtered.filter(p => p.priority === filterPriority);
    }
    
    setFilteredProblems(filtered);
  }, [problems, searchTerm, filterStatus, filterPriority]);


  const handleResolve = async (problemId) => {
    if (!confirm('Marcar este problema como resolvido?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/problems/${problemId}/resolve`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Problema marcado como resolvido!');
        fetchProblems();
      }
    } catch (error) {
      alert('Erro ao resolver problema');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: { bg: '#FEF3C7', text: '#92400E', label: 'Pendente' },
      in_progress: { bg: '#DBEAFE', text: '#1E40AF', label: 'Em Progresso' },
      resolved: { bg: '#D1FAE5', text: '#065F46', label: 'Resolvido' }
    };
    const style = colors[status] || colors.pending;
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        background: style.bg,
        color: style.text
      }}>
        {style.label}
      </span>
    );
  };


  const stats = {
    total: problems.length,
    pending: problems.filter(p => p.status === 'pending').length,
    in_progress: problems.filter(p => p.status === 'in_progress').length,
    resolved: problems.filter(p => p.status === 'resolved').length
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F3F4F6',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <DashboardHeader title="Painel Fornecedor" onLogout={onLogout} />

      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Estatísticas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total', value: stats.total, color: '#6366F1' },
            { label: 'Pendentes', value: stats.pending, color: '#F59E0B' },
            { label: 'Em Progresso', value: stats.in_progress, color: '#3B82F6' },
            { label: 'Resolvidos', value: stats.resolved, color: '#10B981' }
          ].map((stat, i) => (
            <div key={i} style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>{stat.label}</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>


                {/* Controles e Filtros */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>
            Problemas Reportados
          </h1>
          <div style={{ display: 'flex', gap: '12px', flex: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <input
              type="text"
              placeholder="🔍 Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: '8px',
                fontSize: '14px', minWidth: '200px'
              }}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px' }}
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="in_progress">Em Progresso</option>
              <option value="resolved">Resolvido</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{ padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px' }}
            >
              <option value="all">Todas as Prioridades</option>
              <option value="low">Baixa</option>
              <option value="normal">Normal</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
            <button
              onClick={() => exportToPDF(filteredProblems.length > 0 ? filteredProblems : problems, 'Fornecedor')}
              style={{
                padding: '10px 20px', background: '#10B981', color: 'white', border: 'none',
                borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600'
              }}
            >
              📄 Exportar PDF
            </button>
          </div>
        </div>



        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
            A carregar...
          </div>
        ) : problems.length === 0 ? (
          <div style={{
            background: '#FFFFFF',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#6B7280'
          }}>
            Nenhum problema reportado.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(filteredProblems.length > 0 ? filteredProblems : problems).map((problem) => (
              <div key={problem.id} style={{
                background: '#FFFFFF',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <h3style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      {getPriorityBadge(problem.priority)}
                      {getStatusBadge(problem.status)}
                    </div>
                    <h3style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      {getPriorityBadge(problem.priority)}
                      {getStatusBadge(problem.status)}
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1F2937', margin: '0 0 4px 0' }}>
                      {problem.problem_description}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 8px 0' }}>
                      Loja: {problem.store_name} | {new Date(problem.created_at).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                </div>

                {problem.response_text ? (
                  <div style={{
                    padding: '12px',
                    background: '#F9FAFB',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#1F2937', margin: '0 0 4px 0' }}>
                      Sua Resposta:
                    </p>
                    <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>
                      {problem.response_text}
                    </p>
                  </div>
                ) : null}

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  {problem.status !== 'resolved' && (
                    <>
                      <button
                        onClick={() => setSelectedProblem(problem.id === selectedProblem ? null : problem.id)}
                        style={{
                          padding: '8px 16px',
                          background: '#6366F1',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                      >
                        {problem.response_text ? 'Editar Resposta' : 'Responder'}
                      </button>
                      {problem.response_text && (
                        <button
                          onClick={() => handleResolve(problem.id)}
                          style={{
                            padding: '8px 16px',
                            background: '#10B981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}
                        >
                          Marcar como Resolvido
                        </button>
                      )}
                    </>
                  )}
                </div>

                {selectedProblem === problem.id && (
                  <div style={{ marginTop: '16px', padding: '16px', background: '#F9FAFB', borderRadius: '8px' }}>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Escreva sua resposta..."
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '14px',
                        marginBottom: '8px',
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleRespond(problem.id)}
                        style={{
                          padding: '8px 16px',
                          background: '#6366F1',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                      >
                        Enviar Resposta
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProblem(null);
                          setResponseText('');
                        }}
                        style={{
                          padding: '8px 16px',
                          background: '#E5E7EB',
                          color: '#374151',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============ VISTA ADMIN ============

const AdminDashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    supplierName: '',
    contactPerson: ''
  });

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
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/admin/create-supplier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Fornecedor criado com sucesso!');
        setShowForm(false);
        setFormData({ email: '', password: '', supplierName: '', contactPerson: '' });
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.message || 'Erro ao criar fornecedor');
      }
    } catch (error) {
      alert('Erro ao criar fornecedor');
    }
  };

  const getUserTypeBadge = (type) => {
    const colors = {
      admin: { bg: '#FEE2E2', text: '#991B1B', label: 'Admin' },
      store: { bg: '#DBEAFE', text: '#1E40AF', label: 'Loja' },
      supplier: { bg: '#D1FAE5', text: '#065F46', label: 'Fornecedor' }
    };
    const style = colors[type] || colors.store;
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        background: style.bg,
        color: style.text
      }}>
        {style.label}
      </span>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F3F4F6',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <DashboardHeader title="Painel Admin" onLogout={onLogout} />

      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Controles e Filtros */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="🔍 Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: '8px',
                fontSize: '14px', minWidth: '200px'
              }}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px' }}
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="in_progress">Em Progresso</option>
              <option value="resolved">Resolvido</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{ padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px' }}
            >
              <option value="all">Todas as Prioridades</option>
              <option value="low">Baixa</option>
              <option value="normal">Normal</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => exportToPDF(filteredProblems.length > 0 ? filteredProblems : problems, localStorage.getItem('userName'))}
              style={{
                padding: '10px 20px', background: '#10B981', color: 'white', border: 'none',
                borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600'
              }}
            >
              📄 Exportar PDF
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '10px 20px', background: '#6366F1', color: 'white', border: 'none',
                borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600'
              }}
            >
              {showForm ? 'Cancelar' : '+ Novo Reporte'}
            </button>
          </div>
        </div>



        {showForm && (
          <div style={{
            background: '#FFFFFF',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937', marginBottom: '20px' }}>
              Criar Novo Fornecedor
            </h2>
            <form onSubmit={handleCreateSupplier} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Nome do Fornecedor *
                  </label>
                  <input
                    type="text"
                    value={formData.supplierName}
                    onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Pessoa de Contacto
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
              <button
                type="submit"
                style={{
                  padding: '12px',
                  background: '#6366F1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Criar Fornecedor
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
            A carregar...
          </div>
        ) : (
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    Email
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    Tipo
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                    Data de Criação
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#1F2937' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '16px' }}>
                      {getUserTypeBadge(user.user_type)}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#6B7280' }}>
                      {new Date(user.created_at).toLocaleDateString('pt-PT')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
