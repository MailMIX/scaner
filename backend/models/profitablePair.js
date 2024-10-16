const mongoose = require('mongoose'); 

const profitablePairSchema = new mongoose.Schema({
  symbol: String,
  exchange: String,
  networks: [{
    network: String,
    withdrawStatus: String,
    depositStatus: String,
    withdrawFee: Number,
  }],
  timestamp: { type: Date, default: Date.now }, // Добавляем метку времени
});

const ProfitablePair = mongoose.model('ProfitablePair', profitablePairSchema); 

module.exports = ProfitablePair;