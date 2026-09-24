// Vercel Serverless Function - Express App as API Handler
// File ini membungkus seluruh backend Express menjadi Vercel serverless function

const app = require('../backend/app');

module.exports = app;
