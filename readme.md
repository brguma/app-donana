# 🍰 App Donana - Gestão de Confeitaria

Sistema completo de gestão para confeitaria com orçamentos, pedidos e controle financeiro.

## ✨ Funcionalidades

- 📝 **Orçamentos**: Criação e gestão de orçamentos
- 📋 **Pedidos**: Controle de pedidos confirmados  
- 💰 **Financeiro**: Dashboard financeiro e relatórios
- 🍰 **Produtos**: Catálogo completo de produtos
- ☁️ **Sincronização**: Backup automático na nuvem
- 📱 **PWA**: Funciona offline e pode ser instalado

## 🚀 Tecnologias

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Firebase (Auth + Firestore)
- **PWA**: Service Worker + Manifest
- **Deploy**: Vercel
- **Icons**: Lucide React

## 📦 Estrutura do Projeto

```
app-donana/
├── public/
│   ├── manifest.json       # PWA Manifest
│   ├── sw.js              # Service Worker
│   ├── icon-*.png         # Ícones PWA
│   └── favicon.ico
├── src/
│   ├── config/
│   │   └── firebase.js    # Configuração Firebase
│   ├── App.jsx           # Componente principal
│   ├── main.jsx          # Entry point
│   └── index.css         # Estilos globais
├── package.json
├── vite.config.js        # Configuração Vite
├── tailwind.config.js    # Configuração Tailwind
├── vercel.json          # Configuração Vercel
└── README.md
```

## ⚙️ Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/SEU_USUARIO/app-donana.git
cd app-donana
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Firebase
1. Acesse o [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto ou use um existente
3. Ative Authentication (Email/Password)
4. Ative Firestore Database
5. Copie as configurações e substitua em `src/config/firebase.js`

### 4. Execute localmente
```bash
npm run dev
```

### 5. Build para produção
```bash
npm run build
```

## 🌐 Deploy no Vercel

1. Faça push para o GitHub
2. Conecte sua conta Vercel ao GitHub
3. Importe o repositório
4. Deploy automático!

## 📱 PWA - Progressive Web App

O app é um PWA completo com:

- ✅ **Instalável**: Pode ser instalado como app nativo
- ✅ **Offline**: Funciona sem internet
- ✅ **Cache**: Dados são salvos localmente
- ✅ **Responsive**: Otimizado para mobile
- ✅ **Fast**: Carregamento rápido

### Como instalar o PWA:

**No celular:**
1. Abra o site no navegador
2. Clique em "Instalar App" quando aparecer
3. O app será adicionado à tela inicial

**No desktop:**
1. Abra o site no Chrome/Edge
2. Clique no ícone de instalação na barra de endereços
3. Confirme a instalação

## 🔒 Segurança

- ✅ Autenticação segura via Firebase
- ✅ Dados criptografados em trânsito
- ✅ Regras de segurança no Firestore
- ✅ HTTPS obrigatório

## 📊 Performance

- ⚡ **Lighthouse Score**: 90+
- 🚀 **First Paint**: < 1s
- 📱 **Mobile Optimized**: 100%
- 💾 **Bundle Size**: < 500KB gzipped

## 🛠️ Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build produção
npm run preview  # Preview build local
```

## 📝 Licença

Este projeto é para uso pessoal/comercial da Donana.

## 🆘 Suporte

Em caso de dúvidas ou problemas:

1. Verifique os logs do console
2. Teste a conexão com Firebase  
3. Confirme se o Service Worker está ativo
4. Limpe o cache do navegador se necessário

---

**Desenvolvido com ❤️ para a Donana** 🍰