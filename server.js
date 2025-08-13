const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 7000;

// MIME типы для различных файлов
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    
    // Обработка специальных маршрутов
    if (filePath === './admin') {
        filePath = './admin.html';
    } else if (filePath === './telegram') {
        filePath = './telegram.html';
    } else if (filePath === './') {
        filePath = './index.html';
    }
    
    // Получаем расширение файла
    const extname = path.extname(filePath);
    let contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // Читаем файл
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Файл не найден
                res.writeHead(404);
                res.end('404 - Arquivo não encontrado');
            } else {
                // Ошибка сервера
                res.writeHead(500);
                res.end('500 - Erro interno do servidor');
            }
        } else {
            // Успешный ответ
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
               console.log(`📱 Aplicação Coook está pronta para uso!`);
    console.log(`🔐 Admin Panel: http://localhost:${PORT}/admin`);
    console.log(`📱 Telegram WebApp: http://localhost:${PORT}/telegram`);
    console.log(`🌍 Cidades disponíveis: São Paulo, Rio de Janeiro, Brasília`);
    console.log(`\n📋 Instruções:`);
    console.log(`   • Usuários: http://localhost:${PORT}`);
    console.log(`   • Administradores: http://localhost:${PORT}/admin`);
    console.log(`   • Telegram WebApp: http://localhost:${PORT}/telegram`);
    console.log(`   • Изменения в админ панели автоматически синхронизируются с основным приложением`);
    console.log(`\n🌐 Para produção:`);
    console.log(`   • Deploy no GitHub Pages, Vercel ou Netlify`);
    console.log(`   • Configure HTTPS (обязательно для Telegram WebApp)`);
    console.log(`   • Adicione autenticação na админ панели`);
});
