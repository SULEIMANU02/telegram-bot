const TelegramBot = require('node-telegram-bot-api');

// Replace with your bot token
const token = '7077709888:AAGVTE1F5xVv8gY-iAISt1xrC72DXSn1xs4';
const bot = new TelegramBot(token, { polling: true });

// URLs for register and login
const loginUrl = 'https://modestdata.com.ng/vpaccount/';
const logoUrl = 'https://cdn.glitch.global/5d4f909e-2d20-42b0-b7c2-ed206f82d9d6/icon.png?v=1716988109611';

// Object to store data plan selection
const botData = {};

// Handle /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.chat.username;
    const welcomeMessage = 'Welcome to Modest Data @' + username + '! We offer instant recharge of Airtime, Databundle, CableTV' +
        '(DStv, GOtv & Startimes), Electricity Bill Payment, Result checker and Recharge card printing. Contact Our Customer support' +
        ' here 07069099024'   + 'Please Choose your prefered language to proceed';
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

// Handle incoming messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // Ignore bot commands
    if (msg.entities && msg.entities[0].type === 'bot_command') {
        return;
    }

    // Handle phone number input for data plan purchase
    if (botData[chatId] && botData[chatId].plan) {
        const phoneNumber = msg.text;

        if (/^\d{11}$/.test(phoneNumber)) {
         const welcomeMessage =   'Your phone number is valid. Proceeding with the purchase...';
        const options = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Login or Register', web_app: { url: loginUrl } }
                    ]
                ]
            }
        };
            // The phone number is valid, you can proceed with the purchase
            bot.sendMessage(chatId, welcomeMessage, options);
            
            // Clear the stored data plan
            delete botData[chatId].plan;

            // Here you can add the logic to process the purchase with the phone number and selected data plan

        } else {
            // The phone number is invalid, request the user to enter a valid one
            bot.sendMessage(chatId, 'Invalid phone number. Please enter an 11-digit phone number:');
        }
        return;
    }

    const username = msg.chat.username;
    const welcomeMessage = 'Welcome! @' + username + ' for any issue kindly contact customer care at 07069099024. Please choose an option:';
    const options = {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Buy Data', callback_data: 'buy_data' }
                ],
                [
                    { text: 'Buy Airtime', web_app: { url: 'https://modestdata.com.ng/?vend=airtime' } }
                ],
                [
                    { text: 'Fund Wallet', web_app: { url: 'https://modestdata.com.ng/?vend=wallet' } }
                ]
            ]
        }
    };

    bot.sendMessage(chatId, welcomeMessage, options);
});

// Handle callback queries
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    if (query.data === 'english') {
      const welcomeMessage = 'Welcome! @' + username + ' for any issue kindly contact customer care at 07069099024. Please choose an option:';
      const options = {
          reply_markup: {
              inline_keyboard: [
                  [
                      { text: 'Buy Data', callback_data: 'buy_data' }
                  ],
                  [
                      { text: 'Buy Airtime', web_app: { url: 'https://modestdata.com.ng/?vend=airtime' } }
                  ],
                  [
                      { text: 'Fund Wallet', web_app: { url: 'https://modestdata.com.ng/?vend=wallet' } }
                  ]
              ]
          }
      };
      bot.sendMessage(chatId, welcomeMessage, options);
    }else if (query.data === 'buy_data') {
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
    } else if (query.data === 'airtel') {
        const networkOptionsMessage = 'Choose a data plan for Airtel:';
        const networkOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '500MB ₦142', callback_data: '500mb_airtel' }],
                    [{ text: '1GB ₦280', callback_data: '1gb_airtel' }],
                    [{ text: '2GB ₦560', callback_data: '2gb_airtel' }],
                    [{ text: '5GB ₦1400', callback_data: '5gb_airtel' }],
                    [{ text: '10GB ₦2800', callback_data: '10gb_airtel' }],
                    [{ text: '15GB ₦4200', callback_data: '15gb_airtel' }],
                    [{ text: '20GB ₦5600', callback_data: '20gb_airtel' }]
                ]
            }
        };

        bot.sendMessage(chatId, networkOptionsMessage, networkOptions);
    } else if (query.data === 'glo') {
        const networkOptionsMessage = 'Choose a data plan for Glo:';
        const networkOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '500MB ₦125', callback_data: '500mb_glo' }],
                    [{ text: '1GB ₦235', callback_data: '1gb_glo' }],
                    [{ text: '2GB ₦470', callback_data: '2gb_glo' }],
                    [{ text: '3GB ₦708', callback_data: '3gb_glo' }],
                    [{ text: '5GB ₦1200', callback_data: '5gb_glo' }],
                    [{ text: '10GB ₦2400', callback_data: '10gb_glo' }]
                ]
            }
        };

        bot.sendMessage(chatId, networkOptionsMessage, networkOptions);
    } else if (query.data === '9mobile') {
        const networkOptionsMessage = 'Choose a data plan for 9mobile:';
        const networkOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '500MB ₦100', callback_data: '500mb_9mobile' }],
                    [{ text: '1GB ₦160', callback_data: '1gb_9mobile' }],
                    [{ text: '2GB ₦400', callback_data: '2gb_9mobile' }],
                    [{ text: '3GB ₦600', callback_data: '3gb_9mobile' }],
                    [{ text: '4GB ₦800', callback_data: '4gb_9mobile' }],
                    [{ text: '10GB ₦2000', callback_data: '10gb_9mobile' }]
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
        '500mb_airtel': 'You selected Airtel 500MB for ₦142. Please enter phone number to proceed.',
        '1gb_airtel': 'You selected Airtel 1GB for ₦280. Please enter phone number to proceed.',
        '2gb_airtel': 'You selected Airtel 2GB for ₦560. Please enter phone number to proceed.',
        '5gb_airtel': 'You selected Airtel 5GB for ₦1400. Please enter phone number to proceed.',
        '10gb_airtel': 'You selected Airtel 10GB for ₦2800. Please enter phone number to proceed.',
        '15gb_airtel': 'You selected Airtel 15GB for ₦4200. Please enter phone number to proceed.',
        '20gb_airtel': 'You selected Airtel 20GB for ₦5600. Please enter phone number to proceed.',
        '500mb_glo': 'You selected Glo 500MB for ₦125. Please enter phone number to proceed.',
        '1gb_glo': 'You selected Glo 1GB for ₦235. Please enter phone number to proceed.',
        '2gb_glo': 'You selected Glo 2GB for ₦470. Please enter phone number to proceed.',
        '3gb_glo': 'You selected Glo 3GB for ₦708. Please enter phone number to proceed.',
        '5gb_glo': 'You selected Glo 5GB for ₦1200. Please enter phone number to proceed.',
        '10gb_glo': 'You selected Glo 10GB for ₦2400. Please enter phone number to proceed.',
        '500mb_9mobile': 'You selected 9mobile 500MB for ₦100. Please enter phone number to proceed.',
        '1gb_9mobile': 'You selected 9mobile 1GB for ₦160. Please enter phone number to proceed.',
        '2gb_9mobile': 'You selected 9mobile 2GB for ₦400. Please enter phone number to proceed.',
        '3gb_9mobile': 'You selected 9mobile 3GB for ₦600. Please enter phone number to proceed.',
        '4gb_9mobile': 'You selected 9mobile 4GB for ₦800. Please enter phone number to proceed.',
        '10gb_9mobile': 'You selected 9mobile 10GB for ₦2000. Please enter phone number to proceed.'
    };

    // Store the selected plan in botData
    botData[chatId] = { plan: callbackData };

    return dataPlans[callbackData];
}

// Start the bot
console.log('Bot is running...');
