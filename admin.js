// Painel de Controle OfertasNinja_jp

class AdminPanel {
    constructor() {
        this.categorias = [];
        this.produtos = [];
        this.categoriaEditando = null;
        this.produtoEditando = null;
        this.init();
    }

    async init() {
        await this.carregarDados();
        this.setupEventListeners();
        this.setupModais();
        this.setupNavegacao();
        this.renderizarCategorias();
        this.renderizarProdutos();
        this.carregarConfiguracoesSite();
        this.carregarRedesSociais();
        this.atualizarFiltroCategorias();
    }

    async carregarDados() {
        try {
            // Carregar categorias da API
            const categoriasResponse = await fetch('/api/categorias');
            const categoriasData = await categoriasResponse.json();
            this.categorias = categoriasData.categorias || [];

            // Carregar produtos de todas as categorias
            this.produtos = [];
            for (const categoria of this.categorias) {
                try {
                    const produtosResponse = await fetch(`/api/produtos/${categoria.arquivo}`);
                    const produtosData = await produtosResponse.json();
                    if (produtosData.itens) {
                        this.produtos.push(...produtosData.itens.map(produto => ({
                            ...produto,
                            categoriaId: categoria.id
                        })));
                    }
                } catch (error) {
                    console.error(`Erro ao carregar produtos da categoria ${categoria.id}:`, error);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.mostrarNotificacao('Erro ao carregar dados', 'error');
        }
    }

    setupEventListeners() {
        // Navegação
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => this.mudarAba(tab.dataset.tab));
        });

        // Botões de categoria
        document.getElementById('addCategoriaBtn').addEventListener('click', () => this.abrirModalCategoria());
        document.getElementById('categoriaForm').addEventListener('submit', (e) => this.salvarCategoria(e));

        // Botões de produto
        document.getElementById('addProdutoBtn').addEventListener('click', () => this.abrirModalProduto());
        document.getElementById('produtoForm').addEventListener('submit', (e) => this.salvarProduto(e));

        // Filtro de categoria
        document.getElementById('categoriaFilter').addEventListener('change', (e) => this.filtrarProdutos(e.target.value));

        // Configurações
        document.getElementById('exportarBtn').addEventListener('click', () => this.exportarDados());
        document.getElementById('importarBtn').addEventListener('click', () => this.importarDados());
        document.getElementById('limparCacheBtn').addEventListener('click', () => this.limparCache());
        document.getElementById('resetarBtn').addEventListener('click', () => this.resetarDados());
        document.getElementById('resetarConfigBtn').addEventListener('click', () => this.resetarConfiguracoesFabrica());

        // Modais
        this.setupModais();

