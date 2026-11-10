// Import express library
import express from 'express';

// Import MySQL library
import mysql2 from 'mysql2';

// Import .env
import dotenv from 'dotenv';

dotenv.config();

// Create a pool
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT
}).promise();

// Create an instance of an express application
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

// Create a route to test database
app.get('/db-test', async (req, res) => {
    try {
        const orders = await pool.query('SELECT * FROM orders');
        res.send(orders[0]);
    } catch (err) {
        console.error('Database error: ', err);
        res.status(500).send('Database error ocurred.');
    }
});

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
app.post('/submit-order', async (req, res) => {
    // Create a JSON object to store order data
    const order = req.body;
    console.log(order);

    const sql = 'INSERT INTO orders (fname, lname, email, size, method, toppings, comment) VALUES(?, ?, ?, ?, ?, ?, ?)';

    // Create an array of parameters from order data
    const params = [
        order.fname,
        order.lname,
        order.email,
        order.size,
        order.method,
        order.toppings,
        order.comment
    ];

    const [result] = await pool.execute(sql, params);

    res.render('confirm', { order });
});

// Add a contact route to display a contact view page
app.get('/contact-us', (req, res) => {
    res.render('contact');
});

// Add an admin route to display order data
app.get('/admin', async (req, res) => {
    try {
        const orders = await pool.query('SELECT * FROM orders');
        console.log(orders[0]);
        res.render('admin', { orders: orders[0] });
    } catch (err) {
        console.error('Database error: ', err);
        res.status(500).send('Database error ocurred.');
    }
});

// Create an event listener that opens the app to the local server host
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});