const express = require('express');
const cors = require('cors');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = process.env.PORT || 3000;

// ربات تلگرام
const bot = new TelegramBot('7771534047:AAEXLvgdy43gAsNU9W5XNtAS_lQ8KIU1uPs', { polling: true });

// فایل ذخیره کاربران
const usersFile = __dirname + '/users.json';

// آیدی عددی شما
const adminId = 1185175495;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// شروع ربات
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const username = msg.from.username || `User${userId}`;

    // ذخیره کردن یوزر
    saveUser({ userId, username });

    // ارسال لینک بازی
    bot.sendMessage(chatId, `سلام ${username}! آماده‌ای برای بازی؟
روی دکمه زیر کلیک کن:`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: "شروع بازی!", web_app: { url: 'https://your-render-app-name.onrender.com' } }]
            ]
        }
    });
});

// دریافت پیام تبلیغاتی از ادمین و ارسال به همه کاربران
bot.onText(/\/send_advertisement (.+)/, (msg, match) => {
    const senderId = msg.from.id;
    if (senderId !== adminId) {
        return bot.sendMessage(msg.chat.id, 'شما دسترسی به این فرمان ندارید.');
    }

    const advertisement = match[1];
    const users = getUsers();

    users.forEach(user => {
        bot.sendMessage(user.userId, `تبلیغ جدید:\n\n${advertisement}`);
    });

    bot.sendMessage(senderId, 'تبلیغ برای همه ارسال شد!');
});

// ذخیره و خواندن کاربران
function saveUser(user) {
    let users = [];
    if (fs.existsSync(usersFile)) {
        users = JSON.parse(fs.readFileSync(usersFile));
    }

    if (!users.find(u => u.userId === user.userId)) {
        users.push(user);
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    }
}

function getUsers() {
    if (!fs.existsSync(usersFile)) return [];
    return JSON.parse(fs.readFileSync(usersFile));
}

// راه‌اندازی سرور
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});