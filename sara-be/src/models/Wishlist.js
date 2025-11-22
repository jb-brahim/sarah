const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
      itemType: { type: String, enum: ['site', 'hotel', 'tour'], required: true },
      meta: Object,
    },
  ],
});

module.exports = mongoose.model('Wishlist', WishlistSchema);
