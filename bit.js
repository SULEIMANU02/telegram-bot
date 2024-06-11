const TelegramBot = require('node-telegram-bot-api');

// Replace with your bot token
const token = '7077709888:AAGVTE1F5xVv8gY-iAISt1xrC72DXSn1xs4';
const bot = new TelegramBot(token, { polling: true });

// URLs for register and login
const loginUrl = 'https://modestdata.com.ng/vpaccount/';
const logoUrl = 'https://cdn.glitch.global/5d4f909e-2d20-42b0-b7c2-ed206f82d9d6/icon.png?v=1716988109611';

// Object to store user data including API key and user ID
const botData = {};

// Handle /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.chat.username;
    const welcomeMessage = 'Welcome to Modest Data @' + username + '! We offer instant recharge of Airtime, Databundle, CableTV' +
        '(DStv, GOtv & Startimes), Electricity Bill Payment, Result checker and Recharge card printing. Contact Our Customer support' +
        ' here 07069099024. Please Choose your preferred language to proceed';
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'English', callback_data: 'english' }
                ],
                [
                    { text: 'Hausa', callback_data: 'hausa' }
                ]
            ]
        }
    };

    bot.sendPhoto(chatId, logoUrl, { caption: welcomeMessage, reply_markup: options.reply_markup });
});

// Handle callback queries
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const username = query.message.chat.username; // Correctly get the username inside the callback query handler

    if (query.data === 'english') {
        botData[chatId] = {}; // Initialize botData for the user
        bot.sendMessage(chatId, 'Please enter your API key:');
    } else if (query.data === 'buy_data') {
        resetUserDataExceptApiKeyAndId(chatId); // Reset all data except API key and user ID
        const networkOptionsMessage = 'Choose a network:';
        const networkOptions = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'MTN', callback_data: 'mtn' },
                        { text: 'Airtel', callback_data: 'airtel' },
                        { text: 'GLO', callback_data: 'glo' },
                        { text: '9MOBILE', callback_data: '9mobile' }
                    ]
                ]
            }
        };
        bot.sendMessage(chatId, networkOptionsMessage, networkOptions);
    } else if (query.data === 'mtn') {
        const networkOptionsMessage = 'Choose a data type:';
        const networkOptions = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'SME', callback_data: 'mtn_sme' },
                        { text: 'CORPORATE', callback_data: 'mtn_corporate' }
                    ]
                ]
            }
        };
        bot.sendMessage(chatId, networkOptionsMessage, networkOptions);
    } else if (query.data === 'mtn_sme') {
        const networkOptionsMessage = 'Choose a data plan for MTN SME:';
        const networkOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '500MB ₦130', callback_data: '500mb_mtn_sme' }],
                    [{ text: '1GB ₦260', callback_data: '1gb_mtn_sme' }],
                    [{ text: '2GB ₦520', callback_data: '2gb_mtn_sme' }],
                    [{ text: '3GB ₦780', callback_data: '3gb_mtn_sme' }],
                    [{ text: '5GB ₦1300', callback_data: '5gb_mtn_sme' }],
                    [{ text: '10GB ₦2600', callback_data: '10gb_mtn_sme' }]
                ]
            }
        };
        bot.sendMessage(chatId, networkOptionsMessage, networkOptions);
    } else if (query.data === 'mtn_corporate') {
        const networkOptionsMessage = 'Choose a data plan for MTN Corporate:';
        const networkOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '500MB ₦140', callback_data: '500mb_mtn_corporate' }],
                    [{ text: '1GB ₦270', callback_data: '1gb_mtn_corporate' }],
                    [{ text: '2GB ₦540', callback_data: '2gb_mtn_corporate' }],
                    [{ text: '3GB ₦815', callback_data: '3gb_mtn_corporate' }],
                    [{ text: '5GB ₦1400', callback_data: '5gb_mtn_corporate' }],
                    [{ text: '10GB ₦2750', callback_data: '10gb_mtn_corporate' }],
                    [{ text: '15GB ₦4100', callback_data: '15gb_mtn_corporate' }],
                    [{ text: '20GB ₦5500', callback_data: '20gb_mtn_corporate' }]
                ]
            }
        };
        bot.sendMessage(chatId, networkOptionsMessage, networkOptions);
    } else if (query.data === 'airtel' || query.data === 'glo' || query.data === '9mobile') {
        const network = query.data;
        const networkOptionsMessage = `Choose a data plan for ${network.toUpperCase()}:`;
        const networkOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '500MB ₦140', callback_data: `500mb_${network}_corporate` }],
                    [{ text: '1GB ₦270', callback_data: `1gb_${network}_corporate` }],
                    [{ text: '2GB ₦540', callback_data: `2gb_${network}_corporate` }],
                    [{ text: '3GB ₦815', callback_data: `3gb_${network}_corporate` }],
                    [{ text: '5GB ₦1400', callback_data: `5gb_${network}_corporate` }],
                    [{ text: '10GB ₦2750', callback_data: `10gb_${network}_corporate` }],
                    [{ text: '15GB ₦4100', callback_data: `15gb_${network}_corporate` }],
                    [{ text: '20GB ₦5500', callback_data: `20gb_${network}_corporate` }]
                ]
            }
        };
        bot.sendMessage(chatId, networkOptionsMessage, networkOptions);
    } else {
        // Handle data plan selection and store the selected plan
        const dataPlanMessage = getDataPlanMessage(query.data, chatId);
        if (dataPlanMessage) {
            bot.sendMessage(chatId, dataPlanMessage);
        }
    }
});

