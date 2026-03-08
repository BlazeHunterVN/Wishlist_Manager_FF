const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Proxy login API to original macxtools server (bypass CORS)
app.post('/api/wishlist', async (req, res) => {
    try {
        const response = await fetch('https://macxtools.vercel.app/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Proxy wishlist read API (bypass CORS)
app.get('/api/wish/:region/uid=:uid/:version', async (req, res) => {
    try {
        const { region, uid, version } = req.params;
        const url = `https://macxwishlist.vercel.app/api/wish/${region}/uid=${uid}/${version}`;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Proxy wishlist add/remove API (bypass CORS)
app.get('/api/wishlist/:region/:action/:itemId/:uid/:pass/:version', async (req, res) => {
    try {
        const { region, action, itemId, uid, pass, version } = req.params;
        const url = `https://macxwish.vercel.app/api/wishlist/${region}/${action}/${itemId}/${uid}/${pass}/${version}`;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`\n  ⚡ BlazeTools đang chạy tại: http://localhost:${PORT}\n`);
});
