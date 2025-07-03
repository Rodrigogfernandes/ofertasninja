const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;

const CRED_FILE = path.join(__dirname, 'data', 'credenciais.json');
const THEME_FILE = path.join(__dirname, 'data', 'tema.json');

// Configuração do multer para upload de imagens
const uploadDir = path.join(__dirname, 'data', 'categorias_img');
fs.ensureDirSync(uploadDir);
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        // Nome do arquivo: timestamp-original.ext
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
    }
});
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Servir arquivos estáticos
app.use('/data/categorias_img', express.static(uploadDir));

// Utilitário para garantir credenciais padrão
async function garantirCredenciaisPadrao() {
    if (!(await fs.pathExists(CRED_FILE))) {
        await fs.writeJson(CRED_FILE, { user: 'admin', pass: '1234' }, { spaces: 2 });
    }
}

// Utilitário para garantir tema padrão
async function garantirTemaPadrao() {
    if (!(await fs.pathExists(THEME_FILE))) {
        await fs.writeJson(THEME_FILE, { tema: 'dark' }, { spaces: 2 });
    }
}

// Endpoint para obter credenciais (NUNCA envie a senha em produção!)
app.get('/api/credenciais', async (req, res) => {
    await garantirCredenciaisPadrao();
    const cred = await fs.readJson(CRED_FILE);
    res.json({ user: cred.user });
});

// Endpoint para atualizar credenciais
app.post('/api/credenciais', async (req, res) => {
    const { user, pass } = req.body;
    if (!user || !pass || user.length < 3 || pass.length < 3) {
        return res.status(400).json({ success: false, message: 'Usuário e senha devem ter pelo menos 3 caracteres.' });
    }
    await fs.writeJson(CRED_FILE, { user, pass }, { spaces: 2 });
    res.json({ success: true });
});

// Endpoint para login
app.post('/api/login', async (req, res) => {
    await garantirCredenciaisPadrao();
    const { user, pass } = req.body;
    const cred = await fs.readJson(CRED_FILE);
    if (user === cred.user && pass === cred.pass) {
        // Sessão simples (NÃO use em produção!)
        req.session = { logado: true };
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Usuário ou senha inválidos.' });
    }
});

// Endpoint para obter tema
app.get('/api/tema', async (req, res) => {
    await garantirTemaPadrao();
    const tema = await fs.readJson(THEME_FILE);
    res.json({ tema: tema.tema });
});

// Endpoint para salvar tema
app.post('/api/tema', async (req, res) => {
    const { tema } = req.body;
    if (!['dark', 'light', 'rosa-claro'].includes(tema)) {
        return res.status(400).json({ success: false, message: 'Tema inválido.' });
    }
    await fs.writeJson(THEME_FILE, { tema }, { spaces: 2 });
    res.json({ success: true });
});

// Rota para salvar categorias
app.post('/api/salvar-categorias', async (req, res) => {
    try {
        const { categorias } = req.body;
        const filePath = path.join(__dirname, 'data', 'categorias.json');
        
        // Garantir que a pasta data existe
        await fs.ensureDir(path.join(__dirname, 'data'));
        
        // Salvar arquivo
        await fs.writeJson(filePath, { categorias }, { spaces: 2 });
        
        console.log('Categorias salvas com sucesso:', filePath);
        res.json({ success: true, message: 'Categorias salvas com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar categorias:', error);
        res.status(500).json({ success: false, message: 'Erro ao salvar categorias' });
    }
});

// Rota para salvar produtos de uma categoria
app.post('/api/salvar-produtos', async (req, res) => {
    try {
        const { categoria, arquivo, dados } = req.body;
        const filePath = path.join(__dirname, 'data', arquivo);
        
        // Garantir que a pasta data existe
        await fs.ensureDir(path.join(__dirname, 'data'));
        
        // Salvar arquivo
        await fs.writeJson(filePath, dados, { spaces: 2 });
        
        console.log(`Produtos da categoria ${categoria} salvos com sucesso:`, filePath);
        res.json({ success: true, message: `Produtos da categoria ${categoria} salvos com sucesso!` });
    } catch (error) {
        console.error('Erro ao salvar produtos:', error);
        res.status(500).json({ success: false, message: 'Erro ao salvar produtos' });
    }
});

// Rota para obter categorias
app.get('/api/categorias', async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'data', 'categorias.json');
        const data = await fs.readJson(filePath);
        res.json(data);
    } catch (error) {
        console.error('Erro ao ler categorias:', error);
        res.status(500).json({ error: 'Erro ao ler categorias' });
    }
});

// Rota para obter produtos de uma categoria
app.get('/api/produtos/:arquivo', async (req, res) => {
    try {
        const { arquivo } = req.params;
        const filePath = path.join(__dirname, 'data', arquivo);
        const data = await fs.readJson(filePath);
        res.json(data);
    } catch (error) {
        console.error(`Erro ao ler produtos do arquivo ${req.params.arquivo}:`, error);
        res.status(500).json({ error: 'Erro ao ler produtos' });
    }
});

