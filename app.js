import express from 'express';

const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
    app.use(express.static('public'));
    res.sendFile(`${import.meta.dirname}/views/home.html`);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});