// Function to get data plan message based on callback data and store selected plan
function getDataPlanMessage(callbackData, chatId) {
    const dataPlans = {
        '500mb_mtn_sme': 'You selected MTN SME 500MB for ₦130. Please enter phone number to proceed.',
        '1gb_mtn_sme': 'You selected MTN SME 1GB for ₦260. Please enter phone number to proceed.',
        '2gb_mtn_sme': 'You selected MTN SME 2GB for ₦520. Please enter phone number to proceed.',
        '3gb_mtn_sme': 'You selected MTN SME 3GB for ₦780. Please enter phone number to proceed.',
        '5gb_mtn_sme': 'You selected MTN SME 5GB for ₦1300. Please enter phone number to proceed.',
        '10gb_mtn_sme': 'You selected MTN SME 10GB for ₦2600. Please enter phone number to proceed.',
        '500mb_mtn_corporate': 'You selected MTN Corporate 500MB for ₦140. Please enter phone number to proceed.',
        '1gb_mtn_corporate': 'You selected MTN Corporate 1GB for ₦270. Please enter phone number to proceed.',
        '2gb_mtn_corporate': 'You selected MTN Corporate 2GB for ₦540. Please enter phone number to proceed.',
        '3gb_mtn_corporate': 'You selected MTN Corporate 3GB for ₦815. Please enter phone number to proceed.',
        '5gb_mtn_corporate': 'You selected MTN Corporate 5GB for ₦1400. Please enter phone number to proceed.',
        '10gb_mtn_corporate': 'You selected MTN Corporate 10GB for ₦2750. Please enter phone number to proceed.',
        '15gb_mtn_corporate': 'You selected MTN Corporate 15GB for ₦4100. Please enter phone number to proceed.',
        '20gb_mtn_corporate': 'You selected MTN Corporate 20GB for ₦5500. Please enter phone number to proceed.',
        '500mb_airtel_corporate': 'You selected Airtel Corporate 500MB for ₦140. Please enter phone number to proceed.',
        '1gb_airtel_corporate': 'You selected Airtel Corporate 1GB for ₦270. Please enter phone number to proceed.',
        '2gb_airtel_corporate': 'You selected Airtel Corporate 2GB for ₦540. Please enter phone number to proceed.',
        '3gb_airtel_corporate': 'You selected Airtel Corporate 3GB for ₦815. Please enter phone number to proceed.',
        '5gb_airtel_corporate': 'You selected Airtel Corporate 5GB for ₦1400. Please enter phone number to proceed.',
        '10gb_airtel_corporate': 'You selected Airtel Corporate 10GB for ₦2750. Please enter phone number to proceed.',
        '15gb_airtel_corporate': 'You selected Airtel Corporate 15GB for ₦4100. Please enter phone number to proceed.',
        '20gb_airtel_corporate': 'You selected Airtel Corporate 20GB for ₦5500. Please enter phone number to proceed.',
        '500mb_glo_corporate': 'You selected GLO Corporate 500MB for ₦140. Please enter phone number to proceed.',
        '1gb_glo_corporate': 'You selected GLO Corporate 1GB for ₦270. Please enter phone number to proceed.',
        '2gb_glo_corporate': 'You selected GLO Corporate 2GB for ₦540. Please enter phone number to proceed.',
        '3gb_glo_corporate': 'You selected GLO Corporate 3GB for ₦815. Please enter phone number to proceed.',
        '5gb_glo_corporate': 'You selected GLO Corporate 5GB for ₦1400. Please enter phone number to proceed.',
        '10gb_glo_corporate': 'You selected GLO Corporate 10GB for ₦2750. Please enter phone number to proceed.',
        '15gb_glo_corporate': 'You selected GLO Corporate 15GB for ₦4100. Please enter phone number to proceed.',
        '20gb_glo_corporate': 'You selected GLO Corporate 20GB for ₦5500. Please enter phone number to proceed.',
        '500mb_9mobile_corporate': 'You selected 9MOBILE Corporate 500MB for ₦140. Please enter phone number to proceed.',
        '1gb_9mobile_corporate': 'You selected 9MOBILE Corporate 1GB for ₦270. Please enter phone number to proceed.',
        '2gb_9mobile_corporate': 'You selected 9MOBILE Corporate 2GB for ₦540. Please enter phone number to proceed.',
        '3gb_9mobile_corporate': 'You selected 9MOBILE Corporate 3GB for ₦815. Please enter phone number to proceed.',
        '5gb_9mobile_corporate': 'You selected 9MOBILE Corporate 5GB for ₦1400. Please enter phone number to proceed.',
        '10gb_9mobile_corporate': 'You selected 9MOBILE Corporate 10GB for ₦2750. Please enter phone number to proceed.',
        '15gb_9mobile_corporate': 'You selected 9MOBILE Corporate 15GB for ₦4100. Please enter phone number to proceed.',
        '20gb_9mobile_corporate': 'You selected 9MOBILE Corporate 20GB for ₦5500. Please enter phone number to proceed.'
    };

    const selectedDataPlan = dataPlans[callbackData];
    if (selectedDataPlan) {
        botData[chatId].dataPlan = callbackData; // Store the selected data plan
        return selectedDataPlan;
    }
    return null;
}

