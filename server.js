const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.static('public'));

app.get('/stats', (req, res) => {
    res.json({ users, referrals });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
