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

  // NOVO: Estados para fila de ações offline e status de sincronização
  const [pendingSync, setPendingSync] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Utilitário para salvar ações pendentes offline
  const addPendingAction = (action) => {
    const queue = JSON.parse(localStorage.getItem('donana-pending-actions') || '[]');
    queue.push(action);
    localStorage.setItem('donana-pending-actions', JSON.stringify(queue));
    setPendingSync(true);
  };

  // Função para processar fila de ações pendentes
  const processPendingActions = async () => {
    const queue = JSON.parse(localStorage.getItem('donana-pending-actions') || '[]');
    console.log('📋 Processando fila de ações pendentes:', queue.length, 'itens');
    
    if (!user || queue.length === 0) {
      console.log('✅ Nenhuma ação pendente para processar');
      return;
    }
    
    let success = 0;
    let errors = 0;
    
    for (const action of queue) {
      try {
        console.log('📤 Processando ação:', action.type);
        
        if (action.type === 'orcamento') {
          await addDoc(collection(db, 'orcamentos'), action.data);
          console.log('✅ Orçamento sincronizado');
        } else if (action.type === 'pedido') {
          await addDoc(collection(db, 'pedidos'), action.data);
          console.log('✅ Pedido sincronizado');
        } else if (action.type === 'finalizado') {
          await addDoc(collection(db, 'finalizados'), action.data);
          console.log('✅ Finalizado sincronizado');
        } else if (action.type === 'produto') {
          // Produtos são salvos apenas localmente
          console.log('ℹ️ Produto - salvamento local apenas');
        }
        success++;
      } catch (e) {
        console.error('❌ Erro ao processar ação:', action.type, e);
        errors++;
      }
    }
    
    console.log(`📊 Resultado: ${success} sucessos, ${errors} erros`);
    
    if (success > 0) {
      setSyncMessage(`✅ ${success} itens sincronizados com sucesso!`);
      setTimeout(() => setSyncMessage(''), 3000);
    }
    
    if (errors > 0) {
      setSyncMessage(`⚠️ ${errors} itens com erro na sincronização`);
      setTimeout(() => setSyncMessage(''), 5000);
    }
    
    // Limpar fila apenas se não houve erros
    if (errors === 0) {
      localStorage.setItem('donana-pending-actions', '[]');
      setPendingSync(false);
    }
  };

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
          console.warn('Service Worker não disponível:', error);
        });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Monitorar status de conexão e processar fila ao voltar online
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      processPendingActions();
    };
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    // Se já estiver online ao abrir, processa fila
    if (navigator.onLine) processPendingActions();
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);

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
        console.warn('Erro ao carregar produtos salvos:', error);
      }
    }
  }, []);

  // Monitorar autenticação
  useEffect(() => {
    console.log('👁️ Monitorando mudanças de autenticação...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔐 Status de autenticação mudou:', user ? `Logado: ${user.email}` : 'Deslogado');
      setUser(user);
      setLoading(false);
      
      if (user) {
        console.log('👤 Usuário logado, carregando dados...');
        loadUserData(user.uid);
      } else {
        console.log('👤 Usuário deslogado, limpando dados...');
        setOrcamentos([]);
        setPedidos([]);
        setFinalizados([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Carregar dados do usuário do Firebase
  const loadUserData = async (userId) => {
    console.log('🔄 loadUserData chamado com userId:', userId);
    
    if (!userId) {
      console.log('❌ userId não fornecido');
      return;
    }

    try {
      setLoading(true);

      if (!db) {
        console.log('❌ db não disponível');
        return;
      }

      console.log('📊 Carregando dados do Firebase...');

      // Carregar orçamentos do usuário atual (voltar ao sistema anterior)
      const orcamentosRef = collection(db, 'orcamentos');
      const orcamentosQuery = query(orcamentosRef, where('userId', '==', userId));
      console.log('🔍 Consultando orçamentos do usuário:', userId);
      const orcamentosSnapshot = await getDocs(orcamentosQuery);
      console.log('📄 Orçamentos encontrados:', orcamentosSnapshot.docs.length);
      
      const orcamentosData = orcamentosSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          syncedWithFirebase: true
        };
      });
      
      orcamentosData.sort((a, b) => {
        const dateA = new Date(a.data || a.createdAt?.toDate?.() || a.createdAt || 0);
        const dateB = new Date(b.data || b.createdAt?.toDate?.() || b.createdAt || 0);
        return dateB - dateA;
      });
      
      console.log('✅ Orçamentos carregados:', orcamentosData.length);
      setOrcamentos(orcamentosData);

      // Carregar pedidos do usuário atual
      const pedidosRef = collection(db, 'pedidos');
      const pedidosQuery = query(pedidosRef, where('userId', '==', userId));
      console.log('🔍 Consultando pedidos do usuário:', userId);
      const pedidosSnapshot = await getDocs(pedidosQuery);
      console.log('📄 Pedidos encontrados:', pedidosSnapshot.docs.length);
      
      const pedidosData = pedidosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        syncedWithFirebase: true
      }));
      
      pedidosData.sort((a, b) => new Date(a.dataEntrega || 0) - new Date(b.dataEntrega || 0));
      console.log('✅ Pedidos carregados:', pedidosData.length);
      setPedidos(pedidosData);

      // Carregar finalizados do usuário atual
      const finalizadosRef = collection(db, 'finalizados');
      const finalizadosQuery = query(finalizadosRef, where('userId', '==', userId));
      console.log('🔍 Consultando finalizados do usuário:', userId);
      const finalizadosSnapshot = await getDocs(finalizadosQuery);
      console.log('📄 Finalizados encontrados:', finalizadosSnapshot.docs.length);
      
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
      
      console.log('✅ Finalizados carregados:', finalizadosData.length);
      setFinalizados(finalizadosData);

      // Backup local
      try {
        localStorage.setItem('donana-orcamentos-backup', JSON.stringify(orcamentosData));
        localStorage.setItem('donana-pedidos-backup', JSON.stringify(pedidosData));
        localStorage.setItem('donana-finalizados-backup', JSON.stringify(finalizadosData));
        console.log('💾 Backup local salvo');
      } catch (e) {
        console.warn('Erro ao salvar backup:', e);
      }

    } catch (error) {
      console.error('❌ Erro ao carregar do Firebase:', error);
      
      // Se houver erro, tentar carregar backup local
      console.log('🔄 Tentando carregar backup local...');
      try {
        const orcamentosBackup = localStorage.getItem('donana-orcamentos-backup');
        const pedidosBackup = localStorage.getItem('donana-pedidos-backup');
        const finalizadosBackup = localStorage.getItem('donana-finalizados-backup');
        
        if (orcamentosBackup) {
          const orcamentosLocal = JSON.parse(orcamentosBackup);
          setOrcamentos(Array.isArray(orcamentosLocal) ? orcamentosLocal : []);
          console.log('📊 Orçamentos locais carregados:', orcamentosLocal.length);
        }
        
        if (pedidosBackup) {
          const pedidosLocal = JSON.parse(pedidosBackup);
          setPedidos(Array.isArray(pedidosLocal) ? pedidosLocal : []);
          console.log('📊 Pedidos locais carregados:', pedidosLocal.length);
        }
        
        if (finalizadosBackup) {
          const finalizadosLocal = JSON.parse(finalizadosBackup);
          setFinalizados(Array.isArray(finalizadosLocal) ? finalizadosLocal : []);
          console.log('📊 Finalizados locais carregados:', finalizadosLocal.length);
        }
      } catch (backupError) {
        console.error('❌ Erro ao carregar backup local:', backupError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para forçar recarregamento
  const forceReloadData = async () => {
    if (!user) {
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔄 Forçando recarregamento de dados...');
      await loadUserData(user.uid);
    } catch (error) {
      console.error('❌ Erro ao recarregar:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para sincronização manual
  const sincronizarManualmente = async () => {
    if (!user) {
      alert('⚠️ Faça login para sincronizar!');
      return;
    }
    
    console.log('🔄 Iniciando sincronização manual...');
    setLoading(true);
    
    try {
      // Primeiro, processar ações pendentes
      console.log('📤 Processando ações pendentes...');
      await processPendingActions();
      
      // Depois, recarregar dados do Firebase
      console.log('📥 Recarregando dados do Firebase...');
      await loadUserData(user.uid);
      
      setSyncMessage('✅ Sincronização concluída com sucesso!');
      setTimeout(() => setSyncMessage(''), 3000);
      
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
      setSyncMessage('❌ Erro na sincronização: ' + error.message);
      setTimeout(() => setSyncMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Limpar cache local
  const clearLocalData = () => {
    if (!user) {
      return;
    }
    
    if (window.confirm('Limpar cache local?')) {
      localStorage.removeItem('donana-orcamentos-backup');
      localStorage.removeItem('donana-pedidos-backup');
      localStorage.removeItem('donana-finalizados-backup');
      
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
    console.log('🔐 Tentando autenticação:', { email, authMode });
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        console.log('🔑 Fazendo login...');
        await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ Login realizado com sucesso');
      } else {
        console.log('📝 Criando nova conta...');
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('✅ Conta criada com sucesso');
      }
      setShowAuth(false);
    } catch (error) {
      console.error('❌ Erro na autenticação:', error);
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

  // Salvar orçamento (adaptado para offline)
  const saveOrcamento = async () => {
    console.log('🔍 Debug saveOrcamento:', { 
      carrinhoLength: carrinho.length, 
      user: user?.email, 
      isOnline, 
      db: !!db 
    });
    
    if (carrinho.length === 0) {
      console.log('❌ Carrinho vazio');
      return;
    }
    
    if (!user) {
      console.log('❌ Usuário não logado');
      alert('⚠️ Faça login para salvar orçamentos!');
      setShowAuth(true);
      return;
    }
    
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
    
    console.log('📝 Tentando salvar orçamento:', novoOrcamento);
    
    try {
      setAuthLoading(true);
      if (isOnline) {
        console.log('🌐 Salvando online...');
        const docRef = await addDoc(collection(db, 'orcamentos'), novoOrcamento);
        console.log('✅ Orçamento salvo no Firebase:', docRef.id);
        await loadUserData(user.uid);
        setCurrentScreen('home');
        alert('✅ Orçamento salvo com sucesso!');
      } else {
        console.log('📱 Salvando offline...');
        addPendingAction({ type: 'orcamento', data: novoOrcamento });
        setSyncMessage('Orçamento salvo localmente. Será sincronizado quando estiver online.');
        setTimeout(() => setSyncMessage(''), 3000);
        setCurrentScreen('home');
      }
      clearCarrinho();
      setNomeCliente('');
      setShowClienteInput(false);
    } catch (error) {
      console.error('❌ Erro ao salvar orçamento:', error);
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

  // Confirmar orçamento (adaptado para offline)
  const confirmarOrcamento = async (orcamento) => {
    if (!dataEntrega || !valorSinal) return;
    if (!user) {
      alert('Faça login para confirmar pedidos!');
      return;
    }
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
    try {
      if (isOnline) {
        const docRef = await addDoc(collection(db, 'pedidos'), novoPedido);
        if (orcamento.syncedWithFirebase) {
          await deleteDoc(doc(db, 'orcamentos', orcamento.id));
        }
        await loadUserData(user.uid);
      } else {
        addPendingAction({ type: 'pedido', data: novoPedido });
        setSyncMessage('Pedido salvo localmente. Será sincronizado quando estiver online.');
        setTimeout(() => setSyncMessage(''), 3000);
      }
      setDataEntrega('');
      setValorSinal('');
      setTemaFesta('');
      setShowDataEntrega(false);
    } catch (error) {
      alert('Erro ao confirmar orçamento: ' + error.message);
    }
  };

  // Finalizar pedido (adaptado para offline)
  const finalizarPedido = async (pedido) => {
    if (!user) {
      alert('Faça login para finalizar pedidos!');
      return;
    }
    const pedidoFinalizado = {
      ...pedido,
      dataFinalizacao: new Date().toISOString(),
      userId: user.uid
    };
    delete pedidoFinalizado.id;
    delete pedidoFinalizado.syncedWithFirebase;
    try {
      if (isOnline) {
        await addDoc(collection(db, 'finalizados'), pedidoFinalizado);
        if (pedido.syncedWithFirebase) {
          await deleteDoc(doc(db, 'pedidos', pedido.id));
        }
        await loadUserData(user.uid);
      } else {
        addPendingAction({ type: 'finalizado', data: pedidoFinalizado });
        setSyncMessage('Finalização salva localmente. Será sincronizada quando estiver online.');
        setTimeout(() => setSyncMessage(''), 3000);
      }
    } catch (error) {
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
        
      } catch (error) {
        console.error('Erro ao cancelar:', error);
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
        
      } catch (error) {
        console.error('Erro ao cancelar:', error);
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

  // Adicionar produto (adaptado para offline, apenas local)
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
      // Se quiser sincronizar produtos com nuvem, pode adicionar na fila também
      // addPendingAction({ type: 'produto', data: novoProduto });
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
            {user ? (
              <div className="mt-2">
                👤 <strong>Dados individuais:</strong> Cada usuário vê seus próprios dados
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
                🔒 <strong>Faça login</strong> para acessar seus dados
              </div>
            )}
          </div>

          {/* Adicionar aviso visual de sincronização pendente/concluída na tela home */}
          {pendingSync && (
            <div className="bg-yellow-200 border border-yellow-400 text-yellow-800 px-3 py-2 rounded mb-2 text-center text-sm animate-bounce-gentle">
              ⚠️ Existem dados pendentes de sincronização. Eles serão enviados automaticamente quando estiver online.
            </div>
          )}
          {syncMessage && (
            <div className="bg-green-200 border border-green-400 text-green-800 px-3 py-2 rounded mb-2 text-center text-sm animate-fade-in">
              {syncMessage}
            </div>
          )}

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
    return (
      <div className="min-h-screen bg-pink-50 p-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">Orçamentos Pendentes</h2>
          {orcamentos.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              Nenhum orçamento pendente<br />
              <span className="text-sm">Crie um orçamento primeiro!</span>
            </div>
          ) : (
            orcamentos.map((orcamento) => (
              <div key={orcamento.id} className="bg-white p-4 rounded-lg shadow mb-4">
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
                  {orcamento.itens.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm mb-1">
                      <span>{item.produto.nome} x{item.quantidade}</span>
                      <span>{formatCurrency(item.total)}</span>
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
    const pedidosOrdenados = [...pedidos].sort((a, b) => new Date(a.dataEntrega) - new Date(b.dataEntrega));
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
            pedidosOrdenados.map((pedido) => (
              <div key={pedido.id} className="bg-white p-4 rounded-lg shadow mb-4">
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
                    {pedido.sinal > 0 && (
                      <div className="text-sm text-gray-600">Sinal: {formatCurrency(pedido.sinal)}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{formatCurrency(pedido.total)}</div>
                    {pedido.sinal > 0 && (
                      <div className="text-sm font-medium text-orange-600">Restante: {formatCurrency(pedido.restante)}</div>
                    )}
                  </div>
                </div>
                <div className="border-t pt-2 mt-2">
                  {pedido.itens.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm mb-1">
                      <span>{item.produto.nome} x{item.quantidade}</span>
                      <span>{formatCurrency(item.total)}</span>
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
    const totalFinalizados = finalizados.reduce((sum, pedido) => sum + pedido.total, 0);
    const mediaTicket = finalizados.length > 0 ? totalFinalizados / finalizados.length : 0;
    return (
      <div className="min-h-screen bg-pink-50 p-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">Pedidos Finalizados</h2>
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="font-bold text-lg mb-4 text-center">💰 Dashboard Financeiro</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{finalizados.length}</div>
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
          {finalizados.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              Nenhum pedido finalizado ainda<br />
              <span className="text-sm">Finalize alguns pedidos para ver o dashboard!</span>
            </div>
          ) : (
            finalizados.map((pedido) => (
              <div key={pedido.id} className="bg-white p-4 rounded-lg shadow mb-4 border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-lg">{pedido.cliente || 'Cliente não informado'}</div>
                    <div className="text-sm text-gray-600">Entrega: {formatDate(pedido.dataEntrega)}</div>
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
                  {pedido.itens.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex justify-between text-sm mb-1">
                      <span>{item.produto.nome} x{item.quantidade}</span>
                      <span>{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                  {pedido.itens.length > 3 && (
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
    const totalVendas = finalizados.reduce((sum, pedido) => sum + pedido.total, 0);
    const pedidosHoje = pedidos.filter(p => {
      const hoje = new Date().toDateString();
      const dataEntrega = new Date(p.dataEntrega).toDateString();
      return dataEntrega === hoje;
    });
    const totalEntregasHoje = pedidosHoje.reduce((sum, pedido) => sum + pedido.total, 0);
    const totalPedidosAtivos = pedidos.reduce((sum, pedido) => sum + pedido.total, 0);
    const totalOrcamentos = orcamentos.reduce((sum, orcamento) => sum + orcamento.total, 0);
    const produtosMaisVendidos = {};
    finalizados.forEach(pedido => {
      pedido.itens.forEach(item => {
        if (produtosMaisVendidos[item.produto.nome]) {
          produtosMaisVendidos[item.produto.nome] += item.quantidade;
        } else {
          produtosMaisVendidos[item.produto.nome] = item.quantidade;
        }
      });
    });
    const topProdutos = Object.entries(produtosMaisVendidos)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    return (
      <div className="min-h-screen bg-pink-50 p-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-pink-800 mb-6">Relatórios</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalVendas)}</div>
              <div className="text-sm text-green-700">Total Vendido</div>
              <div className="text-xs text-green-600">{finalizados.length} pedidos</div>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalEntregasHoje)}</div>
              <div className="text-sm text-blue-700">Entregas Hoje</div>
              <div className="text-xs text-blue-600">{pedidosHoje.length} pedidos</div>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalPedidosAtivos)}</div>
              <div className="text-sm text-purple-700">Pedidos Ativos</div>
              <div className="text-xs text-purple-600">{pedidos.length} pedidos</div>
            </div>
            <div className="bg-orange-100 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(totalOrcamentos)}</div>
              <div className="text-sm text-orange-700">Orçamentos</div>
              <div className="text-xs text-orange-600">{orcamentos.length} pendentes</div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="font-bold text-lg mb-4">🏆 Top 5 Produtos</h3>
            {topProdutos.length === 0 ? (
              <div className="text-center text-gray-500">Nenhuma venda registrada ainda</div>
            ) : (
              topProdutos.map(([produto, quantidade], index) => (
                <div key={produto} className="flex justify-between items-center mb-2 p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-purple-600">#{index + 1}</span>
                    <span className="text-sm">{produto}</span>
                  </div>
                  <span className="font-bold text-green-600">{quantidade}x</span>
                </div>
              ))
            )}
          </div>
          {pedidosHoje.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
              <h3 className="font-bold text-lg mb-4">📅 Entregas de Hoje</h3>
              {pedidosHoje.map(pedido => (
                <div key={pedido.id} className="border-l-4 border-blue-500 pl-3 mb-3 bg-blue-50 p-2 rounded">
                  <div className="font-medium">{pedido.cliente || 'Cliente não informado'}</div>
                  <div className="text-sm text-gray-600">{formatCurrency(pedido.total)}</div>
                  {pedido.temaFesta && (
                    <div className="text-sm text-purple-600">🎉 {pedido.temaFesta}</div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded text-center">
            📊 <strong>Em breve:</strong> Gráficos detalhados, análise por período e muito mais!
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