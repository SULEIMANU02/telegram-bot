import TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';


// Replace with your bot token
const token = '7077709888:AAGVTE1F5xVv8gY-iAISt1xrC72DXSn1xs4';
const bot = new TelegramBot(token, { polling: true });

// URLs for register and login
const loginUrl = 'https://modestdata.com.ng/vpaccount/';
const logoUrl = 'https://cdn.glitch.global/5d4f909e-2d20-42b0-b7c2-ed206f82d9d6/icon.png?v=1716988109611';

// Object to store user data including API key and user ID
const botData = {};

// Function to map data plan to a number

function getPlanNumber(dataPlan) {
  const planMappings = {
      '500mb_mtn_sme': 1,
      '1gb_mtn_sme': 2,
      '2gb_mtn_sme': 3,
      '3gb_mtn_sme': 4,
      '5gb_mtn_sme': 5,
      '10gb_mtn_sme': 6,
      '500mb_mtn_corporate': 89,
      '1gb_mtn_corporate': 90,
      '2gb_mtn_corporate': 91,
      '3gb_mtn_corporate': 92,
      '5gb_mtn_corporate': 93,
      '10gb_mtn_corporate': 94,
      '15gb_mtn_corporate': 95,
      '20gb_mtn_corporate': 96,
      '500mb_airtel_corporate': 100,
      '1gb_airtel_corporate': 101,
      '2gb_airtel_corporate': 102,
      '5gb_airtel_corporate': 103,
      '10gb_airtel_corporate': 104,
      '15gb_airtel_corporate': 105,
      '20gb_airtel_corporate': 106,
      '500mb_glo_corporate': 122,
      '1gb_glo_corporate': 123,
      '2gb_glo_corporate': 124,
      '3gb_glo_corporate': 125,
      '5gb_glo_corporate': 126,
      '10gb_glo_corporate': 127,
      '500mb_9mobile_corporate': 111,
      '1gb_9mobile_corporate': 112,
      '2gb_9mobile_corporate': 113,
      '3gb_9mobile_corporate': 114,
      '4gb_9mobile_corporate': 115,
      '10gb_9mobile_corporate': 116,
  };
  return planMappings[dataPlan] || 0;
}


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

