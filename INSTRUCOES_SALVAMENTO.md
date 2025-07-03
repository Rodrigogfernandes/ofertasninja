# Sistema OfertasNinja_jp - Com Backend Node.js

## 🚀 Como Funciona o Sistema

### ✅ **Sistema Completo Implementado**

Agora o sistema possui um backend Node.js que salva os dados diretamente nos arquivos JSON no servidor, sem necessidade de downloads manuais!

### 🔧 **Configuração do Servidor**

#### **1. Instalar Dependências:**
```bash
npm install
```

#### **2. Iniciar o Servidor:**
```bash
npm start
```

#### **3. Acessar o Sistema:**
- **Site Principal:** http://localhost:3000
- **Painel Admin:** http://localhost:3000/admin

### 📁 **Estrutura do Projeto**

```
OfertasNinja_jp/
├── server.js              # Servidor Node.js
├── package.json           # Configurações do projeto
├── index.html             # Página principal
├── admin.html             # Painel de controle
├── script.js              # JavaScript principal
├── admin.js               # JavaScript do painel admin
├── styles.css             # Estilos principais
├── admin.css              # Estilos do painel admin
└── data/                  # Pasta com arquivos JSON
    ├── categorias.json    # Lista de categorias
    ├── cozinha.json       # Produtos da cozinha
    ├── eletronicos.json   # Produtos eletrônicos
    ├── infantil.json      # Produtos infantis
    ├── maquiagem.json     # Produtos de maquiagem
    └── esportes.json      # Produtos esportivos
```

### 🔄 **APIs do Servidor**

#### **Salvar Categorias:**
```javascript
POST /api/salvar-categorias
{
  "categorias": [...]
}
```

#### **Salvar Produtos:**
```javascript
POST /api/salvar-produtos
{
  "categoria": "Nome da Categoria",
  "arquivo": "arquivo.json",
  "dados": {...}
}
```

#### **Obter Categorias:**
```javascript
GET /api/categorias
```

#### **Obter Produtos:**
```javascript
GET /api/produtos/:arquivo
```

### 🎯 **Funcionalidades Automáticas**

#### **Criação de Categoria:**
- ✅ **Salvamento automático** no arquivo `categorias.json`
- ✅ **Criação automática** do arquivo de produtos da categoria
- ✅ **Notificação de sucesso** no painel admin
- ✅ **Atualização imediata** da interface

#### **Gerenciamento de Produtos:**
- ✅ **Salvamento direto** no arquivo da categoria
- ✅ **Validação automática** de dados
- ✅ **Cálculo automático** de desconto
- ✅ **Atualização em tempo real**

#### **Exclusão:**
- ✅ **Exclusão de categoria** remove produtos e arquivos
- ✅ **Exclusão de produto** atualiza arquivo da categoria
- ✅ **Confirmação** antes de excluir

### 🛠️ **Como Usar**

#### **1. Iniciar o Sistema:**
```bash
# Instalar dependências (apenas na primeira vez)
npm install

# Iniciar servidor
npm start
```

#### **2. Acessar o Painel Admin:**
1. Abra http://localhost:3000/admin
2. Use o painel para gerenciar categorias e produtos
3. Todos os dados são salvos automaticamente

#### **3. Visualizar o Site:**
1. Abra http://localhost:3000
2. Navegue pelas categorias
3. Veja os produtos em tempo real

### 📝 **Exemplo de Uso**

#### **Criar Nova Categoria:**
1. Acesse o painel admin
2. Clique em "Adicionar Categoria"
3. Preencha os dados
4. Clique em "Salvar Categoria"
5. ✅ Arquivo criado automaticamente!

#### **Adicionar Produto:**
1. No painel admin, clique em "Adicionar Produto"
2. Selecione a categoria
3. Preencha os dados do produto
4. Clique em "Salvar Produto"
5. ✅ Produto salvo automaticamente!

### 🔒 **Segurança e Backup**

- ✅ **Validação de dados** no servidor
- ✅ **Tratamento de erros** robusto
- ✅ **Logs detalhados** no console
- ✅ **Estrutura de arquivos** organizada

### 🎉 **Benefícios do Sistema**

- **Sem downloads manuais** - tudo salvo automaticamente
- **Interface intuitiva** - painel admin completo
- **Tempo real** - mudanças refletidas imediatamente
- **Escalável** - fácil adicionar novas funcionalidades
- **Robusto** - tratamento de erros e validações

### 🚀 **Próximos Passos**

Para melhorar ainda mais o sistema:
- Adicionar autenticação de usuários
- Implementar banco de dados
- Adicionar upload de imagens
- Criar sistema de backup automático
- Implementar cache para melhor performance

---

**🎯 Sistema completo e funcional!** Agora você pode gerenciar categorias e produtos diretamente no painel admin, e todos os dados são salvos automaticamente nos arquivos JSON no servidor. 