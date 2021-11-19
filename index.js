require('dotenv').config()
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const helmet = require("helmet");
const monnifService = require('./MonnifyService');
const database = require('./database');
const paymentService = require('./PaymentService');

// initialise the express app
const app = express();

// use helmet
app.use(helmet());

// use the body parser
app.use(bodyParser.json());

// next enable cors for all requests
app.use(cors());

app.get('/api/product', async (request, response) => {
    const { products } = database;
    response.send(products).status(200);
});

app.post('/api/product/process-payment', async (request, response) => {
    const { totalAmount, paymentDescription, customerName, customerEmail } = request.body;

    const checkoutUrl = await paymentService.processPayment(totalAmount, paymentDescription, customerName, customerEmail);

    if (checkoutUrl === null) {
        response.send('Error processing payment. Try again').status(400);
    }

    response.send(checkoutUrl).status(200);
})

app.post('/api/monnify/webhook', async (request, response) => {
    response.status(200);

    monnifService.handleWebhook(request.body);
})

app.listen(3000, () => {
 console.log("Server running on port 3000");
});