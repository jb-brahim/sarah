const Wishlist = require('../models/Wishlist');

const getForUser = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    res.json(wishlist?.items || []);
  } catch (err) {
    next(err);
  }
};

const addItem = async (req, res, next) => {
  try {
    const { itemId, itemType, meta } = req.body;
    if (!itemId || !itemType) return res.status(400).json({ message: 'Missing fields' });

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [{ itemId, itemType, meta }] });
      return res.status(201).json(wishlist.items);
    }

    const exists = wishlist.items.find((i) => i.itemId.toString() === itemId.toString());
    if (exists) return res.status(200).json(wishlist.items);

    wishlist.items.push({ itemId, itemType, meta });
    await wishlist.save();
    res.json(wishlist.items);
  } catch (err) {
    next(err);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    wishlist.items = wishlist.items.filter((i) => i.itemId.toString() !== itemId.toString());
    await wishlist.save();
    res.json(wishlist.items);
  } catch (err) {
    next(err);
  }
};

module.exports = { getForUser, addItem, removeItem };