async function checkBalance(apiKey, userId) {
  const balanceUrl = `https://modestdata.com.ng/wp-content/plugins/vprest/?q=user&id=${userId}&apikey=${apiKey}`;
  const response = await fetch(balanceUrl);
  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// Function to reset user data except for API key and user ID
function resetUserData(chatId) {
  const apiKey = botData[chatId].apiKey;
  const userId = botData[chatId].userId;
  botData[chatId] = { apiKey, userId }; // Preserve apiKey and userId, reset other data
}

// Handle callback queries
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const username = query.message.chat.username; // Correctly get the username inside the callback query handler

    if (query.data === 'english') {    
      botData[chatId] = {}; // Initialize botData for the user
      const welcomeMessage = 'To proceed \n If you are a new user kindly click on the sign up button to create an account.' +
      '\n If you already have an account with Modest Data kindly click on Get Apikey and user Id, login then copy the apikey written inside bracket and paste it here';
      const options = {
          reply_markup: {
              inline_keyboard: [
                  [
                      { text: 'Sign Up',web_app: { url: 'https://modestdata.com.ng/?register' } }
                  ],
                  [
                      { text: 'Get Apikey and user ID', web_app: { url: 'https://modestdata.com.ng/?vend=developer' } }
                  ]
              ]
          }
      };
    const apiurl = 'https://cdn.glitch.global/5d4f909e-2d20-42b0-b7c2-ed206f82d9d6/apiid.jpeg?v=1717413283154'
      bot.sendPhoto(chatId, apiurl, { caption: welcomeMessage, reply_markup: options.reply_markup });
    } else if (query.data === 'buy_data') {
        resetUserData(chatId); // Reset data except for API key and user ID
        const networkOptionsMessage = 'Choose a network:';
        const networkOptions = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'MTN', callback_data: 'mtn' },
                        { text: 'Airtel', callback_data: 'airtel' },
                        { text: 'GLO', callback_data: 'glo' },
                        { text: '9MOBILE', callback_data: '9mobile' }
                    ],
                    [{ text: 'Cancel', callback_data: 'cancel' }]
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
                    ],
                    [{ text: 'Cancel', callback_data: 'cancel' }]
                ]
            }
        };
        bot.sendMessage(chatId, networkOptionsMessage, networkOptions);
    } else if (query.data === 'mtn_sme') {
        const dataType = query.data === 'mtn_sme' ? 'sme' : 'corporate';
        botData[chatId].dataType = dataType; // Store the selected data type

        const networkOptionsMessage = `Choose a data plan for MTN ${dataType.toUpperCase()}:`;
        const networkOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '500MB ₦130', callback_data: `500mb_mtn_${dataType}` }],
                    [{ text: '1GB ₦260', callback_data: `1gb_mtn_${dataType}` }],
                    [{ text: '2GB ₦520', callback_data: `2gb_mtn_${dataType}` }],
                    [{ text: '3GB ₦780', callback_data: `3gb_mtn_${dataType}` }],
                    [{ text: '5GB ₦1300', callback_data: `5gb_mtn_${dataType}` }],
                    [{ text: '10GB ₦2600', callback_data: `10gb_mtn_${dataType}` }],
                    [{ text: 'Cancel', callback_data: 'cancel' }]
                ]
            }
        };
        bot.sendMessage(chatId, networkOptionsMessage, networkOptions);
    } else if (query.data === 'mtn_corporate') {
      const dataType = query.data === 'mtn_sme' ? 'sme' : 'corporate';
      botData[chatId].dataType = dataType; // Store the selected data type

      const networkOptionsMessage = `Choose a data plan for MTN ${dataType.toUpperCase()}:`;
      const networkOptions = {
          reply_markup: {
              inline_keyboard: [
                  [{ text: '500MB ₦140', callback_data: `500mb_mtn_${dataType}` }],
                  [{ text: '1GB ₦270', callback_data: `1gb_mtn_${dataType}` }],
                  [{ text: '2GB ₦540', callback_data: `2gb_mtn_${dataType}` }],
                  [{ text: '3GB ₦815', callback_data: `3gb_mtn_${dataType}` }],
                  [{ text: '5GB ₦1400', callback_data: `5gb_mtn_${dataType}` }],
                  [{ text: '10GB ₦4100', callback_data: `15gb_mtn_${dataType}` }],
                  [{ text: '15GB ₦5500', callback_data: `20gb_mtn_${dataType}` }],
                  [{ text: 'Cancel', callback_data: 'cancel' }]
              ]
          }
      };
      bot.sendMessage(chatId, networkOptionsMessage, networkOptions);
  }  else if (query.data === 'airtel') {
        const network = query.data;
        botData[chatId].dataType = 'corporate'; // Set type to corporate for non-MTN networks
        const networkOptionsMessage = `Choose a data plan for ${network.toUpperCase()}:`;
        const networkOptions = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '500MB ₦142', callback_data: `500mb_${network}_corporate` }],
                    [{ text: '1GB ₦280', callback_data: `1gb_${network}_corporate` }],
                    [{ text: '2GB ₦560', callback_data: `2gb_${network}_corporate` }],
                    [{ text: '5GB ₦1400', callback_data: `5gb_${network}_corporate` }],
                    [{ text: '10GB ₦2800', callback_data: `10gb_${network}_corporate` }],
                    [{ text: '15GB ₦4200', callback_data: `15gb_${network}_corporate` }],
                    [{ text: '20GB ₦5600', callback_data: `20gb_${network}_corporate` }],
                    [{ text: 'Cancel', callback_data: 'cancel' }]
                ]
            }
        };
        bot.sendMessage(chatId, networkOptionsMessage, networkOptions);
    } else if (query.data === 'glo') {
      const network = query.data;
      botData[chatId].dataType = 'corporate'; // Set type to corporate for non-MTN networks
      const networkOptionsMessage = `Choose a data plan for ${network.toUpperCase()}:`;
      const networkOptions = {
          reply_markup: {
              inline_keyboard: [
                  [{ text: '500MB ₦125', callback_data: `500mb_${network}_corporate` }],
                  [{ text: '1GB ₦235', callback_data: `1gb_${network}_corporate` }],
                  [{ text: '2GB ₦470', callback_data: `2gb_${network}_corporate` }],
                  [{ text: '3GB ₦708', callback_data: `3gb_${network}_corporate` }],
                  [{ text: '5GB ₦1200', callback_data: `5gb_${network}_corporate` }],
                  [{ text: '10GB ₦2400', callback_data: `10gb_${network}_corporate` }],
                  [{ text: 'Cancel', callback_data: 'cancel' }]
              ]
          }
      };
      bot.sendMessage(chatId, networkOptionsMessage, networkOptions);
  } else if (query.data === '9mobile') {
    const network = query.data;
    botData[chatId].dataType = 'corporate'; // Set type to corporate for non-MTN networks
    const networkOptionsMessage = `Choose a data plan for ${network.toUpperCase()}:`;
    const networkOptions = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '500MB ₦100', callback_data: `500mb_${network}_corporate` }],
                [{ text: '1GB ₦160', callback_data: `1gb_${network}_corporate` }],
                [{ text: '2GB ₦400', callback_data: `2gb_${network}_corporate` }],
                [{ text: '3GB ₦600', callback_data: `3gb_${network}_corporate` }],
                [{ text: '4GB ₦800', callback_data: `4gb_${network}_corporate` }],
                [{ text: '10GB ₦2000', callback_data: `10gb_${network}_corporate` }],
                [{ text: '15GB ₦4100', callback_data: `15gb_${network}_corporate` }],
                [{ text: 'Cancel', callback_data: 'cancel' }]
            ]
        }
    };
    bot.sendMessage(chatId, networkOptionsMessage, networkOptions);
}else if (query.data === 'hausa') {
  botData[chatId] = {}; // Initialize botData for the user
  bot.sendMessage(chatId, 'coming soon...! be frequently restarting the bot to get latest updates \n /start');
} else if (query.data === 'cancel') {
  bot.sendMessage(chatId, 'Operation cancelled. What would you like to do next?', {
      reply_markup: {
          inline_keyboard: [
              [{ text: 'Buy Data', callback_data: 'buy_data' }],
              [{ text: 'Fund Wallet', web_app: { url: 'https://modestdata.com.ng/?vend=wallet' } }],
              [{ text: 'Check Balance', callback_data: 'check_balance' }]
          ]
      }
  });
  botData[chatId] = { apiKey: botData[chatId].apiKey, userId: botData[chatId].userId };
}  else {
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

    const message = dataPlans[callbackData];
    if (message) {
        botData[chatId].selectedPlan = callbackData; // Store selected plan for the user
        bot.sendMessage(chatId, message, {
          reply_markup: {
              inline_keyboard: [
                  [{ text: 'Cancel', callback_data: 'cancel' }]
              ]
          }
      });
    }
  
}


