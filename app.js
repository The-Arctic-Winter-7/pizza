// Import express library
import express from 'express';

// Import MySQL library
import mysql2 from 'mysql2';

// Import .env
import dotenv from 'dotenv';

// Import Express Seesion
import session from 'express-session';

// Import server-side validation function
import { validateForm } from './validation.js';

dotenv.config();

// Create a connection pool
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT
}).promise();

// Create an instance of an express application
const app = express();

/* ==================== SESSION MIDDLEWARE =====================
 * A SESSION lets the server remember a user between requests.
 * After this runs, every route can read and write req.session.
 * 
 * secret:            Used to sign the session cookie (from .env)
 * resave:            false = don't re-save sessions that didn't change
 * saveUninitialized: false = don't create a session until we sotre
 *                    something in it (like loggedIn = true)
 * cookie.maxAge:     How long the login lasts, in milliseconds
 *                    (1000 ms * 60 sec * 60 minutes = 1 hour)
 */
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }
}));

/* ==================== requireLogin MIDDLEWARE ====================
 * Middleware is a function that runs BETWEEN the request arriving
 * and the route handler running. It receives three parameters:
 *   req  - the request
 *   res  - the response
 *   next - a function that says "OK, continue to the route"
 *
 * If the user is logged in, we call next() to let them through.
 * If not, we redirect them to the login page instead.
 */
function requireLogin(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
}

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
app.post('/submit-order', async (req, res) => {

    // Create a JSON object to store order data
    const order = req.body;
    console.log(order);

    // Validate the data on the *server*
    const valid = validateForm(order);
    if (!valid.isValid) {
        console.log(valid);
        res.render('home', { errors: valid.errors });
        return;
    }

    order.toppings = Array.isArray(order.toppings) ?
        order.toppings.join(", ") : "";

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

    // Get the id from the newly inserted row
    order.id = result.insertId;
    console.log("A new row was insterted with ID " + order.id);

    res.render('confirm', { order });
});

// Add a contact route to display a contact view page
app.get('/contact-us', (req, res) => {
    res.render('contact');
});

// Add a route for the login page
// Display the login page - http://localhost:3000/login
// We pass error: null because there is no error yet.
// login.ejs checks "if (error)", so error must always be defined.
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Process the login form
// This handles POST requests to /login (when the user submits the form)
app.post('/login', (req, res) => {
    // Get the values the user typed into the form
    const username = req.body.username;
    const password = req.body.password;

    // Compare them to the username and password stored in .env
    if (username === process.env.ADMIN_USER &&
        password === process.env.ADMIN_PASSWORD) {

        // Correct! Remember that this user is logged in
        req.session.loggedIn = true;

        // Send them to the admin page
        res.redirect('/admin');
    } else {
        // Wrong username or password - show the form again with an error
        // Note: we don't say WHICH one was wrong. That would give an
        // attacker a hint (e.g., "the username is right, keep guessing").
        res.render('login', { error: 'Invalid username or password.' });
    }
});

// Log out - http://localhost:3000/logout
// req.session.destroy() deletes the session from the server.
// When it's finished, we send the user back to the login page.
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Add an admin route to display order data
app.get('/admin', requireLogin, async (req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders');
        res.render('admin', { orders });
    } catch (err) {
        console.error('Database error: ', err);
        res.status(500).send('Database error ocurred.');
    }
});

// Create an event listener that opens the app to the local server host
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});