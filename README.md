# OfertasNinja_jp 🚀

Uma plataforma moderna e dinâmica para exibição de ofertas e produtos organizados por categorias, com painel de controle administrativo completo.

## ✨ Características Principais

### 🎯 Site Principal
- **Carrossel de Categorias**: Navegação intuitiva entre diferentes nichos de produtos
- **Grade Dinâmica**: Exibição responsiva de produtos com informações detalhadas
- **Modal Interativo**: Visualização detalhada de produtos com preços e descontos
- **Design Futurista**: Interface moderna com efeitos visuais e animações
- **Responsivo**: Otimizado para todos os dispositivos

### 🛠️ Painel de Controle
- **Gestão de Categorias**: Adicionar, editar e remover categorias de produtos
- **Gestão de Produtos**: CRUD completo para produtos com imagens e preços
- **Backup e Restauração**: Exportar e importar dados do sistema
- **Interface Intuitiva**: Navegação por abas e formulários organizados

### 📊 Estrutura de Dados
- **Arquivos JSON**: Cada categoria possui seu próprio arquivo de dados
- **Organização Modular**: Separação clara entre categorias e produtos
- **Escalabilidade**: Fácil adição de novas categorias e produtos

## 🏗️ Estrutura do Projeto

```
OfertasNinja_jp/
├── index.html              # Página principal
├── admin.html              # Painel de controle
├── styles.css              # Estilos do site principal
├── admin.css               # Estilos do painel de controle
├── script.js               # JavaScript do site principal
├── admin.js                # JavaScript do painel de controle
├── data/                   # Dados das categorias
│   ├── categorias.json     # Configuração principal
│   ├── cozinha.json        # Produtos de cozinha
│   ├── eletronicos.json    # Produtos eletrônicos
│   ├── infantil.json       # Produtos infantis
│   └── maquiagem.json      # Produtos de maquiagem
├── src/                    # Recursos estáticos
│   ├── avatar/             # Imagens do avatar
│   └── favcon/             # Favicon
└── README.md               # Documentação
```

## 🚀 Como Usar

### 1. Acessando o Site Principal
1. Abra `index.html` no navegador
2. Navegue pelas categorias no carrossel
3. Clique em uma categoria para ver os produtos
4. Clique em um produto para ver detalhes completos

### 2. Acessando o Painel de Controle
1. Clique no botão "Painel de Controle" no site principal
2. Ou acesse diretamente `admin.html`

### 3. Gerenciando Categorias
1. Vá para a aba "Categorias"
2. Clique em "Nova Categoria" para adicionar
3. Preencha os campos:
   - **ID**: Identificador único (ex: "esportes")
   - **Nome**: Nome da categoria (ex: "Esportes")
   - **Ícone**: Emoji representativo (ex: "⚽")
   - **Cor**: Cor da categoria em hexadecimal
   - **Descrição**: Descrição da categoria

### 4. Gerenciando Produtos
1. Vá para a aba "Produtos"
2. Clique em "Novo Produto" para adicionar
3. Preencha os campos:
   - **Categoria**: Selecione a categoria do produto
   - **Título**: Nome do produto
   - **Descrição**: Descrição detalhada
   - **Preço Atual**: Preço com desconto
   - **Preço Original**: Preço sem desconto
   - **URL da Imagem**: Link da imagem do produto
   - **Link da Oferta**: Link para compra

### 5. Backup e Restauração
1. Vá para a aba "Configurações"
2. **Exportar**: Clique em "Exportar Dados" para baixar backup
3. **Importar**: Clique em "Importar Dados" para restaurar backup

## 🎨 Personalização

### Cores e Temas
As cores principais podem ser alteradas editando as variáveis CSS em `styles.css`:

```css
:root {
    --primary-color: #00d4ff;    /* Cor principal */
    --secondary-color: #0099cc;  /* Cor secundária */
    --accent-color: #ff6b6b;     /* Cor de destaque */
    --background-dark: #0a0a0a;  /* Fundo escuro */
    --background-light: #1a1a1a; /* Fundo claro */
}
```

### Adicionando Novas Categorias
1. Crie um novo arquivo JSON em `data/` (ex: `esportes.json`)
2. Adicione a categoria em `data/categorias.json`
3. Use o painel de controle para gerenciar os produtos

### Estrutura do Arquivo de Categoria
```json
{
  "categoria": "Nome da Categoria",
  "icone": "🎯",
  "cor": "#FF6B6B",
  "itens": [
    {
      "id": 1,
      "titulo": "Nome do Produto",
      "descricao": "Descrição do produto",
      "preco": "R$ 99,90",
      "precoOriginal": "R$ 149,90",
      "desconto": "33%",
      "imagem": "URL_DA_IMAGEM",
      "link": "LINK_DA_OFERTA"
    }
  ]
}
```

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com Grid e Flexbox
- **JavaScript ES6+**: Funcionalidades dinâmicas
- **Font Awesome**: Ícones
- **Google Fonts**: Tipografia (Orbitron, Rajdhani)

## 📱 Responsividade

O site é totalmente responsivo e funciona em:
- 📱 Smartphones
- 📱 Tablets
- 💻 Desktops
- 🖥️ Monitores grandes

## 🎯 Funcionalidades Avançadas

### Efeitos Visuais
- **Partículas Animadas**: Fundo dinâmico com partículas flutuantes
- **Hover 3D**: Efeito 3D nos cards de produtos
- **Animações Suaves**: Transições e animações CSS
- **Gradientes Dinâmicos**: Cores que mudam com animação

### Interatividade
- **Modal Dinâmico**: Visualização detalhada de produtos
- **Navegação Fluida**: Transições suaves entre categorias
- **Filtros**: Filtro de produtos por categoria no painel
- **Notificações**: Sistema de notificações no painel

### Performance
- **Carregamento Lazy**: Produtos carregados sob demanda
- **Otimização de Imagens**: Imagens responsivas
- **Cache Inteligente**: Sistema de cache para melhor performance

## 🚀 Deploy

### Hospedagem Local
1. Clone o repositório
2. Abra `index.html` no navegador
3. Para funcionalidade completa, use um servidor local

### Servidor Local (Recomendado)
```bash
# Usando Python
python -m http.server 8000

# Usando Node.js
npx serve .

# Usando PHP
php -S localhost:8000
```

### Hospedagem Online
- **GitHub Pages**: Deploy automático
- **Netlify**: Deploy com drag & drop
- **Vercel**: Deploy com integração Git
- **Firebase Hosting**: Deploy do Google

## 🔒 Segurança

### Recomendações
- Implemente autenticação no painel de controle
- Valide dados de entrada
- Use HTTPS em produção
- Implemente rate limiting
- Faça backup regular dos dados

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- **Instagram**: [@ofertasninja_jp](https://www.instagram.com/ofertasninja_jp/)
- **Email**: [seu-email@exemplo.com]
- **Issues**: Use o GitHub Issues para reportar bugs

## 🎉 Agradecimentos

- Font Awesome pelos ícones
- Google Fonts pelas tipografias
- Comunidade open source

---

**Desenvolvido com ❤️ para facilitar a descoberta de ofertas incríveis!** 