// Handle text messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text.trim();

    if (!botData[chatId]) {
        // Check if botData is initialized for the user
        return;
    }

    if (!botData[chatId].apiKey) {
        // Store API key
        botData[chatId].apiKey = text;
        bot.sendMessage(chatId, 'API key saved. Please enter your user ID:');
    } else if (!botData[chatId].userId) {
        // Validate user ID
        if (!/^\d+$/.test(text)) {
            bot.sendMessage(chatId, 'Invalid user ID. Please enter a valid numeric user ID:');
            return;
        }
        // Store user ID
        botData[chatId].userId = text;
        bot.sendMessage(chatId, 'User ID saved. What would you like to do next?', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Buy Data', callback_data: 'buy_data' }],
                    [{ text: 'Fund Wallet', web_app: { url: 'https://modestdata.com.ng/?vend=wallet' } }],
                    [{ text: 'Check Balance', callback_data: 'check_balance' }]
                ]
            }
        });
    } else if (botData[chatId].selectedPlan && !botData[chatId].phoneNumber) {
        if (!/^\d{11}$/.test(text)) {
            bot.sendMessage(chatId, 'Invalid phone number. Please enter an 11-digit phone number:');
            return;
        }
        // Store phone number
        botData[chatId].phoneNumber = text;
        const selectedPlan = botData[chatId].selectedPlan;
        const confirmationMessage = `You have selected plan ${selectedPlan} for phone number ${text}. Do you want to proceed?`;
        bot.sendMessage(chatId, confirmationMessage, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Yes', callback_data: 'confirm_purchase' }],
                    [{ text: 'No', callback_data: 'cancel' }]
                ]
            }
        });
    } 
});


bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  if (!botData[chatId]) {
      bot.sendMessage(chatId, 'No data found for this chat. Please start again.\n /start');
      return;
  }

  if (query.data === 'confirm_purchase') {
      const { userId, apiKey, phoneNumber, selectedPlan } = botData[chatId];
      const network = selectedPlan.split('_')[1]; // Extract the network from the selected plan
      const dataType = selectedPlan.split('_')[2]; // Extract the data type from the selected plan
      const planNumber = getPlanNumber(selectedPlan); // Get the plan number based on the selected plan
      const purchaseUrl = `https://modestdata.com.ng/wp-content/plugins/vprest/?id=${userId}&apikey=${apiKey}&q=data&phone=${phoneNumber}&network=${network}&type=${dataType}&dataplan=${planNumber}`;

      try {
          // Fetch the JSON response from the purchase URL
          const purchaseResponse = await fetch(purchaseUrl);
          if (!purchaseResponse.ok) {
              throw new Error(`HTTP error! status: ${purchaseResponse.status}`);
          }
          const purchaseJsonResponse = await purchaseResponse.json();

          if (purchaseJsonResponse.message === "Balance Too Low") {
              // Fetch the balance from the balance URL
              const balanceJsonResponse = await checkBalance(apiKey, userId);
              bot.sendMessage(chatId, `Warning⚠️ \nInsufficient balance. Your current balance is ${balanceJsonResponse.Balance}.`, {
                  reply_markup: {
                      inline_keyboard: [
                        [{ text: 'Fund Wallet', web_app: { url: 'https://modestdata.com.ng/?vend=wallet' } }],
                        [{ text: 'Retry', callback_data: 'cancel' }]
                      ]
                  }
              });
          } else if (purchaseJsonResponse.message === "API KEY INCORRECT") {
              bot.sendMessage(chatId, 'API key incorrect. Please restart the bot by clicking the button below. \n/start');
          } else if (purchaseJsonResponse.Successful === "true") {
            bot.sendMessage(chatId, `Transaction Succesful!✅ \n ${purchaseJsonResponse.message}\nPrevious Balance: ${purchaseJsonResponse.Previous_Balance}\nCurrent Balance: ${purchaseJsonResponse.Current_Balance}\nAmount Charged: ${purchaseJsonResponse.Amount_Charged}`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Cancel', callback_data: 'cancel' }]
                    ]
                }
            });
            botData[chatId] = { apiKey: botData[chatId].apiKey, userId: botData[chatId].userId };
        } else {
              // Send the relevant details back to the user
              bot.sendMessage(chatId, `Purchase confirmed. Here are the details:\n\nStatus: ${purchaseJsonResponse.Status}\nSuccessful: ${purchaseJsonResponse.Successful}\nMessage: ${purchaseJsonResponse.message}\nPrevious Balance: ${purchaseJsonResponse.Previous_Balance}\nCurrent Balance: ${purchaseJsonResponse.Current_Balance}\nAmount Charged: ${purchaseJsonResponse.Amount_Charged}\nData Plan: ${purchaseJsonResponse.Data_Plan}\nPlan Code: ${purchaseJsonResponse.Plan_Code}\nData Type: ${purchaseJsonResponse.Data_Type}\nNetwork: ${purchaseJsonResponse.Network}\nReceiver: ${purchaseJsonResponse.Receiver}`, { parse_mode: 'Markdown' });

              // Reset stored data except apiKey and userId
              botData[chatId] = { apiKey: botData[chatId].apiKey, userId: botData[chatId].userId };
          }
      } catch (error) {
          console.error('Error fetching the URL:', error);
          bot.sendMessage(chatId, 'An error occurred while processing your request.');
      }
  } else if (query.data === 'retry_purchase') {
      bot.sendMessage(chatId, 'Please start the purchase process again.');
  } else if (query.data === 'check_balance') {
    const balanceJsonResponse = await checkBalance(botData[chatId].apiKey, botData[chatId].userId);
    const username = query.message.chat.username;
      if (balanceJsonResponse.message === 'API KEY INCORRECT') {
        bot.sendMessage(chatId, 'Warning⚠️ \nEither your APIKEY or User ID is incorrect please /start over');
        botData[chatId] = { };
      } else {
        bot.sendMessage(chatId, `Dear ${username}. Your current balance is ${balanceJsonResponse.Balance}`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Fund Wallet', web_app: { url: 'https://modestdata.com.ng/?vend=wallet' } }],
                    [{ text: 'Cancel', callback_data: 'cancel' }]
                ]
            }
        });
        botData[chatId] = { apiKey: botData[chatId].apiKey, userId: botData[chatId].userId };
      }
    
}
});
