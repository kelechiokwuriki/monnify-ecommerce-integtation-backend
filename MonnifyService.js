
const axios = require("axios");
const cacheService = require('./CacheService');

const apiKey = process.env.MONNIFY_API_KEY;
const apiSecret = process.env.MONNIFY_SECRET_KEY;
const baseUrl = process.env.MONNIFY_BASE_URL;
const monnifyCardPaymentMethod = process.env.MONNIFY_CARD_PAYMENT_METHOD;
const monnifyAccountTransferPaymentMethod = process.env.MONNIFY_ACCOUNT_TRANSFER_PAYMENT_METHOD;
const monnifyContractCode = process.env.MONNIFY_CONTRACT_CODE;
const redirectUrl = process.env.REDIRECT_URL;

async function authenticate() {
    try {
        const cachedAccessToken = await cacheService.get('monnifyAccessToken');
        if (cachedAccessToken) {
            return cachedAccessToken;
        }

        const clientIDSecretInBase64 = Buffer.from(apiKey + ':' + apiSecret).toString('base64');

        const headers = {
            Authorization: 'Basic ' + clientIDSecretInBase64 
        }
        const response = await axios.post(baseUrl + '/api/v1/auth/login', null, { headers });
        const { responseBody } = response.data;
        const { accessToken, expiresIn } = responseBody;

        await cacheService.set('monnifyAccessToken', accessToken, expiresIn);

        return accessToken;
    } catch (error) {
        console.error('Error authenticating on Monnify. Monnify error: ', error.response.data.responseMessage);
        console.error('Error authenticating on Monnify. Server error: ', error.message);
    } 
}

async function initialiseTransaction(totalAmount, customerName, customerEmail, paymentDescription) {
    try {
        const dataToSend = {
            "amount": totalAmount,
            "customerName": customerName,
            "customerEmail": customerEmail,
            "paymentReference": Date.now(),
            "paymentDescription": paymentDescription,
            "currencyCode": "NGN",
            "contractCode": monnifyContractCode,
            "redirectUrl": redirectUrl,
            "paymentMethods":[monnifyCardPaymentMethod, monnifyAccountTransferPaymentMethod]
          }
    
        const accessToken = await authenticate();

        const headers = {
            Authorization: 'Bearer ' + accessToken
        }
        const response = await axios.post(baseUrl + '/api/v1/merchant/transactions/init-transaction', dataToSend, { headers });
        const { responseBody } = response.data;
    
        return responseBody;

    } catch (error) {
        console.error('Error initialising Monnify transaction. Monnify error: ', error.response.data.responseMessage);
        console.error('Error initialising Monnify transaction. Server error: ', error.message);
    } 
}

async function handleWebhook(webhookData) {
    console.log(webhookData);
}

module.exports = {
    authenticate: authenticate,
    initialiseTransaction: initialiseTransaction,
    handleWebhook: handleWebhook
}