// Rota para listar todos os arquivos de dados
app.get('/api/arquivos', async (req, res) => {
    try {
        const dataDir = path.join(__dirname, 'data');
        const files = await fs.readdir(dataDir);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        res.json({ arquivos: jsonFiles });
    } catch (error) {
        console.error('Erro ao listar arquivos:', error);
        res.status(500).json({ error: 'Erro ao listar arquivos' });
    }
});

// Rota para excluir um arquivo
app.delete('/api/arquivo/:nome', async (req, res) => {
    try {
        const { nome } = req.params;
        const filePath = path.join(__dirname, 'data', nome);
        
        // Verificar se o arquivo existe
        if (await fs.pathExists(filePath)) {
            await fs.remove(filePath);
            console.log(`Arquivo ${nome} excluído com sucesso`);
            res.json({ success: true, message: `Arquivo ${nome} excluído com sucesso!` });
        } else {
            res.status(404).json({ success: false, message: 'Arquivo não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao excluir arquivo:', error);
        res.status(500).json({ success: false, message: 'Erro ao excluir arquivo' });
    }
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para o painel admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Rota para upload de imagem de categoria
app.post('/api/upload-categoria-img', upload.single('imagem'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado.' });
    }
    // Retorna o caminho relativo para uso no frontend
    const url = `/data/categorias_img/${req.file.filename}`;
    res.json({ success: true, url });
});

// Endpoint para obter configurações do site
app.get('/api/site-config', (req, res) => {
    try {
        const configPath = path.join(__dirname, 'data', 'site_config.json');
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            res.json(config);
        } else {
            // Configuração padrão
            const defaultConfig = {
                title: 'OfertasNinja_jp',
                avatar: '/src/avatar/IMG_20250627_235555 (1).png',
                favicon: '/src/favcon/favcom.png'
            };
            fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
            res.json(defaultConfig);
        }
    } catch (error) {
        console.error('Erro ao ler configurações do site:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Endpoint para salvar configurações do site
app.post('/api/site-config', upload.fields([
    { name: 'avatarUpload', maxCount: 1 },
    { name: 'faviconUpload', maxCount: 1 }
]), (req, res) => {
    try {
        const { siteTitle } = req.body;
        const avatarFile = req.files?.avatarUpload?.[0];
        const faviconFile = req.files?.faviconUpload?.[0];
        const avatarLink = req.body.avatarLink;
        const faviconLink = req.body.faviconLink;

        let avatarPath = '/src/avatar/IMG_20250627_235555 (1).png';
        let faviconPath = '/src/favcon/favcom.png';

        // Processar avatar
        if (avatarFile) {
            const avatarExt = path.extname(avatarFile.originalname);
            const avatarFileName = `avatar_${Date.now()}${avatarExt}`;
            const avatarDestPath = path.join(__dirname, 'src', 'avatar', avatarFileName);
            fs.copyFileSync(avatarFile.path, avatarDestPath);
            avatarPath = `/src/avatar/${avatarFileName}`;
        } else if (avatarLink) {
            avatarPath = avatarLink;
        }

        // Processar favicon
        if (faviconFile) {
            const faviconExt = path.extname(faviconFile.originalname);
            const faviconFileName = `favicon_${Date.now()}${faviconExt}`;
            const faviconDestPath = path.join(__dirname, 'src', 'favcon', faviconFileName);
            fs.copyFileSync(faviconFile.path, faviconDestPath);
            faviconPath = `/src/favcon/${faviconFileName}`;
        } else if (faviconLink) {
            faviconPath = faviconLink;
        }

        const config = {
            title: siteTitle || 'OfertasNinja_jp',
            avatar: avatarPath,
            favicon: faviconPath
        };

        const configPath = path.join(__dirname, 'data', 'site_config.json');
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        res.json({ message: 'Configurações salvas com sucesso', config });
    } catch (error) {
        console.error('Erro ao salvar configurações do site:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Endpoint para obter redes sociais
app.get('/api/social-links', (req, res) => {
    try {
        const socialPath = path.join(__dirname, 'data', 'social_links.json');
        if (fs.existsSync(socialPath)) {
            const socialLinks = JSON.parse(fs.readFileSync(socialPath, 'utf8'));
            res.json(socialLinks);
        } else {
            // Redes sociais padrão
            const defaultSocialLinks = {
                instagram: 'https://www.instagram.com/ofertasninja_jp/',
                twitter: '',
                facebook: '',
                youtube: '',
                tiktok: '',
                linkedin: ''
            };
            fs.writeFileSync(socialPath, JSON.stringify(defaultSocialLinks, null, 2));
            res.json(defaultSocialLinks);
        }
    } catch (error) {
        console.error('Erro ao ler redes sociais:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Endpoint para salvar redes sociais
app.post('/api/social-links', (req, res) => {
    try {
        const socialLinks = req.body;
        const socialPath = path.join(__dirname, 'data', 'social_links.json');
        fs.writeFileSync(socialPath, JSON.stringify(socialLinks, null, 2));
        res.json({ message: 'Redes sociais salvas com sucesso' });
    } catch (error) {
        console.error('Erro ao salvar redes sociais:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📁 Pasta de dados: ${path.join(__dirname, 'data')}`);
    console.log(`🎛️  Painel admin: http://localhost:${PORT}/admin`);
}); 