// Handle text messages for API key and user ID input
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const userState = botData[chatId];

    if (!userState) {
        return; // No state for this user, ignore the message
    }

    if (!userState.apiKey) {
        // Save the API key and ask for the user ID
        userState.apiKey = msg.text;
        bot.sendMessage(chatId, 'Please enter your User ID:');
    } else if (!userState.userId) {
        // Validate if the user ID is a number
        if (isNaN(msg.text)) {
            bot.sendMessage(chatId, 'User ID must be a number. Please enter your User ID:');
            return;
        }
        // Save the user ID and proceed to the main menu
        userState.userId = msg.text;
        const mainMenuMessage = `Welcome, your API key is ${userState.apiKey} and User ID is ${userState.userId}. What would you like to do next?`;
        const mainMenuOptions = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Buy Data', callback_data: 'buy_data' },
                        { text: 'Check Balance', callback_data: 'check_balance' }
                    ]
                ]
            }
        };
        bot.sendMessage(chatId, mainMenuMessage, mainMenuOptions);
    } else if (!userState.phoneNumber) {
        // Validate if the phone number is an 11-digit number
        const phoneNumber = msg.text.trim();
        if (!/^\d{11}$/.test(phoneNumber)) {
            bot.sendMessage(chatId, 'Phone number must be an 11-digit number. Please enter your phone number:');
            return;
        }
        // Save the phone number and proceed with the data plan selection
        userState.phoneNumber = phoneNumber;

        const { dataPlan } = userState;
        const [amount, network, dataType] = dataPlan.split('_');

        const dataurl = `https://modestdata.com.ng/vend/data/?network=${network}&dataplan=${dataType}&number=${phoneNumber}&amount=${amount}&apiKey=${userState.apiKey}&userId=${userState.userId}`;
        const confirmationMessage = `You selected ${dataType.toUpperCase()} ${amount.toUpperCase()}MB on ${network.toUpperCase()} for ₦${getPrice(dataPlan)}. Proceed with payment: ${dataurl}`;

        bot.sendMessage(chatId, confirmationMessage);
    }
});

// Function to get the price of a data plan based on callback data
function getPrice(dataPlan) {
    const prices = {
        '500mb_mtn_sme': 130,
        '1gb_mtn_sme': 260,
        '2gb_mtn_sme': 520,
        '3gb_mtn_sme': 780,
        '5gb_mtn_sme': 1300,
        '10gb_mtn_sme': 2600,
        '500mb_mtn_corporate': 140,
        '1gb_mtn_corporate': 270,
        '2gb_mtn_corporate': 540,
        '3gb_mtn_corporate': 815,
        '5gb_mtn_corporate': 1400,
        '10gb_mtn_corporate': 2750,
        '15gb_mtn_corporate': 4100,
        '20gb_mtn_corporate': 5500,
        '500mb_airtel_corporate': 140,
        '1gb_airtel_corporate': 270,
        '2gb_airtel_corporate': 540,
        '3gb_airtel_corporate': 815,
        '5gb_airtel_corporate': 1400,
        '10gb_airtel_corporate': 2750,
        '15gb_airtel_corporate': 4100,
        '20gb_airtel_corporate': 5500,
        '500mb_glo_corporate': 140,
        '1gb_glo_corporate': 270,
        '2gb_glo_corporate': 540,
        '3gb_glo_corporate': 815,
        '5gb_glo_corporate': 1400,
        '10gb_glo_corporate': 2750,
        '15gb_glo_corporate': 4100,
        '20gb_glo_corporate': 5500,
        '500mb_9mobile_corporate': 140,
        '1gb_9mobile_corporate': 270,
        '2gb_9mobile_corporate': 540,
        '3gb_9mobile_corporate': 815,
        '5gb_9mobile_corporate': 1400,
        '10gb_9mobile_corporate': 2750,
        '15gb_9mobile_corporate': 4100,
        '20gb_9mobile_corporate': 5500
    };
    return prices[dataPlan] || 0;
}

// Function to reset all user data except API key and user ID
function resetUserDataExceptApiKeyAndId(chatId) {
    botData[chatId] = {
        apiKey: botData[chatId].apiKey,
        userId: botData[chatId].userId
    };
}