        // Configurações do tema
        const editThemeForm = document.getElementById('editThemeForm');
        const themeConfigMsg = document.getElementById('themeConfigMsg');
        if (editThemeForm) {
            editThemeForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                const tema = document.getElementById('temaPrincipal').value;
                try {
                    const resp = await fetch('/api/tema', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ tema })
                    });
                    if (resp.ok) {
                        themeConfigMsg.textContent = 'Tema salvo com sucesso!';
                        themeConfigMsg.style.color = '#4CAF50';
                        themeConfigMsg.style.display = 'block';
                    } else {
                        const data = await resp.json();
                        themeConfigMsg.textContent = data.message || 'Erro ao salvar tema.';
                        themeConfigMsg.style.color = '#ff6b6b';
                        themeConfigMsg.style.display = 'block';
                    }
                } catch (err) {
                    themeConfigMsg.textContent = 'Erro ao conectar ao servidor.';
                    themeConfigMsg.style.color = '#ff6b6b';
                    themeConfigMsg.style.display = 'block';
                }
            });
        }

        // Configurações do site
        const editSiteConfigForm = document.getElementById('editSiteConfigForm');
        const siteConfigMsg = document.getElementById('siteConfigMsg');
        if (editSiteConfigForm) {
            editSiteConfigForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                const formData = new FormData(editSiteConfigForm);
                const success = await adminPanel.salvarConfiguracoesSite(formData);
                if (success) {
                    siteConfigMsg.textContent = 'Configurações salvas com sucesso!';
                    siteConfigMsg.style.color = '#4CAF50';
                    siteConfigMsg.style.display = 'block';
                    editSiteConfigForm.reset();
                    adminPanel.carregarConfiguracoesSite();
                } else {
                    siteConfigMsg.textContent = 'Erro ao salvar configurações.';
                    siteConfigMsg.style.color = '#ff6b6b';
                    siteConfigMsg.style.display = 'block';
                }
            });
        }

        // Redes sociais
        const saveSocialLinksBtn = document.getElementById('saveSocialLinks');
        const socialConfigMsg = document.getElementById('socialConfigMsg');
        if (saveSocialLinksBtn) {
            saveSocialLinksBtn.addEventListener('click', async function() {
                const success = await adminPanel.salvarRedesSociais();
                if (success) {
                    socialConfigMsg.textContent = 'Redes sociais salvas com sucesso!';
                    socialConfigMsg.style.color = '#4CAF50';
                    socialConfigMsg.style.display = 'block';
                } else {
                    socialConfigMsg.textContent = 'Erro ao salvar redes sociais.';
                    socialConfigMsg.style.color = '#ff6b6b';
                    socialConfigMsg.style.display = 'block';
                }
            });
        }

        // Botões de remover redes sociais
        const removeSocialBtns = document.querySelectorAll('.btn-remove-social');
        removeSocialBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const social = this.dataset.social;
                const input = document.getElementById(`${social}Link`);
                if (input) {
                    input.value = '';
                }
            });
        });

        // Evento de logout para o botão do HTML
        const btnLogout = document.getElementById('btnLogout');
        if (btnLogout) {
            btnLogout.addEventListener('click', function() {
                painelConteudo.style.display = 'none';
                loginContainer.style.display = 'flex';
                loginForm.reset();
                loginError.style.display = 'none';
            });
        }

        // Editar login/senha
        const editLoginForm = document.getElementById('editLoginForm');
        const loginConfigMsg = document.getElementById('loginConfigMsg');
        if (editLoginForm) {
            editLoginForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                const novoUsuario = document.getElementById('novoUsuario').value.trim();
                const novaSenha = document.getElementById('novaSenha').value;
                const confirmarSenha = document.getElementById('confirmarSenha').value;
                
                // Validações
                if (novoUsuario.length < 3) {
                    loginConfigMsg.textContent = 'Usuário deve ter pelo menos 3 caracteres.';
                    loginConfigMsg.style.color = '#ff6b6b';
                    loginConfigMsg.style.display = 'block';
                    return;
                }
                
                if (novaSenha.length < 3) {
                    loginConfigMsg.textContent = 'Senha deve ter pelo menos 3 caracteres.';
                    loginConfigMsg.style.color = '#ff6b6b';
                    loginConfigMsg.style.display = 'block';
                    return;
                }
                
                if (novaSenha !== confirmarSenha) {
                    loginConfigMsg.textContent = 'As senhas não coincidem. Por favor, confirme a senha corretamente.';
                    loginConfigMsg.style.color = '#ff6b6b';
                    loginConfigMsg.style.display = 'block';
                    return;
                }
                
                try {
                    const resp = await fetch('/api/credenciais', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: novoUsuario, pass: novaSenha })
                    });
                    if (resp.ok) {
                        loginConfigMsg.textContent = 'Login e senha atualizados com sucesso!';
                        loginConfigMsg.style.color = '#4CAF50';
                        loginConfigMsg.style.display = 'block';
                        editLoginForm.reset();
                    } else {
                        const data = await resp.json();
                        loginConfigMsg.textContent = data.message || 'Erro ao atualizar login.';
                        loginConfigMsg.style.color = '#ff6b6b';
                        loginConfigMsg.style.display = 'block';
                    }
                } catch (err) {
                    loginConfigMsg.textContent = 'Erro ao conectar ao servidor.';
                    loginConfigMsg.style.color = '#ff6b6b';
                    loginConfigMsg.style.display = 'block';
                }
            });
        }
    }

    setupModais() {
        // Modal de categoria
        const categoriaModal = document.getElementById('categoriaModal');
        document.getElementById('closeCategoriaModal').addEventListener('click', () => this.fecharModal(categoriaModal));
        document.getElementById('cancelarCategoria').addEventListener('click', () => this.fecharModal(categoriaModal));

        // Modal de produto
        const produtoModal = document.getElementById('produtoModal');
        document.getElementById('closeProdutoModal').addEventListener('click', () => this.fecharModal(produtoModal));
        document.getElementById('cancelarProduto').addEventListener('click', () => this.fecharModal(produtoModal));

        // Modal de confirmação
        const confirmModal = document.getElementById('confirmModal');
        document.getElementById('closeConfirmModal').addEventListener('click', () => this.fecharModal(confirmModal));
        document.getElementById('cancelarConfirmacao').addEventListener('click', () => this.fecharModal(confirmModal));

        // Fechar modais clicando fora
        [categoriaModal, produtoModal, confirmModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.fecharModal(modal);
                }
            });
        });

        // Fechar modais com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.fecharModal(categoriaModal);
                this.fecharModal(produtoModal);
                this.fecharModal(confirmModal);
            }
        });
    }

    setupNavegacao() {
        const navTabs = document.querySelectorAll('.nav-tab');
        const tabContents = document.querySelectorAll('.tab-content');

        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Atualizar navegação
                navTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Mostrar conteúdo da aba
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${targetTab}-tab`) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    mudarAba(tabName) {
        const navTabs = document.querySelectorAll('.nav-tab');
        const tabContents = document.querySelectorAll('.tab-content');
        
        navTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            }
        });

        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabName}-tab`) {
                content.classList.add('active');
            }
        });
    }

    atualizarFiltroCategorias() {
        const categoriaFilter = document.getElementById('categoriaFilter');
        const produtoCategoria = document.getElementById('produtoCategoria');
        
        if (categoriaFilter) {
            categoriaFilter.innerHTML = '<option value="">Todas as Categorias</option>';
            this.categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id;
                option.textContent = categoria.nome;
                categoriaFilter.appendChild(option);
            });
        }

        if (produtoCategoria) {
            produtoCategoria.innerHTML = '<option value="">Selecione uma categoria</option>';
            this.categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id;
                option.textContent = categoria.nome;
                produtoCategoria.appendChild(option);
            });
        }
    }

    renderizarCategorias() {
        const grid = document.getElementById('categoriasGrid');
        if (!grid) return;

        grid.innerHTML = '';
        
        this.categorias.forEach(categoria => {
            const card = document.createElement('div');
            card.className = 'categoria-card';
            
            let visual;
            if (categoria.imagem) {
                visual = `<img src="${categoria.imagem}" alt="${categoria.nome}" class="categoria-img" style="background:${categoria.cor};">`;
            } else {
                visual = `<div class="categoria-icon" style="background: ${categoria.cor}">${categoria.icone}</div>`;
            }

            card.innerHTML = `
                <div class="categoria-header">
                    ${visual}
                    <div class="categoria-info">
                        <h3>${categoria.nome}</h3>
                        <p>${categoria.descricao}</p>
                    </div>
                </div>
                <div class="categoria-actions">
                    <button class="btn-secondary" onclick="adminPanel.editarCategoria('${categoria.id}')">
                        <i class="fas fa-edit"></i>
                        Editar
                    </button>
                    <button class="btn-danger" onclick="adminPanel.excluirCategoria('${categoria.id}')">
                        <i class="fas fa-trash"></i>
                        Excluir
                    </button>
                </div>
            `;

            grid.appendChild(card);
        });
    }

    renderizarProdutos(filtroCategoria = '') {
        const grid = document.getElementById('produtosGrid');
        if (!grid) return;

        grid.innerHTML = '';
        
        let produtosFiltrados = this.produtos;
        if (filtroCategoria) {
            produtosFiltrados = this.produtos.filter(produto => produto.categoriaId === filtroCategoria);
        }
        
        produtosFiltrados.forEach(produto => {
            const categoria = this.categorias.find(cat => cat.id === produto.categoriaId);
            const card = document.createElement('div');
            card.className = 'produto-card';
            
            let mediaHtml = '';
            if (produto.imagem && /\.(mp4|webm|ogg)$/i.test(produto.imagem)) {
                mediaHtml = `
                    <div class="produto-media-wrapper" style="position:relative;width:100%;height:140px;overflow:hidden;">
                        <video src="${produto.imagem}" class="produto-image" controls style="width:100%;height:100%;object-fit:cover;border-radius:8px 8px 0 0;"></video>
                        <span class="produto-discount-overlay" style="position:absolute;top:8px;right:8px;background:#ff4d4f;color:#fff;font-size:0.95rem;font-weight:700;border-radius:6px;padding:2px 8px;z-index:2;">${produto.desconto} OFF</span>
                    </div>`;
            } else {
                mediaHtml = `
                    <div class="produto-media-wrapper" style="position:relative;width:100%;height:140px;overflow:hidden;">
                        <img src="${produto.imagem}" alt="${produto.titulo}" class="produto-image" style="width:100%;height:100%;object-fit:cover;border-radius:8px 8px 0 0;">
                        <span class="produto-discount-overlay" style="position:absolute;top:8px;right:8px;background:#ff4d4f;color:#fff;font-size:0.95rem;font-weight:700;border-radius:6px;padding:2px 8px;z-index:2;">${produto.desconto} OFF</span>
                    </div>`;
            }
            card.innerHTML = `
                ${mediaHtml}
                <div class="produto-info">
                    <h3>${produto.titulo}</h3>
                    <p>${produto.descricao}</p>
                    <div class="produto-prices">
                        <span class="produto-price">${produto.preco}</span>
                        <span class="produto-original-price">${produto.precoOriginal}</span>
                    </div>
                    <p><strong>Categoria:</strong> ${categoria ? categoria.nome : 'N/A'}</p>
                </div>
                <div class="produto-actions">
                    <button class="btn-secondary" onclick="adminPanel.editarProduto(${produto.id})">
                        <i class="fas fa-edit"></i>
                        Editar
                    </button>
                    <button class="btn-danger" onclick="adminPanel.excluirProduto(${produto.id})">
                        <i class="fas fa-trash"></i>
                        Excluir
                    </button>
                </div>
            `;

            grid.appendChild(card);
        });
    }

    filtrarProdutos(categoriaId) {
        this.renderizarProdutos(categoriaId);
    }

    abrirModalCategoria(categoria = null) {
        this.categoriaEditando = categoria;
        const modal = document.getElementById('categoriaModal');
        const form = document.getElementById('categoriaForm');
        const title = document.getElementById('categoriaModalTitle');

        if (categoria) {
            title.textContent = 'Editar Categoria';
            form.nome.value = categoria.nome;
            form.icone.value = categoria.icone;
            form.cor.value = categoria.cor;
            form.descricao.value = categoria.descricao;
        } else {
            title.textContent = 'Nova Categoria';
            form.reset();
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    abrirModalProduto(produto = null) {
        this.produtoEditando = produto;
        const modal = document.getElementById('produtoModal');
        const form = document.getElementById('produtoForm');
        const title = document.getElementById('produtoModalTitle');
        const categoriaSelect = document.getElementById('produtoCategoria');

        // Preencher select de categorias
        categoriaSelect.innerHTML = '<option value="">Selecione uma categoria</option>';
        this.categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nome;
            categoriaSelect.appendChild(option);
        });

        if (produto) {
            title.textContent = 'Editar Produto';
            form.categoria.value = produto.categoriaId;
            form.titulo.value = produto.titulo;
            form.descricao.value = produto.descricao;
            form.preco.value = produto.preco;
            form.precoOriginal.value = produto.precoOriginal;
            form.imagem.value = produto.imagem;
            form.link.value = produto.link;
        } else {
            title.textContent = 'Novo Produto';
            form.reset();
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    async salvarCategoria(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        let categoriaId = this.categoriaEditando ? this.categoriaEditando.id : 'categoria_' + Date.now();
        const nomeCategoria = formData.get('nome').trim();

        // Verificar se já existe categoria com mesmo nome ou id (ignorando maiúsculas/minúsculas)
        if (!this.categoriaEditando) {
            const existe = this.categorias.some(cat => cat.nome.trim().toLowerCase() === nomeCategoria.toLowerCase() || cat.id === categoriaId);
            if (existe) {
                this.mostrarNotificacao('Já existe uma categoria com esse nome ou id!', 'error');
                return;
            }
        }

        // Lógica para imagem/ícone
        let imagem = '';
        let icone = formData.get('icone').trim();
        const imagemUpload = document.getElementById('categoriaImagem').files[0];
        const imagemLink = formData.get('imagemLink').trim();

        if (imagemUpload) {
            // Upload prioritário
            const uploadForm = new FormData();
            uploadForm.append('imagem', imagemUpload);
            try {
                const resp = await fetch('/api/upload-categoria-img', {
                    method: 'POST',
                    body: uploadForm
                });
                const data = await resp.json();
                if (data.success) {
                    imagem = data.url;
                } else {
                    this.mostrarNotificacao('Erro ao fazer upload da imagem.', 'error');
                    return;
                }
            } catch (err) {
                this.mostrarNotificacao('Erro ao enviar imagem.', 'error');
                return;
            }
        } else if (imagemLink) {
            imagem = imagemLink;
        }
        // Se não houver imagem, pode ser emoji/ícone
        if (!imagem && !icone) {
            this.mostrarNotificacao('Informe um emoji/ícone ou uma imagem para a categoria.', 'error');
            return;
        }

        const categoriaData = {
            id: categoriaId,
            nome: nomeCategoria,
            icone: icone,
            imagem: imagem,
            cor: formData.get('cor'),
            descricao: formData.get('descricao'),
            arquivo: `${categoriaId}.json`
        };

        try {
            let novaCategoria = false;
            if (this.categoriaEditando) {
                const index = this.categorias.findIndex(cat => cat.id === this.categoriaEditando.id);
                if (index !== -1) {
                    this.categorias[index] = categoriaData;
                }
            } else {
                this.categorias.push(categoriaData);
                novaCategoria = true;
            }

            await this.salvarCategorias();

            if (novaCategoria) {
                const arquivoProdutos = {
                    categoria: categoriaData.nome,
                    icone: categoriaData.icone,
                    imagem: categoriaData.imagem,
                    cor: categoriaData.cor,
                    itens: []
                };
                await this.salvarArquivo(`/data/${categoriaData.arquivo}`, arquivoProdutos);
            }

            this.renderizarCategorias();
            this.atualizarFiltroCategorias();
            this.fecharModal(document.getElementById('categoriaModal'));

            if (this.categoriaEditando) {
                this.mostrarNotificacao('Categoria atualizada com sucesso!', 'success');
            } else {
                this.mostrarNotificacao('Categoria criada com sucesso! Arquivo de produtos também foi criado.', 'success');
            }
        } catch (error) {
            console.error('Erro ao salvar categoria:', error);
            this.mostrarNotificacao('Erro ao salvar categoria', 'error');
        }
    }

    async salvarProduto(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const produtoData = {
            id: this.produtoEditando ? this.produtoEditando.id : Date.now(),
            titulo: formData.get('titulo'),
            descricao: formData.get('descricao'),
            preco: formData.get('preco'),
            precoOriginal: formData.get('precoOriginal'),
            imagem: formData.get('imagem'),
            link: formData.get('link'),
            categoriaId: formData.get('categoria')
        };

        // Calcular desconto
        const precoAtual = parseFloat(produtoData.preco.replace(/[^\d,]/g, '').replace(',', '.'));
        const precoOriginal = parseFloat(produtoData.precoOriginal.replace(/[^\d,]/g, '').replace(',', '.'));
        const desconto = Math.round(((precoOriginal - precoAtual) / precoOriginal) * 100);
        produtoData.desconto = `${desconto}%`;

        try {
            // Encontrar a categoria
            const categoria = this.categorias.find(cat => cat.id === produtoData.categoriaId);
            if (!categoria) {
                throw new Error('Categoria não encontrada');
            }

            if (this.produtoEditando) {
                // Editar produto existente
                const index = this.produtos.findIndex(prod => prod.id === this.produtoEditando.id);
                if (index !== -1) {
                    this.produtos[index] = produtoData;
                }
            } else {
                // Novo produto
                this.produtos.push(produtoData);
            }

            // Salvar produtos da categoria específica
            await this.salvarProdutosCategoria(categoria, produtoData.categoriaId);
            
            this.renderizarProdutos();
            this.fecharModal(document.getElementById('produtoModal'));
            this.mostrarNotificacao('Produto salvo com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            this.mostrarNotificacao('Erro ao salvar produto: ' + error.message, 'error');
        }
    }

    async salvarProdutosCategoria(categoria, categoriaId) {
        // Filtrar produtos da categoria específica
        const produtosCategoria = this.produtos
            .filter(prod => prod.categoriaId === categoriaId)
            .map(prod => {
                const { categoriaId, ...produtoSemCategoria } = prod;
                return produtoSemCategoria;
            });

        // Criar estrutura do arquivo
        const arquivoProdutos = {
            categoria: categoria.nome,
            icone: categoria.icone,
            cor: categoria.cor,
            itens: produtosCategoria
        };

        // Salvar arquivo da categoria
        await this.salvarArquivo(`/data/${categoria.arquivo}`, arquivoProdutos);
    }

    editarCategoria(categoriaId) {
        const categoria = this.categorias.find(cat => cat.id === categoriaId);
        if (categoria) {
            this.abrirModalCategoria(categoria);
        }
    }

    editarProduto(produtoId) {
        const produto = this.produtos.find(prod => prod.id === produtoId);
        if (produto) {
            this.abrirModalProduto(produto);
        }
    }

    async excluirCategoria(categoriaId) {
        const categoria = this.categorias.find(cat => cat.id === categoriaId);
        if (!categoria) return;

        const confirmou = await this.confirmarAcao(
            'Excluir Categoria',
            `Tem certeza que deseja excluir a categoria "${categoria.nome}"? Esta ação também excluirá todos os produtos desta categoria.`
        );

        if (confirmou) {
            try {
                // Remover categoria
                this.categorias = this.categorias.filter(cat => cat.id !== categoriaId);
                
                // Remover produtos da categoria
                this.produtos = this.produtos.filter(prod => prod.categoriaId !== categoriaId);

                // Salvar arquivos atualizados
                await this.salvarCategorias();
                
                // Criar arquivo vazio para a categoria excluída (ou informar sobre exclusão)
                const arquivoVazio = {
                    categoria: categoria.nome,
                    icone: categoria.icone,
                    cor: categoria.cor,
                    itens: []
                };
                
                // Salvar arquivo vazio (ou você pode optar por não salvar nada)
                await this.salvarArquivo(`/data/${categoria.arquivo}`, arquivoVazio);
                
                this.renderizarCategorias();
                this.renderizarProdutos();
                this.atualizarFiltroCategorias();
                this.mostrarNotificacao('Categoria excluída com sucesso!', 'success');
            } catch (error) {
                console.error('Erro ao excluir categoria:', error);
                this.mostrarNotificacao('Erro ao excluir categoria', 'error');
            }
        }
    }

    async excluirProduto(produtoId) {
        const produto = this.produtos.find(prod => prod.id === produtoId);
        if (!produto) return;

        const confirmou = await this.confirmarAcao(
            'Excluir Produto',
            `Tem certeza que deseja excluir o produto "${produto.titulo}"?`
        );

        if (confirmou) {
            try {
                // Encontrar a categoria do produto
                const categoria = this.categorias.find(cat => cat.id === produto.categoriaId);
                if (!categoria) {
                    throw new Error('Categoria do produto não encontrada');
                }

                // Remover produto
                this.produtos = this.produtos.filter(prod => prod.id !== produtoId);
                
                // Salvar arquivo da categoria atualizado
                await this.salvarProdutosCategoria(categoria, produto.categoriaId);
                
                this.renderizarProdutos();
                this.mostrarNotificacao('Produto excluído com sucesso!', 'success');
            } catch (error) {
                console.error('Erro ao excluir produto:', error);
                this.mostrarNotificacao('Erro ao excluir produto: ' + error.message, 'error');
            }
        }
    }

    async salvarArquivo(caminho, dados) {
        try {
            const nomeArquivo = caminho.split('/').pop();
            
            if (nomeArquivo === 'categorias.json') {
                // Salvar categorias
                const response = await fetch('/api/salvar-categorias', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ categorias: dados.categorias })
                });
                
                const result = await response.json();
                if (!result.success) {
                    throw new Error(result.message);
                }
                
                console.log('Categorias salvas com sucesso!');
                return true;
            } else {
                // Salvar produtos de uma categoria
                const categoria = this.categorias.find(cat => cat.arquivo === nomeArquivo);
                if (!categoria) {
                    throw new Error('Categoria não encontrada');
                }
                
                const response = await fetch('/api/salvar-produtos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        categoria: categoria.nome,
                        arquivo: nomeArquivo,
                        dados: dados
                    })
                });
                
                const result = await response.json();
                if (!result.success) {
                    throw new Error(result.message);
                }
                
                console.log(`Produtos da categoria ${categoria.nome} salvos com sucesso!`);
                return true;
            }
        } catch (error) {
            console.error(`Erro ao salvar arquivo ${caminho}:`, error);
            throw error;
        }
    }

    async salvarCategorias() {
        const data = { categorias: this.categorias };
        await this.salvarArquivo('/data/categorias.json', data);
    }

    async salvarProdutos() {
        // Agrupar produtos por categoria
        const produtosPorCategoria = {};
        this.produtos.forEach(produto => {
            if (!produtosPorCategoria[produto.categoriaId]) {
                produtosPorCategoria[produto.categoriaId] = [];
            }
            const { categoriaId, ...produtoSemCategoria } = produto;
            produtosPorCategoria[produto.categoriaId].push(produtoSemCategoria);
        });

        // Salvar arquivo para cada categoria
        for (const [categoriaId, produtos] of Object.entries(produtosPorCategoria)) {
            const categoria = this.categorias.find(cat => cat.id === categoriaId);
            if (categoria) {
                const data = {
                    categoria: categoria.nome,
                    icone: categoria.icone,
                    cor: categoria.cor,
                    itens: produtos
                };
                await this.salvarArquivo(`/data/${categoria.arquivo}`, data);
            }
        }
    }

    async exportarDados() {
        try {
            const dados = {
                categorias: this.categorias,
                produtos: this.produtos,
                exportadoEm: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ofertasninja_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.mostrarNotificacao('Dados exportados com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao exportar dados:', error);
            this.mostrarNotificacao('Erro ao exportar dados', 'error');
        }
    }

    async importarDados() {
        const input = document.getElementById('importFile');
        input.click();

        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const texto = await file.text();
                const dados = JSON.parse(texto);

                if (dados.categorias && dados.produtos) {
                    this.categorias = dados.categorias;
                    this.produtos = dados.produtos;

                    await this.salvarCategorias();
                    await this.salvarProdutos();
                    this.renderizarCategorias();
                    this.renderizarProdutos();
                    this.atualizarFiltroCategorias();

                    this.mostrarNotificacao('Dados importados com sucesso!', 'success');
                } else {
                    throw new Error('Formato de arquivo inválido');
                }
            } catch (error) {
                console.error('Erro ao importar dados:', error);
                this.mostrarNotificacao('Erro ao importar dados. Verifique o formato do arquivo.', 'error');
            }

            input.value = '';
        });
    }

    async limparCache() {
        try {
            // Limpar cache do navegador
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
            }

            // Limpar localStorage
            localStorage.clear();

            this.mostrarNotificacao('Cache limpo com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao limpar cache:', error);
            this.mostrarNotificacao('Erro ao limpar cache', 'error');
        }
    }

    async resetarDados() {
        const confirmado = await this.confirmarAcao(
            'Resetar Dados',
            'Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.'
        );

        if (confirmado) {
            try {
                // Resetar categorias
                this.categorias = [];
                await this.salvarCategorias();

                // Resetar produtos
                this.produtos = [];
                await this.salvarProdutos();

                // Resetar configurações do site
                await this.salvarArquivo('data/site_config.json', {
                    title: 'OfertasNinja_jp',
                    avatar: '/src/avatar/IMG_20250627_235555 (1).png',
                    favicon: '/src/favcon/favcom.png'
                });

                // Resetar redes sociais
                await this.salvarArquivo('data/social_links.json', {
                    instagram: 'https://www.instagram.com/ofertasninja_jp/',
                    twitter: '',
                    facebook: '',
                    youtube: '',
                    tiktok: '',
                    linkedin: ''
                });

                this.renderizarCategorias();
                this.renderizarProdutos();
                this.carregarConfiguracoesSite();
                this.carregarRedesSociais();
                this.mostrarNotificacao('Dados resetados com sucesso!', 'success');
            } catch (error) {
                console.error('Erro ao resetar dados:', error);
                this.mostrarNotificacao('Erro ao resetar dados', 'error');
            }
        }
    }

    async carregarConfiguracoesSite() {
        try {
            const response = await fetch('/api/site-config');
            if (response.ok) {
                const config = await response.json();
                document.getElementById('siteTitle').value = config.title || 'OfertasNinja_jp';
            }
        } catch (error) {
            console.error('Erro ao carregar configurações do site:', error);
        }
    }

    async carregarRedesSociais() {
        try {
            const response = await fetch('/api/social-links');
            if (response.ok) {
                const socialLinks = await response.json();
                Object.keys(socialLinks).forEach(platform => {
                    const input = document.getElementById(`${platform}Link`);
                    if (input) {
                        input.value = socialLinks[platform] || '';
                    }
                });
            }
        } catch (error) {
            console.error('Erro ao carregar redes sociais:', error);
        }
    }

    async salvarConfiguracoesSite(formData) {
        try {
            const response = await fetch('/api/site-config', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                this.mostrarNotificacao('Configurações do site salvas com sucesso!', 'success');
                return true;
            } else {
                const error = await response.json();
                this.mostrarNotificacao(error.message || 'Erro ao salvar configurações', 'error');
                return false;
            }
        } catch (error) {
            console.error('Erro ao salvar configurações do site:', error);
            this.mostrarNotificacao('Erro ao conectar ao servidor', 'error');
            return false;
        }
    }

    async salvarRedesSociais() {
        try {
            const socialLinks = {
                instagram: document.getElementById('instagramLink').value.trim(),
                twitter: document.getElementById('twitterLink').value.trim(),
                facebook: document.getElementById('facebookLink').value.trim(),
                youtube: document.getElementById('youtubeLink').value.trim(),
                tiktok: document.getElementById('tiktokLink').value.trim(),
                linkedin: document.getElementById('linkedinLink').value.trim()
            };

            const response = await fetch('/api/social-links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(socialLinks)
            });

            if (response.ok) {
                this.mostrarNotificacao('Redes sociais salvas com sucesso!', 'success');
                return true;
            } else {
                const error = await response.json();
                this.mostrarNotificacao(error.message || 'Erro ao salvar redes sociais', 'error');
                return false;
            }
        } catch (error) {
            console.error('Erro ao salvar redes sociais:', error);
            this.mostrarNotificacao('Erro ao conectar ao servidor', 'error');
            return false;
        }
    }

    async resetarConfiguracoesFabrica() {
        const confirmado = await this.confirmarAcao(
            'Resetar Configurações de Fábrica',
            'Tem certeza que deseja restaurar as configurações do site para os valores originais? Esta ação não afeta categorias nem produtos.'
        );
        if (confirmado) {
            try {
                // Restaurar configurações do site
                await this.salvarArquivo('data/site_config.json', {
                    title: 'OfertasNinja_jp',
                    avatar: '/src/avatar/IMG_20250627_235555 (1).png',
                    favicon: '/src/favcon/favcom.png'
                });
                // Restaurar redes sociais
                await this.salvarArquivo('data/social_links.json', {
                    instagram: 'https://www.instagram.com/ofertasninja_jp/',
                    twitter: '',
                    facebook: '',
                    youtube: '',
                    tiktok: '',
                    linkedin: ''
                });
                // Restaurar tema
                await this.salvarArquivo('data/tema.json', {
                    tema: 'dark'
                });
                this.carregarConfiguracoesSite();
                this.carregarRedesSociais();
                this.mostrarNotificacao('Configurações de fábrica restauradas com sucesso!', 'success');
            } catch (error) {
                console.error('Erro ao resetar configurações de fábrica:', error);
                this.mostrarNotificacao('Erro ao resetar configurações de fábrica', 'error');
            }
        }
    }

    async confirmarAcao(titulo, mensagem) {
        return new Promise((resolve) => {
            const modal = document.getElementById('confirmModal');
            const title = document.getElementById('confirmModalTitle');
            const message = document.getElementById('confirmModalMessage');
            const confirmarBtn = document.getElementById('confirmarAcao');

            title.textContent = titulo;
            message.textContent = mensagem;

            const handleConfirm = () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                confirmarBtn.removeEventListener('click', handleConfirm);
                resolve(true);
            };

            const handleCancel = () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                confirmarBtn.removeEventListener('click', handleConfirm);
                resolve(false);
            };

            confirmarBtn.addEventListener('click', handleConfirm);
            document.getElementById('cancelarConfirmacao').addEventListener('click', handleCancel);

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    fecharModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        this.categoriaEditando = null;
        this.produtoEditando = null;
    }

    mostrarNotificacao(mensagem, tipo = 'info') {
        // Criar notificação
        const notificacao = document.createElement('div');
        notificacao.className = `notificacao notificacao-${tipo}`;
        notificacao.innerHTML = `
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${mensagem}</span>
        `;

        // Adicionar estilos
        notificacao.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${tipo === 'success' ? '#4CAF50' : tipo === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notificacao);

        // Remover após 3 segundos
        setTimeout(() => {
            notificacao.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notificacao.parentNode) {
                    notificacao.parentNode.removeChild(notificacao);
                }
            }, 300);
        }, 3000);
    }
}

// Adicionar estilos para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inicializar painel quando o DOM estiver carregado
let adminPanel;
document.addEventListener('DOMContentLoaded', function() {
    // Sistema de login com backend
    const loginContainer = document.getElementById('loginContainer');
    const painelConteudo = document.getElementById('painelConteudo');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const user = document.getElementById('loginUser').value.trim();
            const pass = document.getElementById('loginPass').value;
            try {
                const resp = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user, pass })
                });
                if (resp.ok) {
                    loginContainer.style.display = 'none';
                    painelConteudo.style.display = 'block';
                } else {
                    const data = await resp.json();
                    loginError.textContent = data.message || 'Usuário ou senha inválidos!';
                    loginError.style.display = 'block';
                }
            } catch (err) {
                loginError.textContent = 'Erro ao conectar ao servidor.';
                loginError.style.display = 'block';
            }
        });
    }

    adminPanel = new AdminPanel();
}); 