// Efeitos interativos para a página Linktree Futurista

document.addEventListener('DOMContentLoaded', function() {
    
    // Efeito de parallax suave para as partículas
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const particles = document.querySelectorAll('.particle');
        
        particles.forEach((particle, index) => {
            const speed = 0.5 + (index * 0.1);
            particle.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Efeito de hover 3D para os itens da grade
    const gridItems = document.querySelectorAll('.grid-item');
    
    gridItems.forEach(item => {
        item.addEventListener('mousemove', function(e) {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        item.addEventListener('mouseleave', function() {
            item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });

    // Efeito de digitação para o título
    const title = document.querySelector('.title');
    const originalText = title.textContent;
    title.textContent = '';
    
    let charIndex = 0;
    const typeWriter = () => {
        if (charIndex < originalText.length) {
            title.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Inicia a animação de digitação após 1 segundo
    setTimeout(typeWriter, 1000);

    // Efeito de brilho nos links sociais
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.animation = 'socialGlow 0.5s ease-in-out';
        });
        
        link.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });

    // Adiciona CSS para o efeito de brilho social
    const style = document.createElement('style');
    style.textContent = `
        @keyframes socialGlow {
            0% { box-shadow: 0 0 5px var(--primary-color); }
            50% { box-shadow: 0 0 20px var(--primary-color), 0 0 30px var(--primary-color); }
            100% { box-shadow: 0 0 5px var(--primary-color); }
        }
    `;
    document.head.appendChild(style);

    // Efeito de clique nos itens da grade
    gridItems.forEach(item => {
        item.addEventListener('click', function() {
            // Efeito de onda de clique
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(0, 212, 255, 0.3)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = '100px';
            ripple.style.height = '100px';
            ripple.style.marginLeft = '-50px';
            ripple.style.marginTop = '-50px';
            ripple.style.pointerEvents = 'none';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Adiciona CSS para o efeito de onda
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // Efeito de scroll suave para links internos
    const smoothScroll = (target) => {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // Efeito de carregamento progressivo
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observa todos os itens da grade
    gridItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // Efeito de partículas dinâmicas
    const createParticle = () => {
        const particle = document.createElement('div');
        particle.className = 'dynamic-particle';
        particle.style.position = 'fixed';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = 'var(--primary-color)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 'px';
        particle.style.animation = 'floatUp 3s linear forwards';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 3000);
    };

    // Adiciona CSS para partículas dinâmicas
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes floatUp {
            to {
                transform: translateY(-100vh);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(particleStyle);

    // Cria partículas periodicamente
    setInterval(createParticle, 2000);

    // Efeito de vibração no título ao carregar
    setTimeout(() => {
        title.style.animation = 'titleVibrate 0.5s ease-in-out';
        setTimeout(() => {
            title.style.animation = 'gradientShift 3s ease-in-out infinite';
        }, 500);
    }, 2000);

    // Adiciona CSS para vibração do título
    const vibrateStyle = document.createElement('style');
    vibrateStyle.textContent = `
        @keyframes titleVibrate {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            75% { transform: translateX(2px); }
        }
    `;
    document.head.appendChild(vibrateStyle);

    // Console log para debug
    console.log('🎯 OfertasNinja_jp - Linktree Futurista carregado com sucesso!');
    console.log('✨ Efeitos interativos ativos');
    console.log('🚀 Partículas dinâmicas funcionando');
    console.log('💫 Animações CSS carregadas');

    // Tema definido pelo admin (busca do backend)
    const root = document.documentElement;
    const THEMES = {
        dark: {
            '--primary-color': '#00d4ff',
            '--secondary-color': '#0099cc',
            '--accent-color': '#ff6b6b',
            '--background-dark': '#0a0a0a',
            '--background-light': '#1a1a1a',
            '--text-primary': '#ffffff',
            '--text-secondary': '#b0b0b0',
            '--glow-color': '#00d4ff',
            '--border-color': 'rgba(0, 212, 255, 0.3)',
            '--shadow-color': 'rgba(0, 212, 255, 0.2)'
        },
        light: {
            '--primary-color': '#0077ff',
            '--secondary-color': '#00bfff',
            '--accent-color': '#ff9800',
            '--background-dark': '#f5f7fa',
            '--background-light': '#e3e9f0',
            '--text-primary': '#222',
            '--text-secondary': '#555',
            '--glow-color': '#0077ff',
            '--border-color': 'rgba(0, 119, 255, 0.15)',
            '--shadow-color': 'rgba(0, 119, 255, 0.08)'
        },
        'rosa-claro': {
            '--primary-color': '#ffb6d5',
            '--secondary-color': '#ff69b4',
            '--accent-color': '#ff6bcb',
            '--background-dark': '#fff0f6',
            '--background-light': '#ffe4ec',
            '--text-primary': '#a8005b',
            '--text-secondary': '#d48ab2',
            '--glow-color': '#ffb6d5',
            '--border-color': 'rgba(255, 182, 213, 0.3)',
            '--shadow-color': 'rgba(255, 182, 213, 0.2)'
        }
    };
    function setTheme(theme) {
        const vars = THEMES[theme];
        for (const key in vars) {
            root.style.setProperty(key, vars[key]);
        }
    }
    fetch('/api/tema').then(r => r.json()).then(data => {
        setTheme(data.tema || 'dark');
    });
});

// Aplicação OfertasNinja_jp - Sistema Dinâmico de Categorias e Produtos

class OfertasNinjaApp {
    constructor() {
        this.categorias = [];
        this.categoriaAtual = null;
        this.produtosAtuais = [];
        this.init();
    }

    async init() {
        await this.carregarConfiguracoesSite();
        await this.carregarRedesSociais();
        await this.carregarTema();
        await this.carregarCategorias();
        this.setupEventListeners();
        this.setupEfeitosVisuais();
    }

    async carregarConfiguracoesSite() {
        try {
            const response = await fetch('/api/site-config');
            if (response.ok) {
                const config = await response.json();
                
                // Atualizar título
                document.title = config.title;
                const titleElement = document.querySelector('.title');
                if (titleElement) {
                    titleElement.textContent = config.title;
                }
                
                // Atualizar avatar
                const avatarImg = document.querySelector('.avatar-img');
                if (avatarImg) {
                    avatarImg.src = config.avatar;
                }
                
                // Atualizar favicon
                const faviconLink = document.querySelector('link[rel="icon"]');
                if (faviconLink) {
                    faviconLink.href = config.favicon;
                }
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
                const socialLinksContainer = document.querySelector('.social-links');
                
                if (socialLinksContainer) {
                    socialLinksContainer.innerHTML = '';
                    
                    // Mapear ícones para cada rede social
                    const socialIcons = {
                        instagram: 'fab fa-instagram',
                        twitter: 'fab fa-twitter',
                        facebook: 'fab fa-facebook',
                        youtube: 'fab fa-youtube',
                        tiktok: 'fab fa-tiktok',
                        linkedin: 'fab fa-linkedin'
                    };
                    
                    Object.entries(socialLinks).forEach(([platform, link]) => {
                        if (link && link.trim()) {
                            const socialLink = document.createElement('a');
                            socialLink.href = link;
                            socialLink.target = '_blank';
                            socialLink.className = 'social-link';
                            socialLink.innerHTML = `<i class="${socialIcons[platform]}"></i>`;
                            socialLinksContainer.appendChild(socialLink);
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao carregar redes sociais:', error);
        }
    }

    async carregarTema() {
        try {
            const response = await fetch('/api/tema');
            if (response.ok) {
                const tema = await response.json();
                this.setTheme(tema.tema || 'dark');
            }
        } catch (error) {
            console.error('Erro ao carregar tema:', error);
        }
    }

    async carregarCategorias() {
        try {
            const response = await fetch('/api/categorias');
            const data = await response.json();
            this.categorias = data.categorias || [];
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            // Fallback para categorias de exemplo
            this.categorias = [
                {
                    id: "cozinha",
                    nome: "Cozinha",
                    icone: "🍳",
                    cor: "#FF6B6B",
                    arquivo: "cozinha.json",
                    descricao: "Utensílios e eletrodomésticos para cozinha"
                },
                {
                    id: "eletronicos",
                    nome: "Eletrônicos",
                    icone: "📱",
                    cor: "#4ECDC4",
                    arquivo: "eletronicos.json",
                    descricao: "Smartphones, notebooks e gadgets"
                },
                {
                    id: "infantil",
                    nome: "Infantil",
                    icone: "🧸",
                    cor: "#FFE66D",
                    arquivo: "infantil.json",
                    descricao: "Brinquedos e produtos para crianças"
                },
                {
                    id: "maquiagem",
                    nome: "Maquiagem",
                    icone: "💄",
                    cor: "#FF69B4",
                    arquivo: "maquiagem.json",
                    descricao: "Produtos de beleza e maquiagem"
                }
            ];
        }
        // Renderizar carrossel e carregar produtos iniciais
        this.renderizarCategorias();
        await this.carregarTodosProdutos();
        this.renderizarProdutos();
    }

    async carregarTodosProdutos() {
        this.produtosAtuais = [];
        for (const categoria of this.categorias) {
            try {
                const response = await fetch(`/api/produtos/${categoria.arquivo}`);
                const data = await response.json();
                if (data.itens) {
                    this.produtosAtuais.push(...data.itens);
                }
            } catch (error) {
                // ignora erro de categoria sem produtos
            }
        }
    }

    async carregarProdutos(categoriaId) {
        try {
            const categoria = this.categorias.find(cat => cat.id === categoriaId);
            if (!categoria) return [];

            const response = await fetch(`/api/produtos/${categoria.arquivo}`);
            const data = await response.json();
            this.produtosAtuais = data.itens || [];
            this.categoriaAtual = categoria;
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            this.produtosAtuais = [];
        }
    }

    setupEventListeners() {
        // Botão voltar
        const backButton = document.getElementById('backButton');
        if (backButton) {
            backButton.addEventListener('click', () => this.voltarParaCategorias());
        }

        // Modal
        const modal = document.getElementById('productModal');
        const closeModal = document.getElementById('closeModal');
        
        if (closeModal) {
            closeModal.addEventListener('click', () => this.fecharModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.fecharModal();
                }
            });
        }

        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.fecharModal();
            }
        });
    }

    renderizarCategorias() {
        const carousel = document.getElementById('categoriasCarousel');
        if (!carousel) return;
        carousel.innerHTML = '';

        // Criar setas
        const setaEsq = document.createElement('button');
        setaEsq.className = 'carrousel-seta esq';
        setaEsq.innerHTML = '<i class="fas fa-chevron-left"></i>';
        setaEsq.onclick = () => carousel.scrollBy({ left: -200, behavior: 'smooth' });
        carousel.parentElement.appendChild(setaEsq);

        const setaDir = document.createElement('button');
        setaDir.className = 'carrousel-seta dir';
        setaDir.innerHTML = '<i class="fas fa-chevron-right"></i>';
        setaDir.onclick = () => carousel.scrollBy({ left: 200, behavior: 'smooth' });
        carousel.parentElement.appendChild(setaDir);

        // Remover setas duplicadas
        const allSetas = carousel.parentElement.querySelectorAll('.carrousel-seta');
        if (allSetas.length > 2) {
            for (let i = 0; i < allSetas.length - 2; i++) {
                allSetas[i].remove();
            }
        }

        this.categorias.forEach((cat, idx) => {
            const item = document.createElement('div');
            item.className = 'carrousel-item' + (this.categoriaAtual && this.categoriaAtual.id === cat.id ? ' carrousel-item-ativo' : '');
            item.onclick = () => {
                this.filtrarProdutosPorCategoria(cat.id);
                this.toggleCategoriaAtiva(item, cat.id);
            };

            // Ícone ou imagem
            const iconeDiv = document.createElement('div');
            iconeDiv.className = 'carrousel-item-icone';
            if (cat.imagem) {
                const img = document.createElement('img');
                img.src = cat.imagem;
                img.alt = cat.nome;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '50%';
                iconeDiv.appendChild(img);
            } else if (cat.icone) {
                iconeDiv.textContent = cat.icone;
            } else {
                iconeDiv.innerHTML = '<i class="fas fa-tag"></i>';
            }
            iconeDiv.style.background = cat.cor || 'var(--background-light)';
            item.appendChild(iconeDiv);

            // Nome
            const nomeDiv = document.createElement('div');
            nomeDiv.className = 'carrousel-item-nome';
            nomeDiv.textContent = cat.nome;
            item.appendChild(nomeDiv);

            carousel.appendChild(item);
        });
    }

    toggleCategoriaAtiva(item, categoriaId) {
        const carousel = document.getElementById('categoriasCarousel');
        const items = carousel.querySelectorAll('.carrousel-item');
        const jaAtivo = item.classList.contains('carrousel-item-ativo');
        items.forEach(i => i.classList.remove('carrousel-item-ativo'));
        if (!jaAtivo) {
            item.classList.add('carrousel-item-ativo');
            this.filtrarProdutosPorCategoria(categoriaId);
        } else {
            this.filtrarProdutosPorCategoria(null); // Exibe todos
        }
    }

    removerDestaqueCarrousel(eMostrarTodos = false) {
        const carousel = document.getElementById('categoriasCarousel');
        if (!carousel) return;
        const items = carousel.querySelectorAll('.carrousel-item');
        items.forEach(i => i.classList.remove('carrousel-item-ativo'));
        if (eMostrarTodos) {
            this.filtrarProdutosPorCategoria(null);
        }
    }

    filtrarProdutosPorCategoria(categoriaId) {
        if (!categoriaId) {
            this.carregarTodosProdutos().then(() => this.renderizarProdutos());
        } else {
            this.carregarProdutos(categoriaId).then(() => this.renderizarProdutos());
        }
    }

    renderizarProdutos() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        grid.innerHTML = '';
        
        this.produtosAtuais.forEach(produto => {
            let mediaHtml = '';
            if (produto.imagem && /\.(mp4|webm|ogg)$/i.test(produto.imagem)) {
                mediaHtml = `<video src="${produto.imagem}" class="item-image" controls style="width:100%; object-fit:contain; border-radius: 8px 8px 0 0;"></video>`;
            } else {
                mediaHtml = `<img src="${produto.imagem}" alt="${produto.titulo}" class="item-image" loading="lazy">`;
            }
            const item = document.createElement('div');
            item.className = 'grid-item';
            item.innerHTML = `
                <div class="item-content-card">
                    <div class="item-top-row">
                        ${produto.desconto ? `<span class='item-discount-label'>-${produto.desconto}</span>` : ''}
                    </div>
                    ${mediaHtml}
                    <div class="item-labels">
                        ${produto.etiqueta ? `<span class='item-etiqueta ${produto.etiqueta.toLowerCase()}'>${produto.etiqueta}</span>` : ''}
                        ${produto.cashback ? `<span class='item-cashback'>${produto.cashback}</span>` : ''}
                    </div>
                    <h3 class="item-title">${produto.titulo}</h3>
                    <div class="item-prices">
                        <span class="item-price">${produto.preco}</span>
                        ${produto.precoOriginal ? `<span class="item-original-price">${produto.precoOriginal}</span>` : ''}
                    </div>
                    <div class="item-extra-row">
                        <span class="item-vendidos">${produto.vendidos ? produto.vendidos + ' Vendido(s)' : ''}</span>
                    </div>
                </div>
            `;
            item.addEventListener('click', () => this.abrirModalProduto(produto));
            grid.appendChild(item);
        });
    }

    mostrarProdutos() {
        const categoriesSection = document.getElementById('categoriesSection');
        const productsSection = document.getElementById('productsSection');
        const backBtn = document.getElementById('backBtn');
        const categoryTitle = document.getElementById('categoryTitle');

        if (categoriesSection) categoriesSection.style.display = 'none';
        if (productsSection) productsSection.style.display = 'block';
        if (backBtn) backBtn.style.display = 'block';
        if (categoryTitle) {
            categoryTitle.textContent = this.categoriaAtual ? this.categoriaAtual.nome : '';
            categoryTitle.style.display = 'block';
        }
    }

    voltarParaCategorias() {
        const categoriesSection = document.getElementById('categoriesSection');
        const productsSection = document.getElementById('productsSection');
        const backBtn = document.getElementById('backBtn');
        const categoryTitle = document.getElementById('categoryTitle');

        if (categoriesSection) categoriesSection.style.display = 'block';
        if (productsSection) productsSection.style.display = 'none';
        if (backBtn) backBtn.style.display = 'none';
        if (categoryTitle) categoryTitle.style.display = 'none';

        this.produtosAtuais = [];
        this.categoriaAtual = null;
    }

    abrirModalProduto(produto) {
        const modal = document.getElementById('productModal');
        const modalBody = document.getElementById('modalBody');
        
        if (!modal || !modalBody) return;

        let mediaHtml = '';
        if (produto.imagem && /\.(mp4|webm|ogg)$/i.test(produto.imagem)) {
            mediaHtml = `<video src="${produto.imagem}" class="modal-image" controls style="max-width: 100%; max-height: 250px; object-fit: contain; border-radius: 15px; margin: 0 auto 24px auto; display: block;">Seu navegador não suporta vídeo.</video>`;
        } else {
            mediaHtml = `<img src="${produto.imagem}" alt="${produto.titulo}" class="modal-image">`;
        }
        modalBody.innerHTML = `
            ${mediaHtml}
            <h2 class="modal-title">${produto.titulo}</h2>
            <p class="modal-description">${produto.descricao}</p>
            <div class="modal-price">${produto.preco}</div>
            <div class="modal-original-price">${produto.precoOriginal}</div>
            <div class="modal-discount">${produto.desconto} OFF</div>
            <a href="${produto.link}" class="modal-button" target="_blank">
                <i class="fas fa-shopping-cart"></i>
                Ver Oferta
            </a>
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    fecharModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    setupEfeitosVisuais() {
        // Efeito de parallax suave para as partículas
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const particles = document.querySelectorAll('.particle');
            
            particles.forEach((particle, index) => {
                const speed = 0.5 + (index * 0.1);
                particle.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });

        // Efeito de hover 3D para os itens da grade
        const setupGridItemEffects = () => {
            const gridItems = document.querySelectorAll('.grid-item');
            
            gridItems.forEach(item => {
                item.addEventListener('mousemove', function(e) {
                    const rect = item.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;
                    
                    item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
                });
                
                item.addEventListener('mouseleave', function() {
                    item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
                });
            });
        };

        // Efeito de digitação para o título
        const title = document.querySelector('.title');
        if (title) {
            const originalText = title.textContent;
            title.textContent = '';
            
            let charIndex = 0;
            const typeWriter = () => {
                if (charIndex < originalText.length) {
                    title.textContent += originalText.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            setTimeout(typeWriter, 1000);
        }

        // Efeito de brilho nos links sociais
        const socialLinks = document.querySelectorAll('.social-link');
        
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.animation = 'socialGlow 0.5s ease-in-out';
            });
            
            link.addEventListener('animationend', function() {
                this.style.animation = '';
            });
        });

        // Adiciona CSS para o efeito de brilho social
        const style = document.createElement('style');
        style.textContent = `
            @keyframes socialGlow {
                0% { box-shadow: 0 0 5px var(--primary-color); }
                50% { box-shadow: 0 0 20px var(--primary-color), 0 0 30px var(--primary-color); }
                100% { box-shadow: 0 0 5px var(--primary-color); }
            }
        `;
        document.head.appendChild(style);

        // Efeito de clique nos itens da grade
        const setupClickEffects = () => {
            const gridItems = document.querySelectorAll('.grid-item');
            
            gridItems.forEach(item => {
                item.addEventListener('click', function() {
                    // Efeito de onda de clique
                    const ripple = document.createElement('div');
                    ripple.style.position = 'absolute';
                    ripple.style.borderRadius = '50%';
                    ripple.style.background = 'rgba(0, 212, 255, 0.3)';
                    ripple.style.transform = 'scale(0)';
                    ripple.style.animation = 'ripple 0.6s linear';
                    ripple.style.left = '50%';
                    ripple.style.top = '50%';
                    ripple.style.width = '100px';
                    ripple.style.height = '100px';
                    ripple.style.marginLeft = '-50px';
                    ripple.style.marginTop = '-50px';
                    ripple.style.pointerEvents = 'none';
                    
                    this.appendChild(ripple);
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                });
            });
        };

        // Adiciona CSS para o efeito de onda
        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);

        // Efeito de carregamento progressivo
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observa todos os itens da grade
        const observeGridItems = () => {
            const gridItems = document.querySelectorAll('.grid-item');
            gridItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(item);
            });
        };

        // Efeito de partículas dinâmicas
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'dynamic-particle';
            particle.style.position = 'fixed';
            particle.style.width = '2px';
            particle.style.height = '2px';
            particle.style.background = 'var(--primary-color)';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1';
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = window.innerHeight + 'px';
            particle.style.animation = 'floatUp 3s linear forwards';
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 3000);
        };

        // Adiciona CSS para partículas dinâmicas
        const particleStyle = document.createElement('style');
        particleStyle.textContent = `
            @keyframes floatUp {
                to {
                    transform: translateY(-100vh);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(particleStyle);

        // Cria partículas periodicamente
        setInterval(createParticle, 2000);

        // Efeito de vibração no título ao carregar
        setTimeout(() => {
            if (title) {
                title.style.animation = 'titleVibrate 0.5s ease-in-out';
                setTimeout(() => {
                    title.style.animation = 'gradientShift 3s ease-in-out infinite';
                }, 500);
            }
        }, 2000);

        // Adiciona CSS para vibração do título
        const vibrateStyle = document.createElement('style');
        vibrateStyle.textContent = `
            @keyframes titleVibrate {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-2px); }
                75% { transform: translateX(2px); }
            }
        `;
        document.head.appendChild(vibrateStyle);

        // Configurar efeitos quando a página carrega
        setupGridItemEffects();
        setupClickEffects();
        observeGridItems();

        // Reconfigurar efeitos quando produtos são carregados
        const originalRenderizarProdutos = this.renderizarProdutos.bind(this);
        this.renderizarProdutos = () => {
            originalRenderizarProdutos();
            setTimeout(() => {
                setupGridItemEffects();
                setupClickEffects();
                observeGridItems();
            }, 100);
        };
    }

    verOferta(link) {
        if (link) {
            window.open(link, '_blank');
        }
    }

    setTheme(theme) {
        const THEMES = {
            dark: {
                '--primary-color': '#00d4ff',
                '--secondary-color': '#0099cc',
                '--accent-color': '#ff6b6b',
                '--background-dark': '#0a0a0a',
                '--background-light': '#1a1a1a',
                '--text-primary': '#ffffff',
                '--text-secondary': '#b0b0b0',
                '--glow-color': '#00d4ff',
                '--border-color': 'rgba(0, 212, 255, 0.3)',
                '--shadow-color': 'rgba(0, 212, 255, 0.2)'
            },
            light: {
                '--primary-color': '#0077ff',
                '--secondary-color': '#00bfff',
                '--accent-color': '#ff9800',
                '--background-dark': '#f5f7fa',
                '--background-light': '#e3e9f0',
                '--text-primary': '#222',
                '--text-secondary': '#555',
                '--glow-color': '#0077ff',
                '--border-color': 'rgba(0, 119, 255, 0.15)',
                '--shadow-color': 'rgba(0, 119, 255, 0.08)'
            },
            'rosa-claro': {
                '--primary-color': '#ffb6d5',
                '--secondary-color': '#ff69b4',
                '--accent-color': '#ff6bcb',
                '--background-dark': '#fff0f6',
                '--background-light': '#ffe4ec',
                '--text-primary': '#a8005b',
                '--text-secondary': '#d48ab2',
                '--glow-color': '#ffb6d5',
                '--border-color': 'rgba(255, 182, 213, 0.3)',
                '--shadow-color': 'rgba(255, 182, 213, 0.2)'
            }
        };
        const vars = THEMES[theme];
        const root = document.documentElement;
        for (const key in vars) {
            root.style.setProperty(key, vars[key]);
        }
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    new OfertasNinjaApp();
}); 