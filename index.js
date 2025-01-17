const express = require('express');
const fs = require('fs');
const path = require('path');
const useragent = require('useragent');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const agent = useragent.parse(req.headers['user-agent']);
    const logData = `
    IP: ${ip}
    Browser: ${agent.family}
    Device: ${agent.device.family}
    OS: ${agent.os.family}
    Visit Time: ${new Date().toISOString()}
    \n`;

    fs.appendFileSync('./public/ip.txt', logData, 'utf8');
    console.log(logData);
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});