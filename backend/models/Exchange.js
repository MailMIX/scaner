const mongoose = require('mongoose');

const ExchangeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  apiKey: {
    type: String,
    required: true,
  },
  apiSecret: {
    type: String,
    required: true,
  },
});

const Exchange = mongoose.model('Exchange', ExchangeSchema);

module.exports = Exchange; 