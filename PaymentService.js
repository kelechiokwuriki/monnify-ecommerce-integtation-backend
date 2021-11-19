const monnifService = require('./MonnifyService');

async function processPayment(totalAmount, paymentDescription, customerName, customerEmail) {

    const response = await monnifService.initialiseTransaction(totalAmount, paymentDescription, customerEmail, customerName);

    // we got a response from monnify
    if (Object.keys(response).length > 0) {
        const { checkoutUrl, transactionReference, paymentReference} = response;

        return checkoutUrl;
    }

    return null;
}

module.exports = {
    processPayment: processPayment
}