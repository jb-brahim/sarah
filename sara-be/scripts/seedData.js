require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');
const Site = require('../src/models/Site');
const Hotel = require('../src/models/Hotel');
const Tour = require('../src/models/Tour');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/portail_touristique';
const backendBase = process.env.BACKEND_URL || 'http://localhost:3000';
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

// Toggle: if true, seed will download/generate local images into public/uploads.
// Set USE_LOCAL_UPLOADS=true in the environment to enable. Default: false (keep remote URLs).
const USE_LOCAL_UPLOADS = process.env.USE_LOCAL_UPLOADS === 'true' || false;

// Ensure uploads directory exists
if (!fs.existsSync(path.join(__dirname, '..', 'public'))) {
  fs.mkdirSync(path.join(__dirname, '..', 'public'))
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir)
}

async function downloadImageToUploads(url, filename) {
  const dest = path.join(uploadsDir, filename);
  // If file already exists, skip download
  if (fs.existsSync(dest)) return `${backendBase}/uploads/${filename}`;

  try {
    const resp = await axios.get(url, { responseType: 'stream', timeout: 20000, maxRedirects: 5 });
    const writer = fs.createWriteStream(dest);
    resp.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    return `${backendBase}/uploads/${filename}`;
  } catch (err) {
    console.warn(`Failed to download ${url}:`, err.message || err);
    return url; // fallback to original URL so seeding still proceeds
  }
}

// Create a simple SVG placeholder and save to uploads dir. Returns backend URL.
function createSvgPlaceholder(filename, title) {
  const dest = path.join(uploadsDir, filename);
  if (fs.existsSync(dest)) return `${backendBase}/uploads/${filename}`;

  const safeTitle = (title || 'Image').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">\n` +
    `<defs>\n` +
    `<linearGradient id="g" x1="0" x2="1">\n` +
    `<stop offset="0%" stop-color="#e6fffa"/>\n` +
    `<stop offset="100%" stop-color="#fff1f2"/>\n` +
    `</linearGradient>\n` +
    `</defs>\n` +
    `<rect width="100%" height="100%" fill="url(#g)"/>\n` +
    `<text x="50%" y="50%" font-family="Arial, Helvetica, sans-serif" font-size="28" fill="#333" text-anchor="middle">${safeTitle}</text>\n` +
    `</svg>`;

  fs.writeFileSync(dest, svg, 'utf8');
  return `${backendBase}/uploads/${filename}`;
}

const sitesData = [
  {
    name: "Eiffel Tower",
    description: { en: "The iconic Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. Built in 1889 for the World's Fair, it has become the global symbol of Paris and one of the most recognizable structures in the world. Visitors can climb to the top for breathtaking views of the city." },
    location: {
      type: 'Point',
      coordinates: [2.2945, 48.8584],
      address: "Paris, France"
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/6e/Eiffel_Tower_from_the_Trocadero%2C_Paris_2015.jpg"
    ],
    category: "Monument",
    entryFee: 15
  },
  {
    name: "Statue of Liberty",
    description: { en: "Colossal neoclassical sculpture located on Liberty Island in New York Harbor. A gift from France to the United States, this iconic statue represents freedom and democracy. Standing 151 feet tall, it has welcomed millions of immigrants arriving by boat since 1886." },
    location: {
      type: 'Point',
      coordinates: [-74.0445, 40.6892],
      address: "New York, USA"
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/a/a1/Statue_of_Liberty_7.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/47/Statue_of_Liberty%2C_NY.jpg"
    ],
    category: "Monument",
    entryFee: 24
  },
  {
    name: "Great Wall of China",
    description: { en: "One of the most impressive architectural feats in human history, the Great Wall of China stretches over 13,000 miles across northern China. Built over many centuries to defend against invasions, it offers stunning views and a glimpse into ancient Chinese engineering." },
    location: {
      type: 'Point',
      coordinates: [117.2272, 40.4319],
      address: "Beijing, China"
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/6/6f/GreatWallNearBeijing.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/10/20090529_Great_Wall_8185.jpg"
    ],
    category: "Historical",
    entryFee: 20
  },
  {
    name: "Colosseum",
    description: { en: "The Colosseum, also known as the Flavian Amphitheatre, is an ancient amphitheater in Rome, Italy. Built between 72 and 80 AD, it once hosted gladiatorial combats and public spectacles with capacities for 50,000 spectators. Today it stands as a testament to Roman engineering." },
    location: {
      type: 'Point',
      coordinates: [12.4964, 41.8902],
      address: "Rome, Italy"
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/d/d5/Colosseo_2020.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/5d/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg"
    ],
    category: "Historical",
    entryFee: 18
  },
  {
    name: "Taj Mahal",
    description: { en: "Considered one of the seven wonders of the world, the Taj Mahal is an ivory-white marble mausoleum built by Emperor Shah Jahan for his wife. Located in Agra, India, it is a masterpiece of Mughal architecture with intricate inlay work and stunning symmetry." },
    location: {
      type: 'Point',
      coordinates: [78.0421, 27.1751],
      address: "Agra, India"
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/d/da/Taj-Mahal.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/10/Taj_Mahal_in_March_2004.jpg"
    ],
    category: "Monument",
    entryFee: 10
  },
  {
    name: "Machu Picchu",
    description: { en: "Ancient Incan citadel located high in the Andes Mountains of Peru. Built in the mid-15th century, this UNESCO World Heritage Site showcases incredible Incan architecture and engineering. Perched at 7,970 feet above sea level, it offers breathtaking mountain vistas." },
    location: {
      type: 'Point',
      coordinates: [-72.5458, -13.1631],
      address: "Cusco, Peru"
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/e/eb/Machu_Picchu%2C_Peru.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/10/Machu_Picchu%2C_Peru_%282009%29.jpg"
    ],
    category: "Historical",
    entryFee: 80
  }
];

