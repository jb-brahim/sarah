const Destination = require('../models/Destination');

exports.getAllDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find().sort({ id: 1 }); // Sort by string ID might be tricky if not padded, but IDs are "1".."14"
        // Users might want numeric sort, but string sort "1", "10", "11"... is typical default.
        // Given the ID is for translation lookup, order might not strictly matter if frontend grid adjusts, 
        // but better to keep order.
        // Let's rely on creation order or just send them.
        res.json(destinations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.seedDestinations = async (req, res) => {
    try {
        await Destination.deleteMany({});

        const destinations = [
            {
                id: "1",
                name: "Santorini",
                region: "Greece",
                description: "Stunning caldera views and ancient history awaits",
                image: "/santorini-greece-white-buildings-sunset.jpg",
                rating: 4.9,
                tags: ["Beach", "History", "Romance"],
                temperature: 28,
            },
            {
                id: "2",
                name: "Kyoto",
                region: "Japan",
                description: "Temples, gardens, and traditional Japanese culture",
                image: "/kyoto-japan-temple-bamboo-forest.jpg",
                rating: 4.8,
                tags: ["Culture", "History", "Nature"],
                temperature: 22,
            },
            {
                id: "3",
                name: "Barcelona",
                region: "Spain",
                description: "Gaudí architecture and vibrant Mediterranean life",
                image: "/barcelona-spain-sagrada-familia-architecture.jpg",
                rating: 4.7,
                tags: ["Architecture", "Urban", "Culture"],
                temperature: 25,
            },
            {
                id: "4",
                name: "Banff",
                region: "Canada",
                description: "Majestic mountains and pristine wilderness",
                image: "/banff-national-park-canada-mountains-lake.jpg",
                rating: 4.9,
                tags: ["Adventure", "Nature", "Photography"],
                temperature: 15,
            },
            {
                id: "5",
                name: "Machu Picchu",
                region: "Peru",
                description: "Ancient Incan citadel set high in the Andes Mountains",
                image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80",
                rating: 5.0,
                tags: ["History", "Hiking", "Adventure"],
                temperature: 18,
            },
            {
                id: "6",
                name: "Rome",
                region: "Italy",
                description: "The Eternal City, home to the Colosseum and Vatican City",
                image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80",
                rating: 4.8,
                tags: ["History", "Food", "Urban"],
                temperature: 24,
            },
            {
                id: "7",
                name: "Maui",
                region: "Hawaii, USA",
                description: "Tropical paradise with beaches, volcanoes, and waterfalls",
                image: "https://tse2.mm.bing.net/th/id/OIP.xgr0-JXmn96W6abOu6omogHaCg?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
                rating: 4.9,
                tags: ["Beach", "Nature", "Relaxation"],
                temperature: 29,
            },
            {
                id: "8",
                name: "Istanbul",
                region: "Turkey",
                description: "Where East meets West, rich in culture and history",
                image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80",
                rating: 4.7,
                tags: ["Culture", "History", "Food"],
                temperature: 21,
            },
            {
                id: "9",
                name: "London",
                region: "UK",
                description: "Historic landmarks, world-class museums, and royal palaces",
                image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80",
                rating: 4.6,
                tags: ["History", "Urban", "Culture"],
                temperature: 16,
            },
            {
                id: "10",
                name: "Maldives",
                region: "Maldives",
                description: "Overwater bungalows and crystal clear turquoise waters",
                image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80",
                rating: 4.9,
                tags: ["Beach", "Luxury", "Relaxation"],
                temperature: 30,
            },
            {
                id: "11",
                name: "Cape Town",
                region: "South Africa",
                description: "Stunning coastline, Table Mountain, and vibrant culture",
                image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80",
                rating: 4.8,
                tags: ["Nature", "Adventure", "Beach"],
                temperature: 20,
            },
            {
                id: "12",
                name: "Sydney",
                region: "Australia",
                description: "Iconic Opera House, Harbour Bridge, and Bondi Beach",
                image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80",
                rating: 4.8,
                tags: ["Urban", "Beach", "Lifestyle"],
                temperature: 23,
            },
            {
                id: "13",
                name: "Petra",
                region: "Jordan",
                description: "The Rose City, carved into pink sandstone cliffs",
                image: "https://img-4.linternaute.com/gFqoXBo9hWkY2pocJseRqiYXHIg=/fit-in/x630/smart/filters:fill(1D1D1B)/eab7c787e8aa49889709a7fb33a00179/ccmcms-linternaute/10984959.jpg",
                rating: 4.9,
                tags: ["History", "Adventure", "Desert"],
                temperature: 26,
            },
            {
                id: "14",
                name: "Rio de Janeiro",
                region: "Brazil",
                description: "Carnival spirit, Copacabana beach, and Christ the Redeemer",
                image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80",
                rating: 4.7,
                tags: ["Beach", "Culture", "Party"],
                temperature: 27,
            },
        ];

        await Destination.insertMany(destinations);
        res.json({ message: 'Destinations seeded successfully', count: destinations.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
