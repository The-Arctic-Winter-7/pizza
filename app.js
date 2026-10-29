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

// Set view engine to EJS
app.set('view engine', 'ejs');

// Define a default route
app.get('/', (req, res) => {
    // res.send('Welcome to Winter\'s Pizza'):
    res.render('home');
});

// Add a menu route to display a menu view page
app.get('/pizza-menu', (req, res) => {
    res.render('menu');
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

    res.render('confirm', { order });
});

// Add a contact route to display a contact view page
app.get('/contact-us', (req, res) => {
    res.render('contact');
});

app.get('/admin', (req, res) => {
    res.render('admin', { orders });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});