const hotelsData = [
  {
    name: "Le Marais Boutique Hotel",
    description: "Luxurious 5-star boutique hotel in the heart of Paris's historic Marais district. Features elegant suites, Michelin-starred restaurant, and rooftop bar with Eiffel Tower views. Perfect for romantic getaways and business travelers.",
    address: "45 Rue de Turenne, 75004 Paris",
    location: {
      type: 'Point',
      coordinates: [2.3657, 48.8611]
    },
    amenities: ["WiFi", "Gym", "Restaurant", "Bar", "Room Service", "Spa"],
    images: [
      "https://source.unsplash.com/800x600/?hotel,paris",
      "https://source.unsplash.com/800x600/?hotel,marais"
    ]
  },
  {
    name: "The Plaza Hotel",
    description: "Iconic luxury hotel overlooking Central Park in Manhattan. Founded in 1907, it combines historic elegance with modern amenities. World-class dining, spa services, and unparalleled views of one of the world's most famous parks.",
    address: "768 Fifth Avenue, New York, NY 10019",
    location: {
      type: 'Point',
      coordinates: [-73.9793, 40.7648]
    },
    amenities: ["WiFi", "Gym", "Restaurant", "Bar", "Concierge", "Spa", "Pool"],
    images: [
      "https://source.unsplash.com/800x600/?hotel,new+york",
      "https://source.unsplash.com/800x600/?hotel,plaza"
    ]
  },
  {
    name: "Beijing Luxury Palace",
    description: "Five-star luxury hotel in the Chaoyang district of Beijing. Features traditional Chinese architecture combined with modern comforts. Located near major attractions including the Great Wall and Forbidden City. Offers exceptional Chinese and international cuisine.",
    address: "88 Jianguo Road, Chaoyang District, Beijing",
    location: {
      type: 'Point',
      coordinates: [116.4519, 39.9075]
    },
    amenities: ["WiFi", "Gym", "Restaurant", "Bar", "Business Center", "Spa"],
    images: [
      "https://source.unsplash.com/800x600/?hotel,beijing",
      "https://source.unsplash.com/800x600/?hotel,china"
    ]
  },
  {
    name: "Hotel Artemide",
    description: "Elegant 4-star hotel near the Trevi Fountain in Rome. Combines ancient Roman history with contemporary design. Rooftop terrace with views of Rome's most iconic monuments. Excellent Italian cuisine and personalized service.",
    address: "Via Vittorio Emanuele Orlando 3, 00185 Roma",
    location: {
      type: 'Point',
      coordinates: [12.4899, 41.9028]
    },
    amenities: ["WiFi", "Gym", "Restaurant", "Bar", "Rooftop Terrace"],
    images: [
      "https://source.unsplash.com/800x600/?hotel,rome",
      "https://source.unsplash.com/800x600/?hotel,arred"
    ]
  },
  {
    name: "Taj View Hotel",
    description: "Premium hotel offering direct views of the Taj Mahal from the rooms and terrace. Located just 600 meters from the monument, it provides unmatched access to Agra's most famous attraction. Offers excellent Indian and international cuisine.",
    address: "Fatehabad Road, Agra 282001",
    location: {
      type: 'Point',
      coordinates: [78.0467, 27.1801]
    },
    amenities: ["WiFi", "Restaurant", "Bar", "Taj Mahal View", "Garden"],
    images: [
      "https://source.unsplash.com/800x600/?hotel,agra",
      "https://source.unsplash.com/800x600/?taj+mahal+view"
    ]
  },
  {
    name: "Sacred Valley Lodge",
    description: "Boutique lodge in the heart of Peru's Sacred Valley, near Machu Picchu. Combines luxury with authentic Andean culture. Features organic restaurant, guided nature walks, and comfortable rooms with mountain views. Perfect base for exploring Incan sites.",
    address: "Sacred Valley, Urubamba Province",
    location: {
      type: 'Point',
      coordinates: [-72.2647, -12.2281]
    },
    amenities: ["WiFi", "Restaurant", "Nature Walks", "Spa", "Terrace"],
    images: [
      "https://source.unsplash.com/800x600/?lodge,machu+picchu",
      "https://source.unsplash.com/800x600/?sacred+valley,peru"
    ]
  }
];

