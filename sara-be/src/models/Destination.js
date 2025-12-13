const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    region: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number, default: 0 },
    tags: [String],
    temperature: Number
}, { timestamps: true });

module.exports = mongoose.model('Destination', DestinationSchema);
