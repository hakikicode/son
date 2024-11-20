const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
require('dotenv').config();

// Bot setup
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// In-memory storage for simplicity
let users = [];
let referrals = {};

// Message handlers
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to Smart Open Network Bot!\n\nCommands:\n/register - Register for Airdrop\n/referral - Get your referral link\n/faqs - Frequently Asked Questions\n/stats - View stats');
});

bot.onText(/\/register/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || `User_${chatId}`;
    if (!users.find(user => user.chatId === chatId)) {
        users.push({ chatId, username, wallet: null });
        bot.sendMessage(chatId, 'Please provide your wallet address:');
        bot.once('message', (response) => {
            const wallet = response.text;
            users.find(user => user.chatId === chatId).wallet = wallet;
            bot.sendMessage(chatId, `Registration successful! Wallet: ${wallet}`);
        });
    } else {
        bot.sendMessage(chatId, 'You are already registered!');
    }
});

bot.onText(/\/referral/, (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username || `User_${chatId}`;
    referrals[username] = referrals[username] || [];
    bot.sendMessage(chatId, `Your referral link: https://t.me/SmartOpenBot?start=${username}`);
});

bot.onText(/\/stats/, (msg) => {
    const chatId = msg.chat.id;
    const stats = `Total Users: ${users.length}\nTotal Referrals: ${Object.keys(referrals).length}`;
    bot.sendMessage(chatId, stats);
});

bot.onText(/\/faqs/, (msg) => {
    const chatId = msg.chat.id;
    const faqs = `FAQs:\n1. What is SON? - A blockchain token on TON.\n2. What is SMART? - A token on Koii network.\n3. How to earn? - Complete tasks and refer users!`;
    bot.sendMessage(chatId, faqs);
});

// Referral tracking
bot.onText(/\/start (.+)/, (msg, match) => {
    const referrer = match[1];
    const username = msg.from.username || `User_${msg.chat.id}`;
    if (referrals[referrer]) {
        referrals[referrer].push(username);
    } else {
        referrals[referrer] = [username];
    }
    bot.sendMessage(msg.chat.id, `Thanks for joining through ${referrer}'s referral!`);
});
