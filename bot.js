require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;

const token = '6522836138:AAEJuk5QQ0Wp-YdCyv5ca9cZM0uL5ombtH4';
const bot = new TelegramBot(token, { polling: true });

// Serve the HTML file
app.get('/', (req, res) => {
    return "hellow World";
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

async function scrapeStockData(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const data = [];
        $('table.mctable1 tbody tr').each((index, element) => {
            const companyName = $(element).find('td:nth-child(1) a').text().trim();
            const currentPrice = $(element).find('td:nth-child(2)').text().trim();
            const percentageChange = $(element).find('td:nth-child(3)').text().trim();

            data.push(`${companyName}: $${currentPrice} (${percentageChange})`);
        });

        return data.join('\n');
    } catch (error) {
        console.error('Error fetching data:', error);
        return 'Error fetching data. Please try again later.';
    }
}

// Command to get top gainers
bot.onText(/\/topgainers/, async (msg) => {
    const chatId = msg.chat.id;
    const url = 'https://www.moneycontrol.com/stocksmarketsindia';

    const stockData = await scrapeStockData(url);
   sendLongMessage(chatId, `Top Gainers:\n${stockData}`);
});

// Command to get top losers
bot.onText(/\/toplosers/, async (msg) => {
    const chatId = msg.chat.id;
    const url = 'https://www.moneycontrol.com/stocksmarketsindia';

    const stockData = await scrapeStockData(url);
    sendLongMessage(chatId, `Top Loosers:\n${stockData}`);
});

const url = 'https://en.wikipedia.org/wiki/Main_Page';

// Function to fetch and extract data from the website
const fetchData = async () => {
  try {
    // Fetch the HTML of the website
    const { data } = await axios.get(url);
    // Load the HTML into Cheerio
    const $ = cheerio.load(data);
      let response = 'heads:';

    // Select and extract the data
    const headlines = [];
    $('#mp-itn b a').each((index, element) => {
      const headline = $(element).text().trim();
      headlines.push(headline);
    });

    // Output the extracted data
    console.log('Headlines from the "In the news" section:');
    headlines.forEach((headline, index) => {
      console.log(`${index + 1}. ${headline}`);
        response +=`${index + 1}. ${headline}\n\n`;
    });

      return response;

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

function sendLongMessage(chatId, message) {
    const maxMessageLength = 4096;
    let start = 0;

    while (start < message.length) {
        const chunk = message.slice(start, start + maxMessageLength);
        bot.sendMessage(chatId, chunk);
        start += maxMessageLength;
    }
}


bot.onText(/\/head/, async (msg) => {
    const chatId = msg.chat.id;
    const heads = 'heads: ';
   const hhh = await fetchData();
 
      bot.sendMessage(chatId, hhh);
});
   

bot.onText(/\/up/, async (msg) => {
        const chatId = msg.chat.id;
   bot.sendMessage(chatId, 'updated 3');
});

console.log('Bot is running...');
