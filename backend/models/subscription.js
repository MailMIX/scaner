const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  features: [{ type: String }], // Например, "Доступ к сканеру", "Премиум поддержка"
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;