// Helper to map image URLs to local uploads (downloads remote images into /public/uploads)
async function localizeImagesForRecords(records, slugKey) {
  // records: array of objects with `images` array
  for (const rec of records) {
    // We'll generate SVG placeholders that include the record name so they always match the text.
    const baseSlug = (rec[slugKey] || rec.name || 'img').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const newImages = []
    const count = (rec.images && rec.images.length) || 2
    for (let i = 0; i < count; i++) {
      const filename = `${baseSlug}-${i}.svg`
      const finalUrl = createSvgPlaceholder(filename, rec.name || rec.title || 'Image')
      newImages.push(finalUrl)
    }
    rec.images = newImages
  }
}

const toursData = [
  {
    title: "Paris City Tour",
    description: { en: "A comprehensive 3-day guided tour of Paris covering all major attractions including the Eiffel Tower, Louvre Museum, Notre-Dame Cathedral, and the Champs-Élysées. Includes professional guide, hotel transfers, and dinner cruise on the Seine River." },
    guides: ["Jean-Pierre Dubois"],
    availableDates: ["2024-01-15", "2024-02-15", "2024-03-15"],
    price: 890
  },
  {
    title: "New York Experience",
    description: { en: "5-day immersive New York tour featuring iconic landmarks, Broadway shows, museums, and authentic local experiences. Includes Statue of Liberty tour, Central Park walk, Times Square, and visits to world-class museums. Professional guide and all transfers included." },
    guides: ["Sarah Johnson"],
    availableDates: ["2024-02-01", "2024-03-01", "2024-04-01"],
    price: 1290
  },
  {
    title: "Great Wall Adventure",
    description: { en: "Unforgettable 4-day trek along the Great Wall of China with expert guides. Experience stunning landscapes, hike restored sections of the wall, visit watchtowers, and learn about ancient Chinese history. Includes accommodation, meals, and all necessary equipment." },
    guides: ["Zhang Wei"],
    availableDates: ["2024-03-10", "2024-04-10", "2024-05-10"],
    price: 750
  },
  {
    title: "Roman History Tour",
    description: { en: "3-day immersive journey through ancient Rome exploring the Colosseum, Roman Forum, Pantheon, and Vatican City. Includes skip-the-line tickets, expert historian guide, and visits to lesser-known ancient sites. Perfect for history enthusiasts." },
    guides: ["Marco Rossi"],
    availableDates: ["2024-04-20", "2024-05-20", "2024-06-20"],
    price: 650
  },
  {
    title: "Taj Mahal Experience",
    description: { en: "2-day romantic tour of Agra featuring the world-famous Taj Mahal, Agra Fort, and local markets. Includes sunrise and sunset visits to the monument, expert guide storytelling, and authentic Indian cuisine. Ideal for couples and photography enthusiasts." },
    guides: ["Rajesh Kumar"],
    availableDates: ["2024-05-15", "2024-06-15", "2024-07-15"],
    price: 420
  },
  {
    title: "Machu Picchu Trek",
    description: { en: "Ultimate 5-day Incan Trail trek to Machu Picchu. Experience the breathtaking Andean landscapes, camp under the stars, and explore ancient Incan sites. Includes experienced guides, porters, meals, and all camping equipment. Not for beginners." },
    guides: ["Carlos Mamani"],
    availableDates: ["2024-06-01", "2024-07-01", "2024-08-01"],
    price: 1100
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Site.deleteMany({});
    await Hotel.deleteMany({});
    await Tour.deleteMany({});
    console.log('Cleared existing data');

    // Insert sites
    // Optionally download/generate local images. By default we keep the provided remote URLs (Option A).
    if (USE_LOCAL_UPLOADS) {
      await localizeImagesForRecords(sitesData, '_id');
      await localizeImagesForRecords(hotelsData, 'name');
    } else {
      console.log('Using remote image URLs from seed data (USE_LOCAL_UPLOADS=false)');
    }

    const insertedSites = await Site.insertMany(sitesData);
    console.log(`✅ Inserted ${insertedSites.length} sites`);

    // Insert hotels
    const insertedHotels = await Hotel.insertMany(hotelsData);
    console.log(`✅ Inserted ${insertedHotels.length} hotels`);

    // Insert tours
    const insertedTours = await Tour.insertMany(toursData);
    console.log(`✅ Inserted ${insertedTours.length} tours`);

    console.log('\n✨ Database seeded successfully!');
    console.log('\nSample Data Added:');
    console.log(`- ${insertedSites.length} Tourist Sites`);
    console.log(`- ${insertedHotels.length} Hotels`);
    console.log(`- ${insertedTours.length} Tours`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seedDatabase();
