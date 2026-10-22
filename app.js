import express from 'express';

const app = express();

// Define a port number for our server to listen on
const PORT = 3000;

// Create an array to store orders
const orders = [];


// Enable static file serving
app.use(express.static('public'));

// Allow the app to parse form data
// Access form data through req.body
app.use(express.urlencoded({ extended: true }));

// Define a default route
app.get('/', (req, res) => {
    // res.send('Welcome to Winter\'s Pizza'):
    res.sendFile(`${import.meta.dirname}/views/home.html`);
});

// Add a menu route to display a menu view page
app.get('/pizza-menu', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/menu.html`);
});

// Add a route to process a pizza order
app.post('/submit-order', (req, res) => {
    // Create a JSON object to store order data
    const order = req.body;
    order['timestamp'] = new Date();

    console.log(order);

    // Add orders to order array
    orders.push(order);
    console.log(orders);

    res.sendFile(`${import.meta.dirname}/views/confirm.html`);
});

// Add a contact route to display a contact view page
app.get('/contact-us', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/contact.html`);
});

// Add a confirm order route to display an order confirmed view page
app.get('/confirm-order', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/confirm.html`);
});

app.get('/admin', (req, res) => {
    res.send(orders);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});