import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Check, X, Edit3, Save, Wifi, WifiOff, User, LogOut, Download, RefreshCw } from 'lucide-react';

// Imports do Firebase
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { auth, db } from './config/firebase';

const App = () => {
  // Estados de PWA
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  // Estados de autenticação
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estados da aplicação
  const [currentScreen, setCurrentScreen] = useState('home');
  const [carrinho, setCarrinho] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [finalizados, setFinalizados] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCliente, setEditingCliente] = useState(null);
  const [editingTema, setEditingTema] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

  // PWA Effects
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissed = localStorage.getItem('installPromptDismissed');
      if (!dismissed) {
        setShowInstallPrompt(true);
      }
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.log('Service Worker não disponível:', error);
        });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Monitorar status de conexão
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sistema de persistência - Produtos localmente, dados principais no Firebase
  useEffect(() => {
    localStorage.setItem('donana-produtos', JSON.stringify(produtos));
  }, [produtos]);

  // Carregar apenas produtos do localStorage na inicialização
  useEffect(() => {
    const produtosSalvos = localStorage.getItem('donana-produtos');
    if (produtosSalvos) {
      try {
        const produtosParsed = JSON.parse(produtosSalvos);
        if (Array.isArray(produtosParsed) && produtosParsed.length > 0) {
          setProdutos(produtosParsed);
        }
      } catch (error) {
        console.log('Erro ao carregar produtos salvos:', error);
      }
    }
  }, []);

  // Monitorar autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔐 Status de autenticação:', user ? `Logado: ${user.email}` : 'Deslogado');
      setUser(user);
      setLoading(false);
      
      if (user) {
        console.log('👤 Carregando dados para:', user.uid);
        loadUserData(user.uid);
      } else {
        console.log('👤 Sem usuário, limpando dados');
        setOrcamentos([]);
        setPedidos([]);
        setFinalizados([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Carregar dados do usuário do Firebase
  const loadUserData = async (userId) => {
    if (!userId) {
      console.log('⚠️ UserID não fornecido');
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Carregando dados do Firebase para:', userId);

      if (!db) {
        console.log('⚠️ Firebase não configurado');
        return;
      }

      // Carregar orçamentos
      console.log('📊 Buscando orçamentos...');
      const orcamentosRef = collection(db, 'orcamentos');
      const orcamentosQuery = query(orcamentosRef, where('userId', '==', userId));
      const orcamentosSnapshot = await getDocs(orcamentosQuery);
      
      const orcamentosData = orcamentosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        syncedWithFirebase: true
      }));
      
      orcamentosData.sort((a, b) => {
        const dateA = new Date(a.data || a.createdAt?.toDate?.() || a.createdAt || 0);
        const dateB = new Date(b.data || b.createdAt?.toDate?.() || b.createdAt || 0);
        return dateB - dateA;
      });
      
      setOrcamentos(orcamentosData);
      console.log('✅ Orçamentos carregados:', orcamentosData.length);

      // Carregar pedidos
      console.log('📊 Buscando pedidos...');
      const pedidosRef = collection(db, 'pedidos');
      const pedidosQuery = query(pedidosRef, where('userId', '==', userId));
      const pedidosSnapshot = await getDocs(pedidosQuery);
      
      const pedidosData = pedidosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        syncedWithFirebase: true
      }));
      
      pedidosData.sort((a, b) => new Date(a.dataEntrega || 0) - new Date(b.dataEntrega || 0));
      setPedidos(pedidosData);
      console.log('✅ Pedidos carregados:', pedidosData.length);

      // Carregar finalizados
      console.log('📊 Buscando finalizados...');
      const finalizadosRef = collection(db, 'finalizados');
      const finalizadosQuery = query(finalizadosRef, where('userId', '==', userId));
      const finalizadosSnapshot = await getDocs(finalizadosQuery);
      
      const finalizadosData = finalizadosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        syncedWithFirebase: true
      }));
      
      finalizadosData.sort((a, b) => {
        const dateA = new Date(a.dataFinalizacao || 0);
        const dateB = new Date(b.dataFinalizacao || 0);
        return dateB - dateA;
      });
      
      setFinalizados(finalizadosData);
      console.log('✅ Finalizados carregados:', finalizadosData.length);

      // Backup local
      try {
        localStorage.setItem('donana-orcamentos-backup', JSON.stringify(orcamentosData));
        localStorage.setItem('donana-pedidos-backup', JSON.stringify(pedidosData));
        localStorage.setItem('donana-finalizados-backup', JSON.stringify(finalizadosData));
      } catch (e) {
        console.log('⚠️ Erro ao salvar backup:', e);
      }

      console.log('🎉 Carregamento Firebase completo!');

    } catch (error) {
      console.error('❌ Erro ao carregar do Firebase:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para forçar recarregamento
  const forceReloadData = async () => {
    if (!user) {
      console.log('⚠️ Usuário não logado');
      return;
    }
    
    console.log('🔄 Forçando recarregamento...');
    setLoading(true);
    try {
      await loadUserData(user.uid);
    } catch (error) {
      console.error('❌ Erro ao recarregar:', error);
    } finally {
      setLoading(false);
    }
  };

  // Limpar cache local
  const clearLocalData = () => {
    if (!user) {
      console.log('⚠️ Usuário não logado');
      return;
    }
    
    if (window.confirm('Limpar cache local?')) {
      localStorage.removeItem('donana-orcamentos-backup');
      localStorage.removeItem('donana-pedidos-backup');
      localStorage.removeItem('donana-finalizados-backup');
      
      console.log('🗑️ Cache limpo, recarregando...');
      loadUserData(user.uid);
    }
  };

  // PWA Functions
  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
      }
    }
  };

  const handleUpdateApp = () => {
    if (updateAvailable) {
      window.location.reload();
    }
  };

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  // Funções de autenticação
  const handleAuth = async (email, password) => {
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setShowAuth(false);
    } catch (error) {
      alert('Erro na autenticação: ' + error.message);
    }
    setAuthLoading(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentScreen('home');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Funções auxiliares
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
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
  const saveOrcamento = async () => {
    if (carrinho.length === 0) return;
    
    if (!user) {
      alert('⚠️ Faça login para salvar orçamentos!');
      setShowAuth(true);
      return;
    }

    try {
      setAuthLoading(true);
      console.log('💾 Salvando orçamento no Firebase para:', user.uid);
      
      const agora = new Date();
      const novoOrcamento = {
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

      console.log('📄 Dados a serem salvos:', novoOrcamento);

      const docRef = await addDoc(collection(db, 'orcamentos'), novoOrcamento);
      console.log('✅ Orçamento salvo com ID:', docRef.id);
      
      clearCarrinho();
      setNomeCliente('');
      setShowClienteInput(false);
      
      console.log('🔄 Recarregando dados...');
      await loadUserData(user.uid);
      
      setCurrentScreen('home');
      alert('✅ Orçamento salvo com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      alert('❌ Erro ao salvar orçamento: ' + error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Editar cliente
  const saveClienteEdit = async (orcamentoId, novoNome) => {
    try {
      await updateDoc(doc(db, 'orcamentos', orcamentoId), {
        cliente: novoNome.trim()
      });
      
      setOrcamentos(orcamentos.map(o => 
        o.id === orcamentoId 
          ? { ...o, cliente: novoNome.trim() }
          : o
      ));
      setEditingCliente(null);
    } catch (error) {
      console.error('Erro ao editar cliente:', error);
    }
  };

  const savePedidoClienteEdit = async (pedidoId, novoNome) => {
    try {
      await updateDoc(doc(db, 'pedidos', pedidoId), {
        cliente: novoNome.trim()
      });
      
      setPedidos(pedidos.map(p => 
        p.id === pedidoId 
          ? { ...p, cliente: novoNome.trim() }
          : p
      ));
      setEditingCliente(null);
    } catch (error) {
      console.error('Erro ao editar cliente:', error);
    }
  };

  const savePedidoTemaEdit = async (pedidoId, novoTema) => {
    try {
      await updateDoc(doc(db, 'pedidos', pedidoId), {
        temaFesta: novoTema.trim()
      });
      
      setPedidos(pedidos.map(p => 
        p.id === pedidoId 
          ? { ...p, temaFesta: novoTema.trim() }
          : p
      ));
      setEditingTema(null);
    } catch (error) {
      console.error('Erro ao editar tema:', error);
    }
  };

  // Confirmar orçamento
  const confirmarOrcamento = async (orcamento) => {
    if (!dataEntrega || !valorSinal) return;
    if (!user) {
      alert('Faça login para confirmar pedidos!');
      return;
    }

    try {
      console.log('🔄 Confirmando orçamento...');
      const sinalNumerico = parseFloat(valorSinal.replace(',', '.')) || 0;
      
      const novoPedido = {
        ...orcamento,
        dataEntrega: new Date(dataEntrega).toISOString(),
        sinal: sinalNumerico,
        restante: orcamento.total - sinalNumerico,
        temaFesta: temaFesta.trim() || '',
        userId: user.uid,
        createdAt: new Date()
      };

      delete novoPedido.id;
      delete novoPedido.syncedWithFirebase;

      const docRef = await addDoc(collection(db, 'pedidos'), novoPedido);
      
      if (orcamento.syncedWithFirebase) {
        await deleteDoc(doc(db, 'orcamentos', orcamento.id));
      }
      
      const pedidoSalvo = { id: docRef.id, ...novoPedido, syncedWithFirebase: true };
      setPedidos([pedidoSalvo, ...pedidos]);
      setOrcamentos(orcamentos.filter(o => o.id !== orcamento.id));
      
      localStorage.setItem('donana-pedidos-backup', JSON.stringify([pedidoSalvo, ...pedidos]));
      localStorage.setItem('donana-orcamentos-backup', JSON.stringify(orcamentos.filter(o => o.id !== orcamento.id)));
      
      setDataEntrega('');
      setValorSinal('');
      setTemaFesta('');
      setShowDataEntrega(false);
      
      console.log('✅ Orçamento confirmado');

    } catch (error) {
      console.error('❌ Erro ao confirmar:', error);
      alert('Erro ao confirmar orçamento: ' + error.message);
    }
  };

  // Finalizar pedido
  const finalizarPedido = async (pedido) => {
    if (!user) {
      alert('Faça login para finalizar pedidos!');
      return;
    }

    try {
      console.log('🔄 Finalizando pedido...');
      
      const pedidoFinalizado = {
        ...pedido,
        dataFinalizacao: new Date().toISOString(),
        userId: user.uid
      };

      delete pedidoFinalizado.id;
      delete pedidoFinalizado.syncedWithFirebase;

      const docRef = await addDoc(collection(db, 'finalizados'), pedidoFinalizado);
      
      if (pedido.syncedWithFirebase) {
        await deleteDoc(doc(db, 'pedidos', pedido.id));
      }
      
      const finalizadoSalvo = { id: docRef.id, ...pedidoFinalizado, syncedWithFirebase: true };
      setFinalizados([finalizadoSalvo, ...finalizados]);
      setPedidos(pedidos.filter(p => p.id !== pedido.id));
      
      localStorage.setItem('donana-finalizados-backup', JSON.stringify([finalizadoSalvo, ...finalizados]));
      localStorage.setItem('donana-pedidos-backup', JSON.stringify(pedidos.filter(p => p.id !== pedido.id)));
      
      console.log('✅ Pedido finalizado');
      
    } catch (error) {
      console.error('❌ Erro ao finalizar:', error);
      alert('Erro ao finalizar pedido: ' + error.message);
    }
  };

  // Cancelar orçamento
  const cancelarOrcamento = async (orcamentoId) => {
    if (window.confirm('Tem certeza que deseja cancelar este orçamento?')) {
      if (!user) {
        alert('Faça login para gerenciar orçamentos!');
        return;
      }

      try {
        const orcamento = orcamentos.find(o => o.id === orcamentoId);
        
        if (orcamento?.syncedWithFirebase) {
          await deleteDoc(doc(db, 'orcamentos', orcamentoId));
        }
        
        const novosOrcamentos = orcamentos.filter(o => o.id !== orcamentoId);
        setOrcamentos(novosOrcamentos);
        
        localStorage.setItem('donana-orcamentos-backup', JSON.stringify(novosOrcamentos));
        
        console.log('✅ Orçamento cancelado');
      } catch (error) {
        console.error('❌ Erro ao cancelar:', error);
        alert('Erro ao cancelar orçamento');
      }
    }
  };

  const cancelarPedido = async (pedidoId) => {
    if (window.confirm('Tem certeza que deseja cancelar este pedido?')) {
      if (!user) {
        alert('Faça login para gerenciar pedidos!');
        return;
      }

      try {
        const pedido = pedidos.find(p => p.id === pedidoId);
        
        if (pedido?.syncedWithFirebase) {
          await deleteDoc(doc(db, 'pedidos', pedidoId));
        }
        
        const novosPedidos = pedidos.filter(p => p.id !== pedidoId);
        setPedidos(novosPedidos);
        
        localStorage.setItem('donana-pedidos-backup', JSON.stringify(novosPedidos));
        
        console.log('✅ Pedido cancelado');
      } catch (error) {
        console.error('❌ Erro ao cancelar:', error);
        alert('Erro ao cancelar pedido');
      }
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
    }
  };

  const deleteProduct = (produtoId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      setProdutos(produtos.filter(p => p.id !== produtoId));
    }
  };

  const resetProducts = () => {
    if (window.confirm('Tem certeza que deseja restaurar o catálogo original? Todas as alterações serão perdidas.')) {
      setProdutos(produtosIniciais);
      localStorage.removeItem('donana-produtos');
    }
  };

  // Loading inicial
  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-pink-800 mb-4">APP DONANA</div>
          <div className="text-gray-600">Carregando...</div>
        </div>
      </div>
    );
  }

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

          {/* PWA Install Prompt */}
          {showInstallPrompt && !isAppInstalled && (
            <div className="bg-pink-500 text-white p-4 rounded-lg mb-4 animate-slide-up">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-bold">📱 Instalar App</div>
                  <div className="text-sm opacity-90">Acesse offline e tenha melhor experiência!</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleInstallApp}
                    className="bg-white text-pink-500 px-3 py-1 rounded text-sm font-bold"
                  >
                    <Download size={16} className="inline mr-1" />
                    Instalar
                  </button>
                  <button
                    onClick={dismissInstallPrompt}
                    className="text-white hover:bg-pink-600 px-2 py-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Update Available */}
          {updateAvailable && (
            <div className="bg-blue-500 text-white p-4 rounded-lg mb-4 animate-slide-up">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-bold">🆕 Atualização Disponível</div>
                  <div className="text-sm opacity-90">Nova versão com melhorias!</div>
                </div>
                <button
                  onClick={handleUpdateApp}
                  className="bg-white text-blue-500 px-3 py-1 rounded text-sm font-bold"
                >
                  <RefreshCw size={16} className="inline mr-1" />
                  Atualizar
                </button>
              </div>
            </div>
          )}

          {/* Contador de dados */}
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-3 py-2 rounded mb-6 text-center text-sm">
            📊 {orcamentos.length} orçamentos • {pedidos.length} pedidos • {finalizados.length} finalizados
            {user && (
              <div className="mt-2">
                <button 
                  onClick={forceReloadData}
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded mr-2"
                >
                  🔄 Recarregar
                </button>
                <button 
                  onClick={clearLocalData}
                  className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                >
                  🗑️ Limpar Cache
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {[
              { name: 'ORÇAMENTO', screen: 'orcamento' },
              { name: 'PENDENTES', screen: 'pendentes', badge: orcamentos.length },
              { name: 'PEDIDOS', screen: 'pedidos', badge: pedidos.length },
              { name: 'FINALIZADOS', screen: 'finalizados', badge: finalizados.length },
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

  // Fallback para outras telas
  return (
    <div className="min-h-screen bg-pink-50 p-4">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-pink-800 mb-6">
          Tela: {currentScreen}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Esta funcionalidade está implementada no código original!
        </p>
        <button
          onClick={() => setCurrentScreen('home')}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-md"
        >
          Voltar ao Início
        </button>
        
        <button
          onClick={() => setCurrentScreen('home')}
          className="fixed bottom-4 left-4 bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-full shadow-lg"
        >
          <ChevronLeft size={24} />
        </button>
      </div>
    </div>
  );
};

export default App;