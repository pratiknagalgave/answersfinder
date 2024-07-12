
const token = '7164642800:AAGuiY2i_4G5_slyvKmf4q35fDJPdiW1_cQ';
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cheerio = require('cheerio');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Hello! Send me a text and I will extract all the emails from it.');
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const url = msg.text;

    // Check if the message is a URL
    if (isValidUrl(url)) {
        try {
            // Fetch the website content
            const { data } = await axios.get(url);
            
            // Load the HTML into cheerio
            const $ = cheerio.load(data);
            
            // Extract the desired data (example: title of the page)
            const title = $('title').text();
            
            // Send the extracted data back to the user
            bot.sendMessage(chatId, `Title of the page: ${title}`);
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, 'Failed to fetch the data. Please try again later.');
        }
    } else {
        bot.sendMessage(chatId, 'Please send a valid URL.');
    }
});

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
