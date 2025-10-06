/* Build: 1759693559 - Full Width Layout */
// App.jsx - CÓDIGO COMPLETO com Dashboards Funcionais
// Portal Reportaxial - EXPRESSGLASS

import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as XLSX from 'xlsx';

const API_URL = 'https://reportaxialback-production.up.railway.app/api';

// ============ FUNÇÕES AUXILIARES ============

const exportToPDF = (problems, storeName) => {
  const printWindow = window.open('', '_blank');
  const getPriorityLabel = (priority) => {
    const labels = { low: 'Baixa', normal: 'Normal', high: 'Alta', urgent: 'Urgente' };
    return labels[priority] || 'Normal';
  };
  const getStatusLabel = (status) => {
    const labels = { pending: 'Pendente', in_progress: 'Em Análise', resolved: 'Resolvido', closed: 'Fechado' };
    return labels[status] || 'Pendente';
  };
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Relatório de Problemas - ${storeName || 'ReportAxial'}</title>
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
      <h1>Relatório de Problemas${storeName ? ' - ' + storeName : ''}</h1>
      <p>Gerado em: ${new Date().toLocaleString('pt-PT')}</p>
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
          ${problems.map(p => `
            <tr>
              <td>#${p.id}</td>
              <td>${p.problem_description || p.description}</td>
              <td class="priority-${p.priority}">${getPriorityLabel(p.priority)}</td>
              <td>${getStatusLabel(p.status)}</td>
              <td>${new Date(p.created_at).toLocaleDateString('pt-PT')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="footer">
        <p>EXPRESSGLASS - Vidros para Viaturas</p>
        <p>ReportAxial © ${new Date().getFullYear()}</p>
      </div>
      <script>
        window.print();
        window.onafterprint = () => window.close();
      </script>
    </body>
    </html>
  `;
  printWindow.document.write(html);
  printWindow.document.close();
};


// ============ COMPONENTE LOGO ============

const ExpressGlassLogo = () => (
  <div style={{
    background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
    padding: '32px',
    borderRadius: '16px',
    marginBottom: '32px',
    textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
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
        localStorage.setItem('token', data.token);
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
        padding: '48px 60px',
        maxWidth: '500px',
        width: '100%',
        margin: '0 auto'
      }}>
        <ExpressGlassLogo />

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: '#FFFFFF',
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
              color: '#FFFFFF',
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
                color: '#FFFFFF',
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
              color: '#FFFFFF',
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
                color: '#FFFFFF',
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


// ============ VISTA LOJA - REDESENHADA ============

const StoreDashboard = ({ onLogout }) => {
  const [problems, setProblems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeFilter, setActiveFilter] = useState({ type: null, value: null });
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editedObservations, setEditedObservations] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  
  // Usar refs em vez de controlled components
  const problemTypeRef = useRef(null);
  const orderDateRef = useRef(null);
  const supplierOrderRef = useRef(null);
  const eurocodeRef = useRef(null);
  const observationsRef = useRef(null);

  const problemTypeOptions = [
    'Material não chegou',
    'Material danificado',
    'Material errado',
    'Outro'
  ];

  useEffect(() => {
    fetchProblems();
    
    // Auto-refresh a cada 20 segundos
    const refreshInterval = setInterval(() => {
      fetchProblems();
    }, 20000);
    
    // Detectar mudanças no tamanho da tela
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchProblems = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('[Frontend] Buscando problemas com token:', token ? 'presente' : 'ausente');
      
      const response = await fetch(`${API_URL}/problems/store`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('[Frontend] Response status:', response.status);
      const data = await response.json();
      console.log('[Frontend] Dados recebidos:', data);
      
      // Garantir que data é sempre um array
      setProblems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar problemas:', error);
      setProblems([]); // Em caso de erro, usar array vazio
    } finally {
      setLoading(false);
    }
  };

  // Filtro de pesquisa - incluir TODOS os problemas quando há termo de pesquisa
  useEffect(() => {
    if (searchTerm.trim()) {
      // Quando há pesquisa, mostrar TODOS os problemas (incluindo resolvidos)
      const filtered = problems.filter(p => 
        (p.eurocode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.problem_description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.supplier_order || '').toString().includes(searchTerm) ||
        (p.observations || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProblems(filtered);
    } else {
      // Sem pesquisa, limpar filtro (mostrará apenas não-resolvidos por padrão)
      setFilteredProblems([]);
    }
  }, [searchTerm, problems]);

  const handleExportToExcel = () => {
    // Filtrar problemas por data
    let problemsToExport = problems;
    
    if (exportStartDate || exportEndDate) {
      problemsToExport = problems.filter(problem => {
        const createdDate = new Date(problem.created_at);
        const startDate = exportStartDate ? new Date(exportStartDate) : null;
        const endDate = exportEndDate ? new Date(exportEndDate) : null;
        
        if (startDate && createdDate < startDate) return false;
        if (endDate && createdDate > endDate) return false;
        return true;
      });
    }

    // Preparar dados para Excel
    const excelData = problemsToExport.map(problem => {
      const createdDate = new Date(problem.created_at);
      const resolvedDate = problem.resolved_at ? new Date(problem.resolved_at) : null;
      const days = resolvedDate 
        ? Math.floor((resolvedDate - createdDate) / (1000 * 60 * 60 * 24))
        : '-';
      
      // Pegar último comentário
      const lastMessage = problem.messages && problem.messages.length > 0
        ? problem.messages[problem.messages.length - 1].message
        : '-';

      return {
        'DATA REGISTO': createdDate.toLocaleDateString('pt-PT'),
        'DATA RESOLUÇÃO': resolvedDate ? resolvedDate.toLocaleDateString('pt-PT') : '-',
        'DIAS': days,
        'LOJA': problem.store_name || '-',
        'EUROCODE': problem.eurocode || '-',
        'PROBLEMA A REPORTAR': problem.problem_type || problem.description || '-',
        'RESOLUÇÃO': lastMessage
      };
    });

    // Criar workbook e worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Adicionar título
    XLSX.utils.sheet_add_aoa(ws, [['REPORT AXIAL']], { origin: 'A1' });
    XLSX.utils.sheet_add_aoa(ws, [[]], { origin: 'A2' }); // Linha vazia
    
    // Ajustar largura das colunas
    ws['!cols'] = [
      { wch: 15 }, // DATA REGISTO
      { wch: 15 }, // DATA RESOLUÇÃO
      { wch: 8 },  // DIAS
      { wch: 20 }, // LOJA
      { wch: 15 }, // EUROCODE
      { wch: 30 }, // PROBLEMA A REPORTAR
      { wch: 40 }  // RESOLUÇÃO
    ];

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Reportes');

    // Gerar arquivo
    const fileName = `ReportAxial_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);

    // Fechar modal
    setShowExportModal(false);
    setExportStartDate('');
    setExportEndDate('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Pegar valores diretamente do DOM
    const problemType = problemTypeRef.current.value;
    const supplierOrder = supplierOrderRef.current.value;
    const eurocode = eurocodeRef.current.value;
    const observations = observationsRef.current.value;
    
    // Obter data usando valueAsDate para garantir formato correto
    const dateInput = orderDateRef.current;
    let orderDate = '';
    
    if (dateInput.valueAsDate) {
      // Usar valueAsDate e formatar manualmente para YYYY-MM-DD
      const date = dateInput.valueAsDate;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      orderDate = `${year}-${month}-${day}`;
    } else if (dateInput.value) {
      // Fallback: tentar usar o value diretamente
      orderDate = dateInput.value;
    }
    
    // Validar data
    if (!orderDate) {
      alert('Por favor preencha a data');
      return;
    }
    
    // Validar formato final
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(orderDate)) {
      alert('Formato de data inválido. Use o formato YYYY-MM-DD');
      console.error('Data inválida:', orderDate);
      return;
    }
    
    console.log('Submit values:', { problemType, orderDate, supplierOrder, eurocode, observations });
    
    if (!problemType) {
      alert('Por favor selecione o tipo de problema');
      return;
    }
    
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_URL}/problems`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          problem_description: problemType,
          order_date: orderDate || null,
          supplier_order: supplierOrder || null,
          product: null,
          eurocode: eurocode || null,
          observations: observations || null,
          priority: 'normal'
        })
      });

      if (response.ok) {
        alert('✓ Problema reportado com sucesso!');
        // Limpar formulário
        problemTypeRef.current.value = '';
        orderDateRef.current.value = '';
        supplierOrderRef.current.value = '';
        eurocodeRef.current.value = '';
        observationsRef.current.value = '';
        setShowForm(false);
        fetchProblems();
      } else {
        const errorData = await response.json();
        alert(`Erro ao reportar: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erro ao reportar problema: ' + error.message);
    }
  };  const getStatusBadge = (status) => {
    const colors = {
      pending: { bg: '#FEE2E2', text: '#991B1B', label: 'Pendente' },      // Vermelho suave
      in_progress: { bg: '#FEF3C7', text: '#92400E', label: 'Em Análise' }, // Amarelo suave
      resolved: { bg: '#D1FAE5', text: '#065F46', label: 'Resolvido' }     // Verde suave
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

  // Contabilização por tipo de problema
  const problemTypeStats = {
    'Material não chegou': problems.filter(p => p.problem_description === 'Material não chegou').length,
    'Material danificado': problems.filter(p => p.problem_description === 'Material danificado').length,
    'Material errado': problems.filter(p => p.problem_description === 'Material errado').length,
    'Outro': problems.filter(p => p.problem_description === 'Outro').length
  };

   return (
    <div style={{
      minHeight: '100vh',
      background: '#5A5A5A',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <DashboardHeader title="Painel Loja" onLogout={onLogout} />

      {/* Título REPORT AXIAL e Botão Export */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1 }}></div>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          margin: 0,
          letterSpacing: '1px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          flex: 1,
          textAlign: 'center'
        }}>
          REPORT AXIAL
        </h1>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowExportModal(true)}
            style={{
              padding: '10px 20px',
              background: '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📊 Exportar Excel
          </button>
        </div>
      </div>

      <div style={{ 
        padding: '20px', 
        width: '100%', 
        boxSizing: 'border-box',
        flex: 1
      }}>
        
        {/* Layout Desktop: 2 linhas horizontais | Layout Mobile: 2 colunas verticais */}
        <div style={{
          display: isMobile ? 'grid' : 'flex',
          flexDirection: isMobile ? 'initial' : 'column',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'none',
          gap: isMobile ? '16px' : '24px',
          marginBottom: '24px',
          width: '100%'
        }}>
          
          {/* Coluna/Linha STATUS */}
          <div style={{ width: '100%' }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: '700', 
              color: '#FFFFFF', 
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              STATUS
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
              gap: isMobile ? '10px' : '16px',
              marginBottom: isMobile ? '0' : '16px'
            }}>
              <div 
                onClick={() => {
                  setActiveFilter({ type: 'status', value: 'all' });
                  setFilterStatus('all');
                }}
                style={{ 
                  background: '#EEF2FF', 
                  padding: isMobile ? '12px' : '16px', 
                  borderRadius: '10px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  border: activeFilter.type === 'status' && activeFilter.value === 'all' ? '3px solid #6366F1' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}>
                <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#6B7280', margin: '0 0 4px 0', fontWeight: '600' }}>TOTAL</p>
                <p style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 'bold', color: '#6366F1', margin: 0 }}>{stats.total}</p>
              </div>
              <div 
                onClick={() => {
                  setActiveFilter({ type: 'status', value: 'pending' });
                  setFilterStatus('pending');
                }}
                style={{ 
                  background: '#FEE2E2', 
                  padding: isMobile ? '12px' : '16px', 
                  borderRadius: '10px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  border: activeFilter.type === 'status' && activeFilter.value === 'pending' ? '3px solid #DC2626' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}>
                <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#6B7280', margin: '0 0 4px 0', fontWeight: '600' }}>PENDENTES</p>
                <p style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 'bold', color: '#DC2626', margin: 0 }}>{stats.pending}</p>
              </div>
              <div 
                onClick={() => {
                  setActiveFilter({ type: 'status', value: 'in_progress' });
                  setFilterStatus('in_progress');
                }}
                style={{ 
                  background: '#FEF3C7', 
                  padding: isMobile ? '12px' : '16px', 
                  borderRadius: '10px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  border: activeFilter.type === 'status' && activeFilter.value === 'in_progress' ? '3px solid #D97706' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}>
                <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#6B7280', margin: '0 0 4px 0', fontWeight: '600' }}>EM ANÁLISE</p>
                <p style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 'bold', color: '#D97706', margin: 0 }}>{stats.in_progress}</p>
              </div>
              <div 
                onClick={() => {
                  setActiveFilter({ type: 'status', value: 'resolved' });
                  setFilterStatus('resolved');
                }}
                style={{ 
                  background: '#D1FAE5', 
                  padding: isMobile ? '12px' : '16px', 
                  borderRadius: '10px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  border: activeFilter.type === 'status' && activeFilter.value === 'resolved' ? '3px solid #10B981' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}>
                <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#6B7280', margin: '0 0 4px 0', fontWeight: '600' }}>RESOLVIDOS</p>
                <p style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 'bold', color: '#10B981', margin: 0 }}>{stats.resolved}</p>
              </div>
            </div>
          </div>

          {/* Coluna/Linha MOTIVOS */}
          <div style={{ width: '100%' }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: '700', 
              color: '#FFFFFF', 
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              MOTIVOS
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
              gap: isMobile ? '10px' : '16px'
            }}>
              <div 
                onClick={() => setActiveFilter({ type: 'problemType', value: 'Material não chegou' })}
                style={{ 
                  background: '#FFFFFF', 
                  padding: isMobile ? '12px' : '16px', 
                  borderRadius: '10px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  border: activeFilter.type === 'problemType' && activeFilter.value === 'Material não chegou' ? '3px solid #EF4444' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}>
                <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#6B7280', margin: '0 0 4px 0', fontWeight: '600' }}>MATERIAL NÃO CHEGOU</p>
                <p style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 'bold', color: '#EF4444', margin: 0 }}>{problemTypeStats['Material não chegou']}</p>
              </div>
              <div 
                onClick={() => setActiveFilter({ type: 'problemType', value: 'Material danificado' })}
                style={{ 
                  background: '#FFFFFF', 
                  padding: isMobile ? '12px' : '16px', 
                  borderRadius: '10px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  border: activeFilter.type === 'problemType' && activeFilter.value === 'Material danificado' ? '3px solid #F97316' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}>
                <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#6B7280', margin: '0 0 4px 0', fontWeight: '600' }}>MATERIAL DANIFICADO</p>
                <p style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 'bold', color: '#F97316', margin: 0 }}>{problemTypeStats['Material danificado']}</p>
              </div>
              <div 
                onClick={() => setActiveFilter({ type: 'problemType', value: 'Material errado' })}
                style={{ 
                  background: '#FFFFFF', 
                  padding: isMobile ? '12px' : '16px', 
                  borderRadius: '10px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  border: activeFilter.type === 'problemType' && activeFilter.value === 'Material errado' ? '3px solid #8B5CF6' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}>
                <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#6B7280', margin: '0 0 4px 0', fontWeight: '600' }}>MATERIAL ERRADO</p>
                <p style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 'bold', color: '#8B5CF6', margin: 0 }}>{problemTypeStats['Material errado']}</p>
              </div>
              <div 
                onClick={() => setActiveFilter({ type: 'problemType', value: 'Outro' })}
                style={{ 
                  background: '#FFFFFF', 
                  padding: isMobile ? '12px' : '16px', 
                  borderRadius: '10px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  border: activeFilter.type === 'problemType' && activeFilter.value === 'Outro' ? '3px solid #64748B' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}>
                <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#6B7280', margin: '0 0 4px 0', fontWeight: '600' }}>OUTRO</p>
                <p style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 'bold', color: '#64748B', margin: 0 }}>{problemTypeStats['Outro']}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Caixa de Pesquisa */}
        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="🔍 Pesquisar por Eurocode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '12px 16px',
              background: '#1F2937',
              border: '2px solid #374151',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#FFFFFF',
              minWidth: '300px',
              width: '100%',
              maxWidth: '500px'
            }}
          />
        </div>

        {/* Botão Novo Reporte */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '12px 24px',
              background: '#6366F1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {showForm ? '✕ Cancelar' : '+ Novo Reporte'}
          </button>
        </div>

        {/* Formulário */}
        {showForm && (
          <div style={{
            background: '#FFFFFF',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', marginBottom: '24px' }}>
              Reportar Novo Problema
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#000000', marginBottom: '8px' }}>
                  Problema a Reportar *
                </label>
                <select
                  ref={problemTypeRef}
                  defaultValue=""
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #4B5563',
                    borderRadius: '8px',
                    fontSize: '15px',
                    boxSizing: 'border-box',
                    background: '#374151',
                    color: '#FFFFFF'
                  }}
                >
                  <option value="">Selecione o tipo de problema</option>
                  {problemTypeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#000000', marginBottom: '8px' }}>
                  Data Encomenda *
                </label>
                <input
                  type="date"
                  ref={orderDateRef}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '15px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#000000', marginBottom: '8px' }}>
                  Enc Fornecedor *
                </label>
                <input
                  type="number"
                  ref={supplierOrderRef}
                  placeholder="Apenas números"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '15px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#000000', marginBottom: '8px' }}>
                  Referência/Eurocode *
                </label>
                <input
                  type="text"
                  ref={eurocodeRef}
                  required
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '15px',
                    boxSizing: 'border-box',
                    textTransform: 'uppercase'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#000000', marginBottom: '8px' }}>
                  Observações
                </label>
                <textarea
                  ref={observationsRef}
                  rows="4"
                  placeholder="Descreva detalhes adicionais..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '15px',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '14px',
                  background: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Criar Reporte
              </button>
            </form>
          </div>
        )}

        {/* Lista de Reportes */}
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '16px' }}>
          Meus Reportes
        </h2>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '16px' 
          }}>
            {(filteredProblems.length > 0 ? filteredProblems : problems
              .filter(problem => {
              // Se filtro de status "resolved" está ativo, mostrar resolvidos
              if (activeFilter.type === 'status' && activeFilter.value === 'resolved') {
                return problem.status === 'resolved';
              }
              
              // Caso contrário, excluir resolvidos
              if (problem.status === 'resolved') return false;
              
              // Se não há filtro ativo, mostrar todos (exceto resolvidos)
              if (!activeFilter.type) return true;
              
              // Filtrar por status
              if (activeFilter.type === 'status') {
                if (activeFilter.value === 'all') return true;
                return problem.status === activeFilter.value;
              }
              
              // Filtrar por tipo de problema
              if (activeFilter.type === 'problemType') {
                return problem.problem_description === activeFilter.value;
              }
              
              return true;
            }))
            .map((problem) => (
              <div 
                key={problem.id} 
                onClick={async () => {
                  // Atualizar estado local imediatamente para parar de piscar
                  setProblems(prevProblems => 
                    prevProblems.map(p => 
                      p.id === problem.id ? { ...p, viewed_by_store: true } : p
                    )
                  );
                  
                  setSelectedProblem(problem);
                  setEditedObservations(problem.observations || '');
                  setShowDetailModal(true);
                  
                  // Carregar mensagens do histórico
                  try {
                    const token = localStorage.getItem('token');
                    const messagesResponse = await fetch(`${API_URL}/problems/${problem.id}/messages`, {
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    });
                    if (messagesResponse.ok) {
                      const messagesData = await messagesResponse.json();
                      setMessages(messagesData);
                    }
                  } catch (error) {
                    console.error('Erro ao carregar mensagens:', error);
                  }
                  
                  // Marcar como visto pela loja no servidor
                  try {
                    const token = localStorage.getItem('token');
                    await fetch(`${API_URL}/problems/${problem.id}/mark-viewed`, {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({ userType: 'store' })
                    });
                    // Recarregar problemas para atualizar o estado
                    fetchProblems();
                  } catch (error) {
                    console.error('Erro ao marcar como visto:', error);
                  }
                }}
                style={{
                  background: '#FFFFFF',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  // Piscar vermelho se inativo por 5+ dias, caso contrário piscar amarelo se não visto
                  animation: (() => {
                    const daysSinceUpdate = Math.floor((new Date() - new Date(problem.updated_at)) / (1000 * 60 * 60 * 24));
                    if (daysSinceUpdate >= 5 && problem.status !== 'resolved') {
                      return 'pulse-red 2s ease-in-out infinite';
                    } else if (!problem.viewed_by_store) {
                      return 'pulse-yellow 2s ease-in-out infinite';
                    }
                    return 'none';
                  })()
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', margin: '0 0 8px 0' }}>
                      {problem.problem_description}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                      <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                        {new Date(problem.created_at).toLocaleDateString('pt-PT')}
                      </p>
                      {problem.eurocode && (
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '700',
                          background: '#EEF2FF',
                          color: '#4F46E5',
                          border: '1px solid #C7D2FE'
                        }}>
                          {problem.eurocode}
                        </span>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(problem.status)}
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
                    <p style={{ fontSize: '14px', color: '#FFFFFF', margin: 0 }}>
                      {problem.response_text}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal de Detalhes do Report */}
        {showDetailModal && selectedProblem && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => {
            setShowDetailModal(false);
            setSelectedProblem(null);
          }}
          >
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', marginBottom: '20px' }}>
                Detalhes do Report
              </h2>

              <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '16px' 
          }}>
                {/* Tipo de Problema */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '4px' }}>
                    Tipo de Problema *
                  </label>
                  <p style={{ fontSize: '16px', color: '#1F2937', margin: 0 }}>
                    {selectedProblem.problem_description}
                  </p>
                </div>

                {/* Data da Encomenda */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '4px' }}>
                    Data da Encomenda *
                  </label>
                  <p style={{ fontSize: '16px', color: '#1F2937', margin: 0 }}>
                    {new Date(selectedProblem.order_date).toLocaleDateString('pt-PT')}
                  </p>
                </div>

                {/* Número do Pedido */}
                {selectedProblem.supplier_order && (
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '4px' }}>
                      Número do Pedido do Fornecedor *
                    </label>
                    <p style={{ fontSize: '16px', color: '#1F2937', margin: 0 }}>
                      {selectedProblem.supplier_order}
                    </p>
                  </div>
                )}

                {/* Eurocode */}
                {selectedProblem.eurocode && (
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '4px' }}>
                      Eurocode *
                    </label>
                    <p style={{ fontSize: '16px', color: '#1F2937', margin: 0 }}>
                      {selectedProblem.eurocode}
                    </p>
                  </div>
                )}

                {/* Status */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '4px' }}>
                    Status
                  </label>
                  {getStatusBadge(selectedProblem.status)}
                </div>

                {/* Histórico de Conversação */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '8px' }}>
                    Histórico de Conversação
                  </label>
                  <div style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    padding: '12px',
                    background: '#F9FAFB'
                  }}>
                    {messages.length === 0 ? (
                      <p style={{ fontSize: '14px', color: '#9CA3AF', textAlign: 'center', margin: 0 }}>
                        Nenhuma mensagem ainda
                      </p>
                    ) : (
                      messages.map((msg, index) => (
                        <div key={index} style={{
                          marginBottom: '12px',
                          padding: '10px',
                          background: msg.user_type === 'store' ? '#EEF2FF' : '#FEF3C7',
                          borderRadius: '8px',
                          borderLeft: `3px solid ${msg.user_type === 'store' ? '#6366F1' : '#F59E0B'}`
                        }}>
                          <p style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', margin: '0 0 4px 0' }}>
                            {msg.user_type === 'store' ? '🏪 Loja' : '📦 Fornecedor'} • {new Date(msg.created_at).toLocaleString('pt-PT')}
                          </p>
                          <p style={{ fontSize: '14px', color: '#1F2937', margin: 0 }}>
                            {msg.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Nova Mensagem */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '4px' }}>
                    Nova Mensagem
                  </label>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    placeholder="Escreva sua mensagem..."
                  />
                </div>
              </div>

              {/* Botões de Ação */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                <button
                  onClick={async () => {
                    console.log('[Store] Botão Enviar Mensagem clicado');
                    console.log('[Store] newMessage:', newMessage);
                    console.log('[Store] selectedProblem:', selectedProblem);
                    
                    if (!newMessage.trim()) {
                      alert('Por favor, escreva uma mensagem');
                      return;
                    }
                    
                    try {
                      const token = localStorage.getItem('token');
                      console.log('[Store] Enviando mensagem para problema ID:', selectedProblem.id);
                      const response = await fetch(`${API_URL}/problems/${selectedProblem.id}/messages`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                          message: newMessage
                        })
                      });
                      console.log('[Store] Response status:', response.status);

                      if (response.ok) {
                        // Recarregar mensagens
                        const messagesResponse = await fetch(`${API_URL}/problems/${selectedProblem.id}/messages`, {
                          headers: {
                            'Authorization': `Bearer ${token}`
                          }
                        });
                        if (messagesResponse.ok) {
                          const messagesData = await messagesResponse.json();
                          setMessages(messagesData);
                        }
                        setNewMessage('');
                        fetchProblems(); // Atualizar lista para refletir mudanças de visualização
                        setShowDetailModal(false); // Fechar modal
                        alert('Mensagem enviada com sucesso!');
                      } else {
                        const errorData = await response.json();
                        console.log('[Store] Erro do servidor:', errorData);
                        alert(`Erro ao enviar mensagem: ${errorData.message || 'Erro desconhecido'}`);
                      }
                    } catch (error) {
                      console.error('Erro:', error);
                      alert('Erro ao enviar mensagem');
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: '#6366F1',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Enviar Mensagem
                </button>

                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedProblem(null);
                    setNewMessage('');
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: '#E5E7EB',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Fechar
                </button>

                <button
                  onClick={async () => {
                    if (!confirm('Tem certeza que deseja marcar este report como resolvido?')) return;
                    
                    try {
                      const token = localStorage.getItem('token');
                      const response = await fetch(`${API_URL}/problems/${selectedProblem.id}/resolve`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        }
                      });

                      if (response.ok) {
                        alert('Report marcado como resolvido!');
                        fetchProblems();
                        setShowDetailModal(false);
                        setSelectedProblem(null);
                      } else {
                        alert('Erro ao resolver report');
                      }
                    } catch (error) {
                      console.error('Erro:', error);
                      alert('Erro ao resolver report');
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: '#10B981',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Resolvido
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
      {/* Modal de Exportação Excel */}
      {showExportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', marginBottom: '24px' }}>
              Exportar para Excel
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#000000', marginBottom: '8px' }}>
                Data Início (opcional)
              </label>
              <input
                type="date"
                value={exportStartDate}
                onChange={(e) => setExportStartDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '15px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#000000', marginBottom: '8px' }}>
                Data Fim (opcional)
              </label>
              <input
                type="date"
                value={exportEndDate}
                onChange={(e) => setExportEndDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '15px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowExportModal(false);
                  setExportStartDate('');
                  setExportEndDate('');
                }}
                style={{
                  padding: '12px 24px',
                  background: '#6B7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleExportToExcel}
                style={{
                  padding: '12px 24px',
                  background: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                📊 Exportar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// ============ VISTA FORNECEDOR - REDESENHADA COM GRID E PAINEL LATERAL ============

const SupplierDashboard = ({ onLogout }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeFilter, setActiveFilter] = useState({ type: null, value: null });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editedObservations, setEditedObservations] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    fetchProblems();
    
    // Auto-refresh a cada 20 segundos
    const refreshInterval = setInterval(() => {
      fetchProblems();
    }, 20000);
    
    // Detectar mudanças no tamanho da tela
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(refreshInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Filtro de pesquisa - incluir TODOS os problemas quando há termo de pesquisa
  useEffect(() => {
    if (searchTerm.trim()) {
      // Quando há pesquisa, mostrar TODOS os problemas (incluindo resolvidos)
      const filtered = problems.filter(p => 
        (p.eurocode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.problem_description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.supplier_order || '').toString().includes(searchTerm) ||
        (p.observations || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProblems(filtered);
    } else {
      // Sem pesquisa, limpar filtro (mostrará apenas não-resolvidos por padrão)
      setFilteredProblems([]);
    }
  }, [searchTerm, problems]);

  const fetchProblems = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('[Frontend Supplier] Buscando problemas com token:', token ? 'presente' : 'ausente');
      
      const response = await fetch(`${API_URL}/problems/supplier`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('[Frontend Supplier] Response status:', response.status);
      const data = await response.json();
      console.log('[Frontend Supplier] Dados recebidos:', data);
      
      // Garantir que data é sempre um array
      setProblems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar problemas:', error);
      setProblems([]); // Em caso de erro, usar array vazio
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (problemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/problems/${problemId}/resolve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Problema marcado como resolvido!');
        setSelectedProblem(null);
        fetchProblems();
      }
    } catch (error) {
      alert('Erro ao resolver problema');
    }
  };

  const handleResponse = async (problemId) => {
    if (!responseText.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
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
      // Quando há pesquisa, incluir TODOS os problemas (incluindo resolvidos)
      filtered = filtered.filter(p => 
        (p.eurocode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.problem_description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.product || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.store_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.supplier_order || '').toString().includes(searchTerm) ||
        (p.observations || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      // Não aplicar filtro de status quando há pesquisa - mostrar todos os resultados
    } else {
      // Sem pesquisa, aplicar filtros de status normalmente
      // Excluir resolvidos por padrão, exceto se filtro "resolved" está ativo
      if (filterStatus === 'resolved') {
        filtered = filtered.filter(p => p.status === 'resolved');
      } else {
        filtered = filtered.filter(p => p.status !== 'resolved');
        if (filterStatus !== 'all') {
          filtered = filtered.filter(p => p.status === filterStatus);
        }
      }
    }
    
    setFilteredProblems(filtered);
  }, [problems, searchTerm, filterStatus]);

  const getStatusBadge = (status) => {
    const colors = {
      pending: { bg: '#FEE2E2', text: '#991B1B', label: 'Pendente' },      // Vermelho suave
      in_progress: { bg: '#FEF3C7', text: '#92400E', label: 'Em Análise' }, // Amarelo suave
      resolved: { bg: '#D1FAE5', text: '#065F46', label: 'Resolvido' }     // Verde suave
    };
    const style = colors[status] || colors.pending;
    return (
      <span style={{
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '11px',
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

  // Contabilização por tipo de problema
  const problemTypeStats = {
    'Material não chegou': problems.filter(p => p.problem_description === 'Material não chegou').length,
    'Material danificado': problems.filter(p => p.problem_description === 'Material danificado').length,
    'Material errado': problems.filter(p => p.problem_description === 'Material errado').length,
    'Outro': problems.filter(p => p.problem_description === 'Outro').length
  };

  const selectedProblemData = problems.find(p => p.id === selectedProblem);

   return (
    <div style={{
      minHeight: '100vh',
      background: '#5A5A5A',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <DashboardHeader title="Painel Fornecedor" onLogout={onLogout} />

      {/* Título REPORT AXIAL e Botão Export */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1 }}></div>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          margin: 0,
          letterSpacing: '1px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          flex: 1,
          textAlign: 'center'
        }}>
          REPORT AXIAL
        </h1>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowExportModal(true)}
            style={{
              padding: '10px 20px',
              background: '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📊 Exportar Excel
          </button>
        </div>
      </div>

      <div style={{ 
        padding: '20px', 
        width: '100%', 
        boxSizing: 'border-box',
        flex: 1
      }}>
        
        {/* Layout Desktop: 2 linhas horizontais | Layout Mobile: 2 colunas verticais */}
        <div style={{
          display: isMobile ? 'grid' : 'flex',
          flexDirection: isMobile ? 'initial' : 'column',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'none',
          gap: isMobile ? '16px' : '24px',
          marginBottom: '24px',
          width: '100%'
        }}>
          
          {/* Coluna/Linha STATUS */}
          <div style={{ width: '100%' }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: '700', 
              color: '#FFFFFF', 
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              STATUS
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
              gap: isMobile ? '10px' : '16px',
              marginBottom: isMobile ? '0' : '16px'
            }}>
              <div 
                onClick={() => {
                  setActiveFilter({ type: 'status', value: 'all' });
                  setFilterStatus('all');
                }}
                style={{ 
                  background: '#EEF2FF', 
                  padding: isMobile ? '12px' : '16px', 
                  borderRadius: '10px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  border: activeFilter.type === 'status' && activeFilter.value === 'all' ? '3px solid #6366F1' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}>
                <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#6B7280', margin: '0 0 4px 0', fontWeight: '600' }}>TOTAL</p>
                <p style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 'bold', color: '#6366F1', margin: 0 }}>{stats.total}</p>
              </div>
              <div 
                onClick={() => {
                  setActiveFilter({ type: 'status', value: 'pending' });
                  setFilterStatus('pending');
                }}
                style={{ 
                  background: '#FEE2E2', 
                  padding: isMobile ? '12px' : '16px', 
                  borderRadius: '10px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  border: activeFilter.type === 'status' && activeFilter.value === 'pending' ? '3px solid #DC2626' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}>
                <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#6B7280', margin: '0 0 4px 0', fontWeight: '600' }}>PENDENTES</p>
                <p style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 'bold', color: '#DC2626', margin: 0 }}>{stats.pending}</p>
              </div>
              <div 
                onClick={() => {
                  setActiveFilter({ type: 'status', value: 'in_progress' });
                  setFilterStatus('in_progress');
                }}
                style={{ 
                  background: '#FEF3C7', 
                  padding: isMobile ? '12px' : '16px', 
                  borderRadius: '10px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  border: activeFilter.type === 'status' && activeFilter.value === 'in_progress' ? '3px solid #D97706' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}>
                <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#6B7280', margin: '0 0 4px 0', fontWeight: '600' }}>EM ANÁLISE</p>
                <p style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 'bold', color: '#D97706', margin: 0 }}>{stats.in_progress}</p>
              </div>
              <div 
                onClick={() => {
                  setActiveFilter({ type: 'status', value: 'resolved' });
                  setFilterStatus('resolved');
                }}
                style={{ 
                  background: '#D1FAE5', 
                  padding: isMobile ? '12px' : '16px', 
                  borderRadius: '10px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  border: activeFilter.type === 'status' && activeFilter.value === 'resolved' ? '3px solid #10B981' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}>
                <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#6B7280', margin: '0 0 4px 0', fontWeight: '600' }}>RESOLVIDOS</p>
                <p style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 'bold', color: '#10B981', margin: 0 }}>{stats.resolved}</p>
              </div>
            </div>
          </div>

          {/* Coluna/Linha MOTIVOS */}
          <div style={{ width: '100%' }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: '700', 
              color: '#FFFFFF', 
              marginBottom: '12px',
              textAlign: 'center'
            }}>
              MOTIVOS
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
              gap: isMobile ? '10px' : '16px'
            }}>
              <div 
                onClick={() => setActiveFilter({ type: 'problemType', value: 'Material não chegou' })}
                style={{ 
                  background: '#FFFFFF', 
                  padding: isMobile ? '12px' : '16px', 
                  borderRadius: '10px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  border: activeFilter.type === 'problemType' && activeFilter.value === 'Material não chegou' ? '3px solid #EF4444' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}>
                <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#6B7280', margin: '0 0 4px 0', fontWeight: '600' }}>MATERIAL NÃO CHEGOU</p>
                <p style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 'bold', color: '#EF4444', margin: 0 }}>{problemTypeStats['Material não chegou']}</p>
              </div>
              <div 
                onClick={() => setActiveFilter({ type: 'problemType', value: 'Material danificado' })}
                style={{ 
                  background: '#FFFFFF', 
                  padding: isMobile ? '12px' : '16px', 
                  borderRadius: '10px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  border: activeFilter.type === 'problemType' && activeFilter.value === 'Material danificado' ? '3px solid #F97316' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}>
                <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#6B7280', margin: '0 0 4px 0', fontWeight: '600' }}>MATERIAL DANIFICADO</p>
                <p style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 'bold', color: '#F97316', margin: 0 }}>{problemTypeStats['Material danificado']}</p>
              </div>
              <div 
                onClick={() => setActiveFilter({ type: 'problemType', value: 'Material errado' })}
                style={{ 
                  background: '#FFFFFF', 
                  padding: isMobile ? '12px' : '16px', 
                  borderRadius: '10px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  border: activeFilter.type === 'problemType' && activeFilter.value === 'Material errado' ? '3px solid #8B5CF6' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}>
                <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#6B7280', margin: '0 0 4px 0', fontWeight: '600' }}>MATERIAL ERRADO</p>
                <p style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 'bold', color: '#8B5CF6', margin: 0 }}>{problemTypeStats['Material errado']}</p>
              </div>
              <div 
                onClick={() => setActiveFilter({ type: 'problemType', value: 'Outro' })}
                style={{ 
                  background: '#FFFFFF', 
                  padding: isMobile ? '12px' : '16px', 
                  borderRadius: '10px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  border: activeFilter.type === 'problemType' && activeFilter.value === 'Outro' ? '3px solid #64748B' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}>
                <p style={{ fontSize: isMobile ? '10px' : '12px', color: '#6B7280', margin: '0 0 4px 0', fontWeight: '600' }}>OUTRO</p>
                <p style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 'bold', color: '#64748B', margin: 0 }}>{problemTypeStats['Outro']}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Caixa de Pesquisa */}
        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="🔍 Pesquisar por Eurocode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '12px 16px',
              background: '#1F2937',
              border: '2px solid #374151',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#FFFFFF',
              minWidth: '300px',
              width: '100%',
              maxWidth: '500px'
            }}
          />
        </div>

        {/* Grid de Cards */}
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {(filteredProblems.length > 0 ? filteredProblems : problems.filter(p => p.status !== 'resolved'))
              .map((problem) => (
              <div
                key={problem.id}
                onClick={async () => {
                  // Atualizar estado local imediatamente para parar de piscar
                  setProblems(prevProblems => 
                    prevProblems.map(p => 
                      p.id === problem.id ? { ...p, viewed_by_supplier: true } : p
                    )
                  );
                  
                  setSelectedProblem(problem);
                  setEditedObservations(problem.observations || '');
                  setShowDetailModal(true);
                  
                  // Carregar mensagens do histórico
                  try {
                    const token = localStorage.getItem('token');
                    const messagesResponse = await fetch(`${API_URL}/problems/${problem.id}/messages`, {
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    });
                    if (messagesResponse.ok) {
                      const messagesData = await messagesResponse.json();
                      setMessages(messagesData);
                    }
                  } catch (error) {
                    console.error('Erro ao carregar mensagens:', error);
                  }
                  
                  // Marcar como visto pelo fornecedor no servidor
                  try {
                    const token = localStorage.getItem('token');
                    await fetch(`${API_URL}/problems/${problem.id}/mark-viewed`, {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({ userType: 'supplier' })
                    });
                    // Recarregar problemas para atualizar o estado
                    fetchProblems();
                  } catch (error) {
                    console.error('Erro ao marcar como visto:', error);
                  }
                }}
                style={{
                  background: '#FFFFFF',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: selectedProblem === problem.id ? '0 4px 12px rgba(99, 102, 241, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: selectedProblem === problem.id ? '2px solid #6366F1' : '2px solid transparent',
                  minHeight: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  // Piscar vermelho se inativo por 5+ dias, caso contrário piscar amarelo se não visto
                  animation: (() => {
                    const daysSinceUpdate = Math.floor((new Date() - new Date(problem.updated_at)) / (1000 * 60 * 60 * 24));
                    if (daysSinceUpdate >= 5 && problem.status !== 'resolved') {
                      return 'pulse-red 2s ease-in-out infinite';
                    } else if (!problem.viewed_by_supplier) {
                      return 'pulse-yellow 2s ease-in-out infinite';
                    }
                    return 'none';
                  })()
                }}
                onMouseEnter={(e) => {
                  if (selectedProblem !== problem.id) {
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedProblem !== problem.id) {
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  margin: '0 0 8px 0',
                  lineHeight: '1.3'
                }}>
                  {problem.store_name}
                </h3>
                
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  margin: '0 0 16px 0',
                  flex: 1,
                  lineHeight: '1.5'
                }}>
                  {problem.problem_description}
                </p>
                
                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  {getStatusBadge(problem.status)}
                  {problem.eurocode && (
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '700',
                      background: '#EEF2FF',
                      color: '#4F46E5',
                      border: '1px solid #C7D2FE'
                    }}>
                      {problem.eurocode}
                    </span>
                  )}
                </div>
                
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>
                  {new Date(problem.created_at).toLocaleDateString('pt-PT')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Painel Lateral */}
      {selectedProblemData && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '500px',
          height: '100vh',
          background: '#FFFFFF',
          boxShadow: '-4px 0 12px rgba(0,0,0,0.15)',
          overflowY: 'auto',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>
          
          <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>
                Detalhes do Reporte
              </h2>
              <button
                onClick={() => setSelectedProblem(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  color: '#6B7280',
                  cursor: 'pointer',
                  padding: '4px 8px'
                }}
              >
                ✕
              </button>
            </div>

            {/* Loja */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#6366F1', margin: '0 0 8px 0' }}>
                {selectedProblemData.store_name}
              </h3>
              <p style={{ fontSize: '16px', color: '#FFFFFF', margin: 0 }}>
                {selectedProblemData.problem_description}
              </p>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              {getStatusBadge(selectedProblemData.status)}
            </div>

            {/* Informações */}
            <div style={{
              background: '#F9FAFB',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '600' }}>Data do Reporte:</span>
                <p style={{ fontSize: '14px', color: '#1F2937', margin: '4px 0 0 0' }}>
                  {new Date(selectedProblemData.created_at).toLocaleDateString('pt-PT')}
                </p>
              </div>
              
              {selectedProblemData.order_date && (
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '600' }}>Data da Encomenda:</span>
                  <p style={{ fontSize: '14px', color: '#1F2937', margin: '4px 0 0 0' }}>
                    {selectedProblemData.order_date}
                  </p>
                </div>
              )}
              
              {selectedProblemData.supplier_order && (
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '600' }}>Enc Fornecedor:</span>
                  <p style={{ fontSize: '14px', color: '#1F2937', margin: '4px 0 0 0' }}>
                    {selectedProblemData.supplier_order}
                  </p>
                </div>
              )}
              
              {selectedProblemData.eurocode && (
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '600' }}>Eurocódigo:</span>
                  <p style={{ fontSize: '14px', color: '#1F2937', margin: '4px 0 0 0' }}>
                    {selectedProblemData.eurocode}
                  </p>
                </div>
              )}
              
              {selectedProblemData.observations && (
                <div>
                  <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '600' }}>Observações:</span>
                  <p style={{ fontSize: '14px', color: '#1F2937', margin: '4px 0 0 0' }}>
                    {selectedProblemData.observations}
                  </p>
                </div>
              )}
            </div>

            {/* Resposta Existente */}
            {selectedProblemData.response_text && (
              <div style={{
                background: '#EEF2FF',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '24px',
                borderLeft: '4px solid #6366F1'
              }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#4F46E5', margin: '0 0 8px 0' }}>
                  Sua Resposta:
                </p>
                <p style={{ fontSize: '14px', color: '#1F2937', margin: 0 }}>
                  {selectedProblemData.response_text}
                </p>
              </div>
            )}

            {/* Campo de Resposta */}
            {selectedProblemData.status !== 'resolved' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#000000', marginBottom: '8px' }}>
                  {selectedProblemData.response_text ? 'Atualizar Resposta' : 'Responder'}
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows="4"
                  placeholder="Digite sua resposta..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>
            )}

            {/* Botões */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {selectedProblemData.status !== 'resolved' && (
                <>
                  <button
                    onClick={() => handleResponse(selectedProblemData.id)}
                    disabled={!responseText.trim()}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: responseText.trim() ? '#6366F1' : '#E5E7EB',
                      color: responseText.trim() ? 'white' : '#9CA3AF',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: responseText.trim() ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Enviar Resposta
                  </button>
                  <button
                    onClick={() => handleResolve(selectedProblemData.id)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#10B981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    ✓ Resolver
                  </button>
                </>
              )}
              {selectedProblemData.status === 'resolved' && (
                <div style={{
                  width: '100%',
                  padding: '16px',
                  background: '#D1FAE5',
                  color: '#065F46',
                  borderRadius: '8px',
                  textAlign: 'center',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  fontWeight: '600'
                }}>
                  ✓ Problema Resolvido
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {selectedProblem && (
        <div
          onClick={() => setSelectedProblem(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 999
          }}
        />
      )}

      {/* Modal de Detalhes do Report */}
      {showDetailModal && selectedProblem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={() => {
          setShowDetailModal(false);
          setSelectedProblem(null);
        }}
        >
          <div style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', marginBottom: '20px' }}>
              Detalhes do Report
            </h2>

            <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '16px' 
          }}>
              {/* Tipo de Problema */}
              <div>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '4px' }}>
                  Tipo de Problema *
                </label>
                <p style={{ fontSize: '16px', color: '#1F2937', margin: 0 }}>
                  {selectedProblem.problem_description}
                </p>
              </div>

              {/* Data da Encomenda */}
              <div>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '4px' }}>
                  Data da Encomenda *
                </label>
                <p style={{ fontSize: '16px', color: '#1F2937', margin: 0 }}>
                  {new Date(selectedProblem.order_date).toLocaleDateString('pt-PT')}
                </p>
              </div>

              {/* Número do Pedido */}
              {selectedProblem.supplier_order && (
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '4px' }}>
                    Número do Pedido do Fornecedor *
                  </label>
                  <p style={{ fontSize: '16px', color: '#1F2937', margin: 0 }}>
                    {selectedProblem.supplier_order}
                  </p>
                </div>
              )}

              {/* Eurocode */}
              {selectedProblem.eurocode && (
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '4px' }}>
                    Eurocode *
                  </label>
                  <p style={{ fontSize: '16px', color: '#1F2937', margin: 0 }}>
                    {selectedProblem.eurocode}
                  </p>
                </div>
              )}

              {/* Status */}
              <div>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '4px' }}>
                  Status
                </label>
                {getStatusBadge(selectedProblem.status)}
              </div>

              {/* Observações (Somente Leitura) */}
              {selectedProblem.observations && (
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '4px' }}>
                    Observações
                  </label>
                  <p style={{ fontSize: '16px', color: '#1F2937', margin: 0, padding: '12px', background: '#F9FAFB', borderRadius: '8px' }}>
                    {selectedProblem.observations}
                  </p>
                </div>
              )}

              {/* Histórico de Conversação */}
              <div>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '8px' }}>
                  Histórico de Conversação
                </label>
                <div style={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  padding: '12px',
                  background: '#F9FAFB'
                }}>
                  {messages.length === 0 ? (
                    <p style={{ fontSize: '14px', color: '#9CA3AF', textAlign: 'center', margin: 0 }}>
                      Nenhuma mensagem ainda
                    </p>
                  ) : (
                    messages.map((msg, index) => (
                      <div key={index} style={{
                        marginBottom: '12px',
                        padding: '10px',
                        background: msg.user_type === 'store' ? '#EEF2FF' : '#FEF3C7',
                        borderRadius: '8px',
                        borderLeft: `3px solid ${msg.user_type === 'store' ? '#6366F1' : '#F59E0B'}`
                      }}>
                        <p style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', margin: '0 0 4px 0' }}>
                          {msg.user_type === 'store' ? '🏪 Loja' : '📦 Fornecedor'} • {new Date(msg.created_at).toLocaleString('pt-PT')}
                        </p>
                        <p style={{ fontSize: '14px', color: '#1F2937', margin: 0 }}>
                          {msg.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Nova Mensagem */}
              <div>
                <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '4px' }}>
                  Nova Mensagem
                </label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '12px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                  placeholder="Escreva sua mensagem..."
                />
              </div>
            </div>

            {/* Botões de Ação */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
              <button
                onClick={async () => {
                  if (!newMessage.trim()) {
                    alert('Por favor, escreva uma mensagem');
                    return;
                  }
                  
                  try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${API_URL}/problems/${selectedProblem.id}/messages`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        message: newMessage
                      })
                    });

                    if (response.ok) {
                      // Recarregar mensagens
                      const messagesResponse = await fetch(`${API_URL}/problems/${selectedProblem.id}/messages`, {
                        headers: {
                          'Authorization': `Bearer ${token}`
                        }
                      });
                      if (messagesResponse.ok) {
                        const messagesData = await messagesResponse.json();
                        setMessages(messagesData);
                      }
                      setNewMessage('');
                      fetchProblems(); // Atualizar lista para refletir mudanças de visualização
                      setShowDetailModal(false); // Fechar modal
                      alert('Mensagem enviada com sucesso!');
                    } else {
                      alert('Erro ao enviar mensagem');
                    }
                  } catch (error) {
                    console.error('Erro:', error);
                    alert('Erro ao enviar mensagem');
                  }
                }}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: '#6366F1',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Enviar Mensagem
              </button>

              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedProblem(null);
                  setNewMessage('');
                }}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: '#E5E7EB',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Fechar
              </button>

              <button
                onClick={async () => {
                  if (!confirm('Tem certeza que deseja marcar este report como resolvido?')) return;
                  
                  try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${API_URL}/problems/${selectedProblem.id}/resolve`, {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      }
                    });

                    if (response.ok) {
                      alert('Report marcado como resolvido!');
                      fetchProblems();
                      setShowDetailModal(false);
                      setSelectedProblem(null);
                      setNewMessage('');
                    } else {
                      alert('Erro ao resolver report');
                    }
                  } catch (error) {
                    console.error('Erro:', error);
                    alert('Erro ao resolver report');
                  }
                }}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: '#10B981',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Resolvido
              </button>
            </div>
          </div>
        </div>
      )}
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
      background: '#5A5A5A',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <DashboardHeader title="Painel Admin" onLogout={onLogout} />

      {/* Título REPORT AXIAL e Botão Export */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1 }}></div>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          margin: 0,
          letterSpacing: '1px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          flex: 1,
          textAlign: 'center'
        }}>
          REPORT AXIAL
        </h1>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setShowExportModal(true)}
            style={{
              padding: '10px 20px',
              background: '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📊 Exportar Excel
          </button>
        </div>
      </div>

      <div style={{ 
        padding: '20px', 
        width: '100%', 
        boxSizing: 'border-box',
        flex: 1
      }}>
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
                fontSize: '14px', flex: '1', minWidth: '200px'
              }}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '10px 16px', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px' }}
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="in_progress">Em Análise</option>
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
                padding: '12px 24px', background: '#10B981', color: 'white', border: 'none',
                borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600'
              }}
            >
              📄 Exportar PDF
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '12px 24px', background: '#6366F1', color: 'white', border: 'none',
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#000000', marginBottom: '6px' }}>
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
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#000000', marginBottom: '6px' }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#000000', marginBottom: '6px' }}>
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
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#000000', marginBottom: '6px' }}>
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

        {/* Modal de Detalhes do Report */}
        {showDetailModal && selectedProblem && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => {
            setShowDetailModal(false);
            setSelectedProblem(null);
          }}
          >
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937', marginBottom: '20px' }}>
                Detalhes do Report
              </h2>

              <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '16px' 
          }}>
                {/* Tipo de Problema */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '4px' }}>
                    Tipo de Problema *
                  </label>
                  <p style={{ fontSize: '16px', color: '#1F2937', margin: 0 }}>
                    {selectedProblem.problem_description}
                  </p>
                </div>

                {/* Data da Encomenda */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '4px' }}>
                    Data da Encomenda *
                  </label>
                  <p style={{ fontSize: '16px', color: '#1F2937', margin: 0 }}>
                    {new Date(selectedProblem.order_date).toLocaleDateString('pt-PT')}
                  </p>
                </div>

                {/* Número do Pedido */}
                {selectedProblem.supplier_order && (
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '4px' }}>
                      Número do Pedido do Fornecedor *
                    </label>
                    <p style={{ fontSize: '16px', color: '#1F2937', margin: 0 }}>
                      {selectedProblem.supplier_order}
                    </p>
                  </div>
                )}

                {/* Eurocode */}
                {selectedProblem.eurocode && (
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '4px' }}>
                      Eurocode *
                    </label>
                    <p style={{ fontSize: '16px', color: '#1F2937', margin: 0 }}>
                      {selectedProblem.eurocode}
                    </p>
                  </div>
                )}

                {/* Status */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '4px' }}>
                    Status
                  </label>
                  {getStatusBadge(selectedProblem.status)}
                </div>

                {/* Histórico de Conversação */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '8px' }}>
                    Histórico de Conversação
                  </label>
                  <div style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    padding: '12px',
                    background: '#F9FAFB'
                  }}>
                    {messages.length === 0 ? (
                      <p style={{ fontSize: '14px', color: '#9CA3AF', textAlign: 'center', margin: 0 }}>
                        Nenhuma mensagem ainda
                      </p>
                    ) : (
                      messages.map((msg, index) => (
                        <div key={index} style={{
                          marginBottom: '12px',
                          padding: '10px',
                          background: msg.user_type === 'store' ? '#EEF2FF' : '#FEF3C7',
                          borderRadius: '8px',
                          borderLeft: `3px solid ${msg.user_type === 'store' ? '#6366F1' : '#F59E0B'}`
                        }}>
                          <p style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', margin: '0 0 4px 0' }}>
                            {msg.user_type === 'store' ? '🏪 Loja' : '📦 Fornecedor'} • {new Date(msg.created_at).toLocaleString('pt-PT')}
                          </p>
                          <p style={{ fontSize: '14px', color: '#1F2937', margin: 0 }}>
                            {msg.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Nova Mensagem */}
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000', display: 'block', marginBottom: '4px' }}>
                    Nova Mensagem
                  </label>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '80px',
                      padding: '12px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    placeholder="Escreva sua mensagem..."
                  />
                </div>
              </div>

              {/* Botões de Ação */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                <button
                  onClick={async () => {
                    console.log('[Store] Botão Enviar Mensagem clicado');
                    console.log('[Store] newMessage:', newMessage);
                    console.log('[Store] selectedProblem:', selectedProblem);
                    
                    if (!newMessage.trim()) {
                      alert('Por favor, escreva uma mensagem');
                      return;
                    }
                    
                    try {
                      const token = localStorage.getItem('token');
                      console.log('[Store] Enviando mensagem para problema ID:', selectedProblem.id);
                      const response = await fetch(`${API_URL}/problems/${selectedProblem.id}/messages`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                          message: newMessage
                        })
                      });
                      console.log('[Store] Response status:', response.status);

                      if (response.ok) {
                        // Recarregar mensagens
                        const messagesResponse = await fetch(`${API_URL}/problems/${selectedProblem.id}/messages`, {
                          headers: {
                            'Authorization': `Bearer ${token}`
                          }
                        });
                        if (messagesResponse.ok) {
                          const messagesData = await messagesResponse.json();
                          setMessages(messagesData);
                        }
                        setNewMessage('');
                        fetchProblems(); // Atualizar lista para refletir mudanças de visualização
                        setShowDetailModal(false); // Fechar modal
                        alert('Mensagem enviada com sucesso!');
                      } else {
                        const errorData = await response.json();
                        console.log('[Store] Erro do servidor:', errorData);
                        alert(`Erro ao enviar mensagem: ${errorData.message || 'Erro desconhecido'}`);
                      }
                    } catch (error) {
                      console.error('Erro:', error);
                      alert('Erro ao enviar mensagem');
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: '#6366F1',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Enviar Mensagem
                </button>

                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedProblem(null);
                    setNewMessage('');
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: '#E5E7EB',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Fechar
                </button>

                <button
                  onClick={async () => {
                    if (!confirm('Tem certeza que deseja marcar este report como resolvido?')) return;
                    
                    try {
                      const token = localStorage.getItem('token');
                      const response = await fetch(`${API_URL}/problems/${selectedProblem.id}/resolve`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        }
                      });

                      if (response.ok) {
                        alert('Report marcado como resolvido!');
                        fetchProblems();
                        setShowDetailModal(false);
                        setSelectedProblem(null);
                      } else {
                        alert('Erro ao resolver report');
                      }
                    } catch (error) {
                      console.error('Erro:', error);
                      alert('Erro ao resolver report');
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: '#10B981',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Resolvido
                </button>
              </div>
            </div>
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
    <>
      <style>{`
        @keyframes pulse-yellow {
          0%, 100% {
            background-color: #FFFFFF;
          }
          50% {
            background-color: #FEF3C7;
          }
        }
        @keyframes pulse-red {
          0%, 100% {
            background-color: #FFFFFF;
          }
          50% {
            background-color: #FEE2E2;
          }
        }
      `}</style>
      <Router>
        <Routes>
          <Route path="/" element={
            userType === 'admin' ? <AdminDashboard onLogout={handleLogout} /> :
            userType === 'supplier' ? <SupplierDashboard onLogout={handleLogout} /> :
            <StoreDashboard onLogout={handleLogout} />
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
