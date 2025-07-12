import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Check, X, Edit3, Save, Wifi, WifiOff, User, LogOut, Download, RefreshCw } from 'lucide-react';

const App = () => {
  // Estados de PWA
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // Estados de autenticação (simulado)
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados da aplicação
  const [currentScreen, setCurrentScreen] = useState('home');
  const [carrinho, setCarrinho] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [finalizados, setFinalizados] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCliente, setEditingCliente] = useState(null);
  const [editingTema, setEditingTema] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  // Estados para edição de produtos
  const [editingProductName, setEditingProductName] = useState(null);
  const [editingProductPrice, setEditingProductPrice] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ nome: '', preco: '', categoria: 'DIVERSOS' });

  // Estados do formulário
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [showClienteInput, setShowClienteInput] = useState(false);
  const [dataEntrega, setDataEntrega] = useState('');
  const [valorSinal, setValorSinal] = useState('');
  const [temaFesta, setTemaFesta] = useState('');
  const [showDataEntrega, setShowDataEntrega] = useState(false);

  // Estados para sincronização
  const [pendingSync, setPendingSync] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Estados para filtros de período
  const [mesVendas, setMesVendas] = useState(new Date().toISOString().slice(0, 7));
  const [mesEntregas, setMesEntregas] = useState(new Date().toISOString().slice(0, 7));
  const [mesPedidos, setMesPedidos] = useState(new Date().toISOString().slice(0, 7));
  const [mesOrcamentos, setMesOrcamentos] = useState(new Date().toISOString().slice(0, 7));

  // Estados para dados de exemplo
  const [dadosInicializados, setDadosInicializados] = useState(false);

  // Produtos
  const produtosIniciais = [
    { id: 1, categoria: 'DIVERSOS', nome: 'Pirulito de chocolate', preco: 1.70 },
    { id: 2, categoria: 'DIVERSOS', nome: 'Pirulito de marshmallow', preco: 1.70 },
    { id: 3, categoria: 'DIVERSOS', nome: 'Maçã do amor', preco: 2.50 },
    { id: 4, categoria: 'DIVERSOS', nome: 'Mini trufas', preco: 1.50 },
    { id: 5, categoria: 'DIVERSOS', nome: 'Mini donuts', preco: 1.50 },
    { id: 6, categoria: 'DIVERSOS', nome: 'Cone Trufado', preco: 3.50 },
    { id: 7, categoria: 'PIPOCA COLORIDA', nome: 'Pipoca colorida - Copo 200ml', preco: 1.50 },
    { id: 8, categoria: 'PIPOCA COLORIDA', nome: 'Pipoca colorida - Potinho', preco: 1.70 },
    { id: 9, categoria: 'PIPOCA COLORIDA', nome: 'Pipoca colorida - Saquinho', preco: 1.70 },
    { id: 10, categoria: 'PIPOCA COLORIDA', nome: 'Pipoca colorida - Copo 300ml', preco: 2.00 },
    { id: 11, categoria: 'PIPOCA COLORIDA', nome: 'Pipoca colorida - Casquinha', preco: 3.00 },
    { id: 12, categoria: 'ALGODÃO DOCE', nome: 'Algodão doce - Copo 200ml', preco: 1.50 },
    { id: 13, categoria: 'ALGODÃO DOCE', nome: 'Algodão doce - Potinho', preco: 1.70 },
    { id: 14, categoria: 'ALGODÃO DOCE', nome: 'Algodão doce - Copo 300ml', preco: 2.00 },
    { id: 15, categoria: 'ALGODÃO DOCE', nome: 'Algodão doce - Palito', preco: 4.00 },
    { id: 16, categoria: 'ALGODÃO DOCE', nome: 'Algodão doce - Casquinha', preco: 3.50 },
    { id: 17, categoria: 'CJ ALGODÃO DOCE', nome: 'Algodão doce no pote + Maçã do amor', preco: 3.70 },
    { id: 18, categoria: 'CJ ALGODÃO DOCE', nome: 'Copo bolha - Algodão doce + Pipoca colorida', preco: 3.00 },
    { id: 19, categoria: 'CJ ALGODÃO DOCE', nome: 'Copo bolha - Algodão doce + Marshmallow', preco: 3.50 },
    { id: 20, categoria: 'CJ ALGODÃO DOCE', nome: 'Copo bolha - Algodão doce + Bis', preco: 4.00 },
    { id: 21, categoria: 'CJ ALGODÃO DOCE', nome: 'Copo bolha - Algodão doce + Jujuba', preco: 4.00 },
    { id: 22, categoria: 'BOLO NA MARMITINHA', nome: 'Bolo na Marmitinha - 1 sabor de recheio', preco: 4.00 },
    { id: 23, categoria: 'BOLO NA MARMITINHA', nome: 'Bolo na Marmitinha - 2 sabores de recheio', preco: 5.00 },
    { id: 24, categoria: 'BALAS PERSONALIZADAS', nome: '100 Balas personalizadas', preco: 40.00 },
    { id: 25, categoria: 'BALAS PERSONALIZADAS', nome: '100 Balas personalizadas + 1 balde personalizado', preco: 45.00 },
    { id: 26, categoria: 'DOCES PERSONALIZADOS', nome: 'Bolo no palito', preco: 9.00 },
    { id: 27, categoria: 'DOCES PERSONALIZADOS', nome: 'Choco Maçã', preco: 7.00 },
    { id: 28, categoria: 'DOCES PERSONALIZADOS', nome: 'Cupcake', preco: 6.00 },
    { id: 29, categoria: 'DOCES PERSONALIZADOS', nome: 'Pirulito decorado c/pasta americana', preco: 5.00 },
    { id: 30, categoria: 'DOCES PERSONALIZADOS', nome: 'Trufas decoradas c/pasta americana', preco: 3.00 },
    { id: 31, categoria: 'DOCES PERSONALIZADOS', nome: 'Porta retrato de chocolate - unidade', preco: 6.00 }
  ];

  const [produtos, setProdutos] = useState(produtosIniciais);

  // Inicializar dados de exemplo apenas uma vez
  useEffect(() => {
    if (!dadosInicializados) {
      const agora = new Date();
      
      const exemploFinalizado = {
        id: 'exemplo-finalizado-1',
        cliente: 'Maria Silva (Exemplo)',
        total: 85.50,
        dataFinalizacao: new Date(agora.getFullYear(), agora.getMonth(), 15).toISOString(),
        dataEntrega: new Date(agora.getFullYear(), agora.getMonth(), 14).toISOString(),
        temaFesta: 'Princesas',
        itens: [
          { produto: { nome: 'Pirulito de chocolate' }, quantidade: 20, total: 34.00 },
          { produto: { nome: 'Mini trufas' }, quantidade: 15, total: 22.50 },
          { produto: { nome: 'Algodão doce - Palito' }, quantidade: 7, total: 28.00 }
        ]
      };
      
      const exemploPedido = {
        id: 'exemplo-pedido-1',
        cliente: 'João Santos (Exemplo)',
        total: 120.00,
        dataEntrega: new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + 5).toISOString(),
        data: new Date(agora.getFullYear(), agora.getMonth(), 10).toISOString(),
        sinal: 40.00,
        restante: 80.00,
        temaFesta: 'Super-Heróis',
        itens: [
          { produto: { nome: 'Cupcake' }, quantidade: 20, total: 120.00 }
        ]
      };
      
      const exemploOrcamento = {
        id: 'exemplo-orcamento-1',
        cliente: 'Ana Costa (Exemplo)',
        total: 67.20,
        data: new Date(agora.getFullYear(), agora.getMonth(), 18).toISOString(),
        itens: [
          { produto: { nome: 'Pipoca colorida - Copo 200ml' }, quantidade: 30, total: 45.00 },
          { produto: { nome: 'Maçã do amor' }, quantidade: 8, total: 20.00 }
        ]
      };
      
      setFinalizados([exemploFinalizado]);
      setPedidos([exemploPedido]);
      setOrcamentos([exemploOrcamento]);
      setDadosInicializados(true);
    }
  }, [dadosInicializados]);

  // Funções auxiliares
  const formatCurrency = (value) => {
    try {
      const num = typeof value === 'number' ? value : parseFloat(value) || 0;
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(num);
    } catch (error) {
      return 'R$ 0,00';
    }
  };

  const formatDate = (date) => {
    try {
      if (!date) return 'Data não informada';
      const d = new Date(date);
      if (isNaN(d.getTime())) return 'Data inválida';
      return d.toLocaleDateString('pt-BR');
    } catch (error) {
      return 'Data inválida';
    }
  };

  // Função para filtrar por mês
  const filtrarPorMes = (items, mes, campoData = 'dataFinalizacao') => {
    if (!items || !Array.isArray(items) || !mes) return [];
    
    return items.filter(item => {
      try {
        if (!item) return false;
        
        const dataItem = item[campoData] || item.data || item.createdAt;
        if (!dataItem) return false;
        
        const data = new Date(dataItem);
        if (isNaN(data.getTime())) return false;
        
        const mesItem = data.toISOString().slice(0, 7);
        return mesItem === mes;
      } catch (error) {
        return false;
      }
    });
  };

  // Função para calcular crescimento
  const calcularCrescimento = (atual, anterior) => {
    try {
      const a = parseFloat(atual) || 0;
      const b = parseFloat(anterior) || 0;
      if (b === 0) return a > 0 ? 100 : 0;
      return ((a - b) / b * 100);
    } catch (error) {
      return 0;
    }
  };

  // Funções de autenticação simuladas
  const handleAuth = async (email, password) => {
    setAuthLoading(true);
    setTimeout(() => {
      setUser({ email, uid: 'demo-user-123' });
      setShowAuth(false);
      setAuthLoading(false);
      setSyncMessage('✅ Login realizado com sucesso!');
      setTimeout(() => setSyncMessage(''), 3000);
    }, 1000);
  };

  const handleSignOut = () => {
    setUser(null);
    setCurrentScreen('home');
    setSyncMessage('Logout realizado com sucesso!');
    setTimeout(() => setSyncMessage(''), 3000);
  };

  // Funções do carrinho
  const addToCarrinho = () => {
    if (!selectedProduct || !quantidade || quantidade <= 0) return;

    const produto = produtos.find(p => p.id === parseInt(selectedProduct));
    const existingItem = carrinho.find(item => item.produto.id === produto.id);

    if (existingItem) {
      setCarrinho(carrinho.map(item =>
        item.produto.id === produto.id
          ? { ...item, quantidade: item.quantidade + parseInt(quantidade), total: (item.quantidade + parseInt(quantidade)) * produto.preco }
          : item
      ));
    } else {
      setCarrinho([...carrinho, {
        produto,
        quantidade: parseInt(quantidade),
        total: parseInt(quantidade) * produto.preco
      }]);
    }

    setSelectedProduct('');
    setQuantidade('');
  };

  const clearCarrinho = () => {
    setCarrinho([]);
    setSelectedProduct('');
    setQuantidade('');
  };

  // Salvar orçamento
  const saveOrcamento = () => {
    if (carrinho.length === 0) return;
    
    if (!user) {
      alert('⚠️ Faça login para salvar orçamentos!');
      setShowAuth(true);
      return;
    }
    
    const agora = new Date();
    const novoOrcamento = {
      id: Date.now().toString(),
      cliente: nomeCliente.trim() || '',
      data: agora.toISOString(),
      itens: carrinho.map(item => ({
        produto: {
          id: item.produto.id,
          nome: item.produto.nome,
          preco: item.produto.preco,
          categoria: item.produto.categoria
        },
        quantidade: item.quantidade,
        total: item.total
      })),
      total: carrinho.reduce((sum, item) => sum + item.total, 0),
      userId: user.uid,
      createdAt: agora
    };
    
    setOrcamentos([novoOrcamento, ...orcamentos]);
    clearCarrinho();
    setNomeCliente('');
    setShowClienteInput(false);
    setCurrentScreen('home');
    setSyncMessage('✅ Orçamento salvo com sucesso!');
    setTimeout(() => setSyncMessage(''), 3000);
  };

  // Editar cliente
  const saveClienteEdit = (orcamentoId, novoNome) => {
    setOrcamentos(orcamentos.map(o => 
      o.id === orcamentoId 
        ? { ...o, cliente: novoNome.trim() }
        : o
    ));
    setEditingCliente(null);
  };

  const savePedidoClienteEdit = (pedidoId, novoNome) => {
    setPedidos(pedidos.map(p => 
      p.id === pedidoId 
        ? { ...p, cliente: novoNome.trim() }
        : p
    ));
    setEditingCliente(null);
  };

  const savePedidoTemaEdit = (pedidoId, novoTema) => {
    setPedidos(pedidos.map(p => 
      p.id === pedidoId 
        ? { ...p, temaFesta: novoTema.trim() }
        : p
    ));
    setEditingTema(null);
  };

  // Confirmar orçamento
  const confirmarOrcamento = (orcamento) => {
    if (!dataEntrega || !valorSinal) return;
    
    const sinalNumerico = parseFloat(valorSinal.replace(',', '.')) || 0;
    const novoPedido = {
      ...orcamento,
      id: Date.now().toString(),
      dataEntrega: new Date(dataEntrega).toISOString(),
      sinal: sinalNumerico,
      restante: orcamento.total - sinalNumerico,
      temaFesta: temaFesta.trim() || '',
      userId: user?.uid || 'demo',
      createdAt: new Date()
    };
    
    setPedidos([...pedidos, novoPedido]);
    setOrcamentos(orcamentos.filter(o => o.id !== orcamento.id));
    setDataEntrega('');
    setValorSinal('');
    setTemaFesta('');
    setShowDataEntrega(false);
    setSyncMessage('✅ Pedido confirmado com sucesso!');
    setTimeout(() => setSyncMessage(''), 3000);
  };

  // Finalizar pedido
  const finalizarPedido = (pedido) => {
    const pedidoFinalizado = {
      ...pedido,
      id: Date.now().toString(),
      dataFinalizacao: new Date().toISOString(),
      userId: user?.uid || 'demo'
    };
    
    setFinalizados([pedidoFinalizado, ...finalizados]);
    setPedidos(pedidos.filter(p => p.id !== pedido.id));
    setSyncMessage('✅ Pedido finalizado com sucesso!');
    setTimeout(() => setSyncMessage(''), 3000);
  };

  // Cancelar orçamento
  const cancelarOrcamento = (orcamentoId) => {
    if (window.confirm('Tem certeza que deseja cancelar este orçamento?')) {
      setOrcamentos(orcamentos.filter(o => o.id !== orcamentoId));
      setSyncMessage('Orçamento cancelado');
      setTimeout(() => setSyncMessage(''), 3000);
    }
  };

  const cancelarPedido = (pedidoId) => {
    if (window.confirm('Tem certeza que deseja cancelar este pedido?')) {
      setPedidos(pedidos.filter(p => p.id !== pedidoId));
      setSyncMessage('Pedido cancelado');
      setTimeout(() => setSyncMessage(''), 3000);
    }
  };

  // Funções de edição de produtos
  const saveProductNameEdit = (produtoId, novoNome) => {
    if (novoNome.trim()) {
      setProdutos(produtos.map(p => 
        p.id === produtoId 
          ? { ...p, nome: novoNome.trim() }
          : p
      ));
    }
    setEditingProductName(null);
  };

  const saveProductPriceEdit = (produtoId, novoPreco) => {
    const precoNumerico = parseFloat(novoPreco.replace(',', '.'));
    if (precoNumerico && precoNumerico > 0) {
      setProdutos(produtos.map(p => 
        p.id === produtoId 
          ? { ...p, preco: precoNumerico }
          : p
      ));
    }
    setEditingProductPrice(null);
  };

  // Adicionar produto
  const addNewProduct = () => {
    if (newProduct.nome.trim() && newProduct.preco && parseFloat(newProduct.preco) > 0) {
      const categoria = newProduct.categoria === 'NOVA_CATEGORIA' ? 
        (newProduct.novaCategoria || 'DIVERSOS').toUpperCase() : 
        newProduct.categoria;
      const novoProduto = {
        id: Math.max(...produtos.map(p => p.id)) + 1,
        nome: newProduct.nome.trim(),
        preco: parseFloat(newProduct.preco.replace(',', '.')),
        categoria: categoria
      };
      setProdutos([...produtos, novoProduto]);
      setNewProduct({ nome: '', preco: '', categoria: 'DIVERSOS' });
      setShowAddProduct(false);
      setSyncMessage('✅ Produto adicionado com sucesso!');
      setTimeout(() => setSyncMessage(''), 3000);
    }
  };

  const deleteProduct = (produtoId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      setProdutos(produtos.filter(p => p.id !== produtoId));
      setSyncMessage('Produto excluído');
      setTimeout(() => setSyncMessage(''), 3000);
    }
  };

  const resetProducts = () => {
    if (window.confirm('Tem certeza que deseja restaurar o catálogo original? Todas as alterações serão perdidas.')) {
      setProdutos(produtosIniciais);
      setSyncMessage('Catálogo restaurado');
      setTimeout(() => setSyncMessage(''), 3000);
    }
  };

  const sincronizarManualmente = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSyncMessage('✅ Sincronização concluída!');
      setTimeout(() => setSyncMessage(''), 3000);
    }, 1500);
  };

  // Modal de Autenticação
  if (showAuth) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-pink-800 mb-6 text-center">
            {authMode === 'login' ? 'Entrar' : 'Criar Conta'}
          </h2>
          
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="auth-email"
                required
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="seu@email.com"
                defaultValue="demo@donana.com"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <input
                type="password"
                id="auth-password"
                required
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="••••••••"
                defaultValue="123456"
              />
            </div>
            
            <button
              onClick={() => {
                const email = document.getElementById('auth-email').value;
                const password = document.getElementById('auth-password').value;
                if (email && password) {
                  handleAuth(email, password);
                }
              }}
              disabled={authLoading}
              className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-md mb-4"
            >
              {authLoading ? 'Carregando...' : (authMode === 'login' ? 'Entrar' : 'Criar Conta')}
            </button>
          </div>
          
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            className="w-full text-pink-600 hover:text-pink-800 font-medium"
          >
            {authMode === 'login' ? 'Não tem conta? Criar uma' : 'Já tem conta? Entrar'}
          </button>
          
          <button
            onClick={() => setShowAuth(false)}
            className="w-full mt-2 text-gray-500 hover:text-gray-700"
          >
            Usar sem login
          </button>
        </div>
      </div>
    );
  }

  // Tela Inicial
  if (currentScreen === 'home') {
    return (
      <div className="min-h-screen bg-pink-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-pink-800">APP DONANA</h1>
            {user ? (
              <div className="flex items-center gap-2">
                <User size={20} className="text-pink-600" />
                <span className="text-sm text-pink-600">{user.email.split('@')[0]}</span>
                <button
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="bg-pink-500 text-white px-4 py-2 rounded-md text-sm"
              >
                Login
              </button>
            )}
          </div>

          {/* Contador de dados */}
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-3 py-2 rounded mb-6 text-center text-sm">
            📊 {Array.isArray(orcamentos) ? orcamentos.length : 0} orçamentos • {Array.isArray(pedidos) ? pedidos.length : 0} pedidos • {Array.isArray(finalizados) ? finalizados.length : 0} finalizados
            {user ? (
              <div className="mt-2">
                <div className="mt-2 flex justify-center">
                  <button 
                    onClick={sincronizarManualmente}
                    disabled={loading}
                    className="text-xs bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-3 py-1 rounded flex items-center gap-1"
                  >
                    {loading ? '⏳' : '🔄'} Sincronizar Manualmente
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                🔒 <strong>Faça login</strong> para acessar dados compartilhados da equipe
              </div>
            )}
          </div>

          {/* Mensagem de sincronização */}
          {syncMessage && (
            <div className="bg-green-200 border border-green-400 text-green-800 px-3 py-2 rounded mb-2 text-center text-sm">
              {syncMessage}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {[
              { name: 'ORÇAMENTO', screen: 'orcamento' },
              { name: 'PENDENTES', screen: 'pendentes', badge: Array.isArray(orcamentos) ? orcamentos.length : 0 },
              { name: 'PEDIDOS', screen: 'pedidos', badge: Array.isArray(pedidos) ? pedidos.length : 0 },
              { name: 'FINALIZADOS', screen: 'finalizados', badge: Array.isArray(finalizados) ? finalizados.length : 0 },
              { name: 'RELATÓRIOS', screen: 'relatorios' },
              { name: 'PRODUTOS', screen: 'produtos' }
            ].map((button) => (
              <button
                key={button.screen}
                onClick={() => setCurrentScreen(button.screen)}
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-6 px-4 rounded-lg shadow-lg transition-colors text-lg relative"
              >
                {button.name}
                {button.badge > 0 && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {button.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Tela Orçamento
  if (currentScreen === 'orcamento') {
    return (
      <div className="min-h-screen bg-pink-50 p-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">Novo Orçamento</h2>
          
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Produto</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Selecione um produto</option>
                {produtos.map(produto => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome} - {formatCurrency(produto.preco)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
              <input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="1"
              />
            </div>

            <button
              onClick={addToCarrinho}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
            >
              Adicionar
            </button>
          </div>

          {carrinho.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="font-bold text-lg mb-4">Carrinho</h3>
              {carrinho.map((item, index) => (
                <div key={index} className="border-b pb-2 mb-2">
                  <div className="text-sm font-medium">{item.produto.nome}</div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatCurrency(item.produto.preco)} x {item.quantidade}</span>
                    <span className="font-bold">{formatCurrency(item.total)}</span>
                  </div>
                </div>
              ))}
              <div className="text-lg font-bold text-right pt-2 border-t">
                Subtotal: {formatCurrency(carrinho.reduce((sum, item) => sum + item.total, 0))}
              </div>
            </div>
          )}

          {showClienteInput && (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Cliente <span className="text-gray-400">(opcional)</span>
              </label>
              <input
                type="text"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                placeholder="Deixe em branco para preencher depois"
              />
              <div className="flex gap-2">
                <button
                  onClick={saveOrcamento}
                  disabled={authLoading}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded-md"
                >
                  {authLoading ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  onClick={() => setShowClienteInput(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-4 mb-16">
            <button
              onClick={() => setShowClienteInput(true)}
              disabled={carrinho.length === 0}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-md"
            >
              Salvar Orçamento
            </button>
            <button
              onClick={clearCarrinho}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-md"
            >
              Limpar
            </button>
          </div>

          <button
            onClick={() => setCurrentScreen('home')}
            className="fixed bottom-4 left-4 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Tela Pendentes
  if (currentScreen === 'pendentes') {
    const orcamentosSeguro = Array.isArray(orcamentos) ? orcamentos : [];
    return (
      <div className="min-h-screen bg-pink-50 p-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">Orçamentos Pendentes</h2>
          {orcamentosSeguro.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              Nenhum orçamento pendente<br />
              <span className="text-sm">Crie um orçamento primeiro!</span>
            </div>
          ) : (
            orcamentosSeguro.map((orcamento, idx) => (
              <div key={`orcamento-${idx}`} className="bg-white p-4 rounded-lg shadow mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    {editingCliente === orcamento.id ? (
                      <div className="mb-2">
                        <input
                          type="text"
                          defaultValue={orcamento.cliente}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') saveClienteEdit(orcamento.id, e.target.value);
                          }}
                          onBlur={(e) => saveClienteEdit(orcamento.id, e.target.value)}
                          className="w-full p-2 text-lg font-bold border border-gray-300 rounded-md"
                          placeholder="Nome do cliente"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div 
                        className="font-bold text-lg cursor-pointer hover:bg-gray-100 p-1 rounded flex items-center gap-2"
                        onClick={() => setEditingCliente(orcamento.id)}
                      >
                        {orcamento.cliente || (
                          <span className="text-gray-400 italic">📝 Clique para adicionar nome</span>
                        )}
                        <Edit3 size={14} className="text-gray-400" />
                      </div>
                    )}
                    <div className="text-sm text-gray-600">{formatDate(orcamento.data)}</div>
                  </div>
                  <div className="text-lg font-bold text-green-600">{formatCurrency(orcamento.total)}</div>
                </div>
                <div className="border-t pt-2 mt-2">
                  {orcamento.itens && Array.isArray(orcamento.itens) && orcamento.itens.map((item, itemIdx) => (
                    <div key={`item-${itemIdx}`} className="flex justify-between text-sm mb-1">
                      <span>{item.produto?.nome || 'Produto'} x{item.quantidade || 0}</span>
                      <span>{formatCurrency(item.total || 0)}</span>
                    </div>
                  ))}
                </div>
                {showDataEntrega === orcamento.id ? (
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data de Entrega</label>
                    <input
                      type="date"
                      value={dataEntrega}
                      onChange={(e) => setDataEntrega(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md mb-3"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tema da Festa <span className="text-gray-400">(opcional)</span></label>
                    <input
                      type="text"
                      value={temaFesta}
                      onChange={(e) => setTemaFesta(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md mb-3"
                      placeholder="Ex: Frozen, Homem-Aranha..."
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valor do Sinal</label>
                    <input
                      type="number"
                      step="0.01"
                      value={valorSinal}
                      onChange={(e) => setValorSinal(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md mb-3"
                      placeholder="0,00"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => confirmarOrcamento(orcamento)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                      >Confirmar</button>
                      <button
                        onClick={() => setShowDataEntrega(false)}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
                      >Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setShowDataEntrega(orcamento.id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
                    ><Check size={16} /> Confirmar</button>
                    <button
                      onClick={() => cancelarOrcamento(orcamento.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
                    ><X size={16} /> Cancelar</button>
                  </div>
                )}
              </div>
            ))
          )}
          <button
            onClick={() => setCurrentScreen('home')}
            className="fixed bottom-4 left-4 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Tela Pedidos
  if (currentScreen === 'pedidos') {
    const pedidosSeguro = Array.isArray(pedidos) ? pedidos : [];
    const pedidosOrdenados = [...pedidosSeguro].sort((a, b) => {
      try {
        const dateA = new Date(a.dataEntrega);
        const dateB = new Date(b.dataEntrega);
        return dateA - dateB;
      } catch {
        return 0;
      }
    });
    return (
      <div className="min-h-screen bg-pink-50 p-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">Pedidos Confirmados</h2>
          {pedidosOrdenados.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              Nenhum pedido confirmado<br />
              <span className="text-sm">Confirme um orçamento primeiro!</span>
            </div>
          ) : (
            pedidosOrdenados.map((pedido, idx) => (
              <div key={`pedido-${idx}`} className="bg-white p-4 rounded-lg shadow mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    {editingCliente === pedido.id ? (
                      <div className="mb-2">
                        <input
                          type="text"
                          defaultValue={pedido.cliente}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') savePedidoClienteEdit(pedido.id, e.target.value);
                          }}
                          onBlur={(e) => savePedidoClienteEdit(pedido.id, e.target.value)}
                          className="w-full p-2 text-lg font-bold border border-gray-300 rounded-md"
                          placeholder="Nome do cliente"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div 
                        className="font-bold text-lg cursor-pointer hover:bg-gray-100 p-1 rounded flex items-center gap-2"
                        onClick={() => setEditingCliente(pedido.id)}
                      >
                        {pedido.cliente || (
                          <span className="text-gray-400 italic">📝 Clique para adicionar nome</span>
                        )}
                        <Edit3 size={14} className="text-gray-400" />
                      </div>
                    )}
                    <div className="text-sm text-gray-600">Orçamento: {formatDate(pedido.data)}</div>
                    <div className="text-sm font-medium text-blue-600">Entrega: {formatDate(pedido.dataEntrega)}</div>
                    {editingTema === pedido.id ? (
                      <div className="mt-2">
                        <input
                          type="text"
                          defaultValue={pedido.temaFesta}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') savePedidoTemaEdit(pedido.id, e.target.value);
                          }}
                          onBlur={(e) => savePedidoTemaEdit(pedido.id, e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          placeholder="Tema da festa"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div 
                        className="text-sm text-purple-600 font-medium cursor-pointer hover:bg-gray-100 p-1 rounded flex items-center gap-2 mt-1"
                        onClick={() => setEditingTema(pedido.id)}
                      >
                        {pedido.temaFesta ? (
                          <>🎉 Tema: {pedido.temaFesta}</>
                        ) : (
                          <span className="text-gray-400 italic">🎉 Clique para adicionar tema</span>
                        )}
                        <Edit3 size={12} className="text-gray-400" />
                      </div>
                    )}
                    {pedido.sinal && pedido.sinal > 0 && (
                      <div className="text-sm text-gray-600">Sinal: {formatCurrency(pedido.sinal)}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{formatCurrency(pedido.total)}</div>
                    {pedido.sinal && pedido.sinal > 0 && (
                      <div className="text-sm font-medium text-orange-600">Restante: {formatCurrency(pedido.restante || 0)}</div>
                    )}
                  </div>
                </div>
                <div className="border-t pt-2 mt-2">
                  {pedido.itens && Array.isArray(pedido.itens) && pedido.itens.map((item, itemIdx) => (
                    <div key={`item-${itemIdx}`} className="flex justify-between text-sm mb-1">
                      <span>{item.produto?.nome || 'Produto'} x{item.quantidade || 0}</span>
                      <span>{formatCurrency(item.total || 0)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => finalizarPedido(pedido)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
                  ><Check size={16} /> Finalizar</button>
                  <button
                    onClick={() => cancelarPedido(pedido.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
                  ><X size={16} /> Cancelar</button>
                </div>
              </div>
            ))
          )}
          <button
            onClick={() => setCurrentScreen('home')}
            className="fixed bottom-4 left-4 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Tela Finalizados
  if (currentScreen === 'finalizados') {
    const finalizadosSeguro = Array.isArray(finalizados) ? finalizados : [];
    const totalFinalizados = finalizadosSeguro.reduce((sum, pedido) => {
      try {
        return sum + (parseFloat(pedido.total) || 0);
      } catch {
        return sum;
      }
    }, 0);
    const mediaTicket = finalizadosSeguro.length > 0 ? totalFinalizados / finalizadosSeguro.length : 0;
    return (
      <div className="min-h-screen bg-pink-50 p-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">Pedidos Finalizados</h2>
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="font-bold text-lg mb-4 text-center">💰 Dashboard Financeiro</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{finalizadosSeguro.length}</div>
                <div className="text-sm text-gray-600">Pedidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalFinalizados)}</div>
                <div className="text-sm text-gray-600">Faturamento</div>
              </div>
              <div className="text-center col-span-2">
                <div className="text-xl font-bold text-purple-600">{formatCurrency(mediaTicket)}</div>
                <div className="text-sm text-gray-600">Ticket Médio</div>
              </div>
            </div>
          </div>
          {finalizadosSeguro.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              Nenhum pedido finalizado ainda<br />
              <span className="text-sm">Finalize alguns pedidos para ver o dashboard!</span>
            </div>
          ) : (
            finalizadosSeguro.map((pedido, idx) => (
              <div key={`finalizado-${idx}`} className="bg-white p-4 rounded-lg shadow mb-4 border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-lg">{pedido.cliente || 'Cliente não informado'}</div>
                    <div className="text-sm text-gray-600">Entrega: {formatDate(pedido.dataEntrega || pedido.data)}</div>
                    <div className="text-sm text-gray-600">Finalizado: {formatDate(pedido.dataFinalizacao)}</div>
                    {pedido.temaFesta && (
                      <div className="text-sm text-purple-600 font-medium">🎉 {pedido.temaFesta}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{formatCurrency(pedido.total)}</div>
                    <div className="text-xs text-green-500">✅ PAGO</div>
                  </div>
                </div>
                <div className="border-t pt-2 mt-2">
                  {pedido.itens && Array.isArray(pedido.itens) && pedido.itens.slice(0, 3).map((item, itemIdx) => (
                    <div key={`item-${itemIdx}`} className="flex justify-between text-sm mb-1">
                      <span>{item.produto?.nome || 'Produto'} x{item.quantidade || 0}</span>
                      <span>{formatCurrency(item.total || 0)}</span>
                    </div>
                  ))}
                  {pedido.itens && pedido.itens.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      ... e mais {pedido.itens.length - 3} itens
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <button
            onClick={() => setCurrentScreen('home')}
            className="fixed bottom-4 left-4 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Tela Relatórios
  if (currentScreen === 'relatorios') {
    // Validar se os arrays existem
    const finalizadosSeguro = Array.isArray(finalizados) ? finalizados : [];
    const pedidosSeguro = Array.isArray(pedidos) ? pedidos : [];
    const orcamentosSeguro = Array.isArray(orcamentos) ? orcamentos : [];

    // Dados filtrados por período
    const vendasDoMes = filtrarPorMes(finalizadosSeguro, mesVendas, 'dataFinalizacao');
    const totalVendas = vendasDoMes.reduce((sum, pedido) => {
      try {
        return sum + (parseFloat(pedido.total) || 0);
      } catch {
        return sum;
      }
    }, 0);
    
    const entregasDoMes = filtrarPorMes(pedidosSeguro, mesEntregas, 'dataEntrega');
    const totalEntregasDoMes = entregasDoMes.reduce((sum, pedido) => {
      try {
        return sum + (parseFloat(pedido.total) || 0);
      } catch {
        return sum;
      }
    }, 0);
    
    const pedidosDoMes = filtrarPorMes(pedidosSeguro, mesPedidos, 'data');
    const totalPedidosDoMes = pedidosDoMes.reduce((sum, pedido) => {
      try {
        return sum + (parseFloat(pedido.total) || 0);
      } catch {
        return sum;
      }
    }, 0);
    
    const orcamentosDoMes = filtrarPorMes(orcamentosSeguro, mesOrcamentos, 'data');
    const totalOrcamentosDoMes = orcamentosDoMes.reduce((sum, orcamento) => {
      try {
        return sum + (parseFloat(orcamento.total) || 0);
      } catch {
        return sum;
      }
    }, 0);

    // Dados do mês anterior para comparação
    let crescimentoVendas = 0;
    try {
      const mesAnterior = new Date(mesVendas + '-01');
      mesAnterior.setMonth(mesAnterior.getMonth() - 1);
      const mesAnteriorStr = mesAnterior.toISOString().slice(0, 7);
      
      const vendasMesAnterior = filtrarPorMes(finalizadosSeguro, mesAnteriorStr, 'dataFinalizacao').reduce((sum, pedido) => {
        try {
          return sum + (parseFloat(pedido.total) || 0);
        } catch {
          return sum;
        }
      }, 0);
      crescimentoVendas = calcularCrescimento(totalVendas, vendasMesAnterior);
    } catch (error) {
      crescimentoVendas = 0;
    }

    // Produtos mais vendidos do período
    const produtosMaisVendidos = {};
    try {
      vendasDoMes.forEach(pedido => {
        if (pedido.itens && Array.isArray(pedido.itens)) {
          pedido.itens.forEach(item => {
            if (item && item.produto && item.produto.nome && item.quantidade) {
              const nome = item.produto.nome;
              const quantidade = parseInt(item.quantidade) || 0;
              produtosMaisVendidos[nome] = (produtosMaisVendidos[nome] || 0) + quantidade;
            }
          });
        }
      });
    } catch (error) {
      // Ignorar erro
    }
    
    const topProdutos = Object.entries(produtosMaisVendidos)
      .sort(([,a], [,b]) => (b || 0) - (a || 0))
      .slice(0, 5);

    // Análise de tendência (últimos 6 meses)
    const ultimosMeses = [];
    try {
      for (let i = 5; i >= 0; i--) {
        const mes = new Date();
        mes.setMonth(mes.getMonth() - i);
        const mesStr = mes.toISOString().slice(0, 7);
        const vendas = filtrarPorMes(finalizadosSeguro, mesStr, 'dataFinalizacao').reduce((sum, p) => {
          try {
            return sum + (parseFloat(p.total) || 0);
          } catch {
            return sum;
          }
        }, 0);
        ultimosMeses.push({
          mes: mes.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
          valor: vendas
        });
      }
    } catch (error) {
      // Manter array vazio se houver erro
    }

    return (
      <div className="min-h-screen bg-pink-50 p-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">Relatórios</h2>
          
          {/* Cards com filtros de período */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            {/* Total Vendido */}
            <div className="bg-green-100 p-4 rounded-lg">
              <div className="text-center mb-3">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalVendas)}</div>
                <div className="text-sm text-green-700">Total Vendido</div>
                <div className="text-xs text-green-600">{vendasDoMes.length} pedidos</div>
                {crescimentoVendas !== 0 && !isNaN(crescimentoVendas) && (
                  <div className={`text-xs font-medium ${crescimentoVendas > 0 ? 'text-green-800' : 'text-red-600'}`}>
                    {crescimentoVendas > 0 ? '↗️' : '↘️'} {Math.abs(crescimentoVendas).toFixed(1)}% vs mês anterior
                  </div>
                )}
              </div>
              <input
                type="month"
                value={mesVendas}
                onChange={(e) => setMesVendas(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            {/* Entregas do Mês */}
            <div className="bg-blue-100 p-4 rounded-lg">
              <div className="text-center mb-3">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalEntregasDoMes)}</div>
                <div className="text-sm text-blue-700">Entregas do Mês</div>
                <div className="text-xs text-blue-600">{entregasDoMes.length} pedidos</div>
              </div>
              <input
                type="month"
                value={mesEntregas}
                onChange={(e) => setMesEntregas(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            {/* Pedidos Criados no Mês */}
            <div className="bg-purple-100 p-4 rounded-lg">
              <div className="text-center mb-3">
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalPedidosDoMes)}</div>
                <div className="text-sm text-purple-700">Pedidos do Mês</div>
                <div className="text-xs text-purple-600">{pedidosDoMes.length} pedidos</div>
              </div>
              <input
                type="month"
                value={mesPedidos}
                onChange={(e) => setMesPedidos(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md"
              />
            </div>

            {/* Orçamentos do Mês */}
            <div className="bg-orange-100 p-4 rounded-lg">
              <div className="text-center mb-3">
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalOrcamentosDoMes)}</div>
                <div className="text-sm text-orange-700">Orçamentos do Mês</div>
                <div className="text-xs text-orange-600">{orcamentosDoMes.length} pendentes</div>
              </div>
              <input
                type="month"
                value={mesOrcamentos}
                onChange={(e) => setMesOrcamentos(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Tendência dos últimos 6 meses */}
          {ultimosMeses.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="font-bold text-lg mb-4">📈 Evolução das Vendas (6 meses)</h3>
              <div className="space-y-2">
                {ultimosMeses.map((item, index) => {
                  const maxValue = Math.max(...ultimosMeses.map(m => parseFloat(m.valor) || 0));
                  const itemValue = parseFloat(item.valor) || 0;
                  const percentage = maxValue > 0 ? (itemValue / maxValue) * 100 : 0;
                  return (
                    <div key={`mes-${index}`} className="flex items-center gap-3">
                      <div className="text-sm font-medium w-16">{item.mes || ''}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                        <div 
                          className="bg-gradient-to-r from-pink-400 to-pink-600 h-4 rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(percentage, 0)}%` }}
                        ></div>
                      </div>
                      <div className="text-sm font-bold text-gray-700 w-20 text-right">
                        {formatCurrency(itemValue)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="font-bold text-lg mb-4">🏆 Top 5 Produtos do Período</h3>
            <div className="text-sm text-gray-600 mb-3">
              Baseado em vendas de {(() => {
                try {
                  return new Date(mesVendas + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                } catch {
                  return 'período selecionado';
                }
              })()}
            </div>
            {topProdutos.length === 0 ? (
              <div className="text-center text-gray-500">Nenhuma venda registrada no período</div>
            ) : (
              topProdutos.map(([produto, quantidade], index) => (
                <div key={`produto-${index}`} className="flex justify-between items-center mb-2 p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-purple-600">#{index + 1}</span>
                    <span className="text-sm">{produto}</span>
                  </div>
                  <span className="font-bold text-green-600">{quantidade}x</span>
                </div>
              ))
            )}
          </div>
          
          {/* Métricas Avançadas */}
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="font-bold text-lg mb-4">📊 Análise do Período</h3>
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div className="bg-blue-50 p-3 rounded">
                <div className="font-bold text-blue-600">
                  {vendasDoMes.length > 0 ? formatCurrency(totalVendas / vendasDoMes.length) : formatCurrency(0)}
                </div>
                <div className="text-blue-700">Ticket Médio</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="font-bold text-green-600">
                  {vendasDoMes.reduce((sum, p) => {
                    try {
                      if (p.itens && Array.isArray(p.itens)) {
                        return sum + p.itens.reduce((s, i) => s + (parseInt(i.quantidade) || 0), 0);
                      }
                      return sum;
                    } catch {
                      return sum;
                    }
                  }, 0)}
                </div>
                <div className="text-green-700">Itens Vendidos</div>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <div className="font-bold text-purple-600">
                  {orcamentosDoMes.length > 0 ? ((pedidosDoMes.length / orcamentosDoMes.length) * 100).toFixed(1) : 0}%
                </div>
                <div className="text-purple-700">Taxa Conversão</div>
              </div>
              <div className="bg-orange-50 p-3 rounded">
                <div className="font-bold text-orange-600">
                  {entregasDoMes.length}
                </div>
                <div className="text-orange-700">Entregas Mês</div>
              </div>
            </div>
          </div>

          {/* Entregas do período selecionado */}
          {entregasDoMes.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="font-bold text-lg mb-4">📅 Entregas do Período</h3>
              <div className="text-sm text-gray-600 mb-3">
                {(() => {
                  try {
                    return new Date(mesEntregas + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                  } catch {
                    return 'Período selecionado';
                  }
                })()}
              </div>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {entregasDoMes.slice(0, 10).map((pedido, idx) => (
                  <div key={`entrega-${idx}`} className="border-l-4 border-blue-500 pl-3 bg-blue-50 p-2 rounded">
                    <div className="font-medium">{pedido.cliente || 'Cliente não informado'}</div>
                    <div className="text-sm text-gray-600 flex justify-between">
                      <span>Entrega: {formatDate(pedido.dataEntrega)}</span>
                      <span className="font-bold">{formatCurrency(pedido.total)}</span>
                    </div>
                    {pedido.temaFesta && (
                      <div className="text-sm text-purple-600">🎉 {pedido.temaFesta}</div>
                    )}
                  </div>
                ))}
                {entregasDoMes.length > 10 && (
                  <div className="text-center text-gray-500 text-sm">
                    ... e mais {entregasDoMes.length - 10} entregas
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-400 text-yellow-800 px-4 py-3 rounded text-center">
            💡 <strong>Dica:</strong> Use os filtros de mês para analisar diferentes períodos e identificar tendências sazonais!
          </div>
          <button
            onClick={() => setCurrentScreen('home')}
            className="fixed bottom-4 left-4 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Tela Produtos
  if (currentScreen === 'produtos') {
    const categorias = [...new Set(produtos.map(p => p.categoria))];
    return (
      <div className="min-h-screen bg-pink-50 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-pink-800">Catálogo de Produtos</h2>
            <div className="flex gap-2">
              <button
                onClick={resetProducts}
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-xs"
                title="Restaurar catálogo original"
              >
                <RefreshCw size={16} />
              </button>
              <button
                onClick={() => setShowAddProduct(true)}
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full"
                title="Adicionar novo produto"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
          {showAddProduct && (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="font-bold text-lg mb-4">➕ Adicionar Produto</h3>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Produto</label>
                <input
                  type="text"
                  value={newProduct.nome}
                  onChange={(e) => setNewProduct({...newProduct, nome: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Nome do produto"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Preço</label>
                <input
                  type="number"
                  step="0.01"
                  value={newProduct.preco}
                  onChange={(e) => setNewProduct({...newProduct, preco: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="0,00"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                {newProduct.categoria === 'NOVA_CATEGORIA' ? (
                  <input
                    type="text"
                    value={newProduct.novaCategoria || ''}
                    onChange={(e) => setNewProduct({...newProduct, novaCategoria: e.target.value, categoria: e.target.value.toUpperCase()})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Nome da nova categoria"
                    autoFocus
                  />
                ) : (
                  <select
                    value={newProduct.categoria}
                    onChange={(e) => setNewProduct({...newProduct, categoria: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {categorias.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="NOVA_CATEGORIA">+ Nova Categoria</option>
                  </select>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addNewProduct}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                >Adicionar</button>
                <button
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
                >Cancelar</button>
              </div>
            </div>
          )}
          {categorias.map(categoria => (
            <div key={categoria} className="mb-6">
              <h3 className="font-bold text-lg text-pink-700 mb-3 bg-pink-100 p-2 rounded flex justify-between items-center">
                <span>{categoria}</span>
                <span className="text-sm font-normal">{produtos.filter(p => p.categoria === categoria).length} itens</span>
              </h3>
              {produtos.filter(p => p.categoria === categoria).map(produto => (
                <div key={produto.id} className="bg-white p-3 rounded-lg shadow mb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 mr-2">
                      {editingProductName === produto.id ? (
                        <input
                          type="text"
                          defaultValue={produto.nome}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') saveProductNameEdit(produto.id, e.target.value);
                          }}
                          onBlur={(e) => saveProductNameEdit(produto.id, e.target.value)}
                          className="w-full p-1 text-sm font-medium border border-gray-300 rounded"
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="font-medium text-gray-800 cursor-pointer hover:bg-gray-100 p-1 rounded flex items-center gap-2"
                          onClick={() => setEditingProductName(produto.id)}
                        >
                          {produto.nome}
                          <Edit3 size={12} className="text-gray-400" />
                        </div>
                      )}
                      <div className="text-sm text-gray-600">#{produto.id}</div>
                    </div>
                    <div className="text-right">
                      {editingProductPrice === produto.id ? (
                        <input
                          type="number"
                          step="0.01"
                          defaultValue={produto.preco}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') saveProductPriceEdit(produto.id, e.target.value);
                          }}
                          onBlur={(e) => saveProductPriceEdit(produto.id, e.target.value)}
                          className="w-20 p-1 text-sm font-bold text-right border border-gray-300 rounded"
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="text-lg font-bold text-green-600 cursor-pointer hover:bg-gray-100 p-1 rounded flex items-center gap-1"
                          onClick={() => setEditingProductPrice(produto.id)}
                        >
                          {formatCurrency(produto.preco)}
                          <Edit3 size={12} className="text-gray-400" />
                        </div>
                      )}
                      <button
                        onClick={() => deleteProduct(produto.id)}
                        className="text-red-500 hover:text-red-700 text-xs mt-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 text-center">
            📝 <strong>Total:</strong> {produtos.length} produtos cadastrados<br />
            💡 <strong>Dica:</strong> Clique nos nomes e preços para editar!<br />
            <span className="text-sm">💾 Produtos salvos localmente no dispositivo</span>
          </div>
          <button
            onClick={() => setCurrentScreen('home')}
            className="fixed bottom-4 left-4 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
      </div>
    );
  }
};

export default App;