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
  },
  {
    name: "Christ the Redeemer",
    description: { en: "Iconic art deco statue of Jesus Christ overlooking Rio de Janeiro, Brazil. Standing 98 feet tall atop Mount Corcovado, it offers panoramic views of the city and Guanabara Bay. Built in 1931, it has become a symbol of Brazil and one of the New Seven Wonders of the World." },
    location: {
      type: 'Point',
      coordinates: [-43.2123, -22.9519],
      address: "Rio de Janeiro, Brazil"
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/e/e5/Christ_the_Redeemer_-_2013_-_1.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/9/9d/Cristo_Redentor_Rio_de_Janeiro_Brasil.jpg"
    ],
    category: "Monument",
    entryFee: 30
  },
  {
    name: "Petra",
    description: { en: "Carved from rose-colored sandstone, Petra is an ancient city in southwestern Jordan. Built by the Nabateans in the 1st century BC, this UNESCO World Heritage Site showcases remarkable rock-cut architecture. The Treasury and Monastery are among its most iconic structures." },
    location: {
      type: 'Point',
      coordinates: [35.4272, 30.3286],
      address: "Ma'an Governorate, Jordan"
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/c/c7/Treasury_Petra_80x120.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/54/Petra_wide.jpg"
    ],
    category: "Historical",
    entryFee: 50
  },
  {
    name: "Angkor Wat",
    description: { en: "The largest religious monument in the world, Angkor Wat is a 12th-century temple complex in Cambodia. Originally built as a Hindu temple dedicated to Vishnu, it later transformed into a Buddhist temple. Its intricate carvings and architectural grandeur make it a masterpiece of Khmer civilization." },
    location: {
      type: 'Point',
      coordinates: [103.8674, 13.3667],
      address: "Siem Reap, Cambodia"
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/d/d4/Angkor_Wat_2009.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/0d/20091029_Angkor_Wat_Sunrise_11x15.jpg"
    ],
    category: "Historical",
    entryFee: 37
  },
  {
    name: "Santorini",
    description: { en: "A stunning Greek island in the Aegean Sea known for its white-washed buildings with blue domes, dramatic cliffs, and beautiful sunsets. Santorini is a perfect destination for romance and relaxation. The island also offers excellent local wine and Mediterranean cuisine." },
    location: {
      type: 'Point',
      coordinates: [25.4615, 36.4176],
      address: "Cyclades, Greece"
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/3/39/Santorini_view_from_stairs.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e1/Santorini_-_2011_-_Library_of_Congress_1.jpg"
    ],
    category: "Beach",
    entryFee: 0
  },
  {
    name: "Big Ben & Parliament",
    description: { en: "Big Ben, officially the Elizabeth Tower, stands at the Palace of Westminster in London. This iconic Gothic Revival clock tower has become a symbol of Britain. Visitors can explore the historic Houses of Parliament and Big Ben, experiencing centuries of political history." },
    location: {
      type: 'Point',
      coordinates: [-0.1247, 51.4975],
      address: "London, United Kingdom"
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/9/9f/Elizabeth_Tower_%28Big_Ben%29_from_across_the_Thames.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/87/Palace_of_Westminster_from_across_the_River_Thames_%28Nov_2012%29.jpg"
    ],
    category: "Monument",
    entryFee: 25
  },
  {
    name: "Niagara Falls",
    description: { en: "One of the most powerful waterfalls in the world, Niagara Falls straddles the border between Canada and the United States. With three cascades, it produces a thunderous roar and misty spray. Visitors can experience the falls from boat tours, observation towers, and scenic trails." },
    location: {
      type: 'Point',
      coordinates: [-81.0895, 43.0896],
      address: "Ontario, Canada"
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/4/45/Niagara_falls_ontario_DB.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/08/Niagara_Falls_%28Horseshoe%29.jpg"
    ],
    category: "Nature",
    entryFee: 0
  },
  {
    name: "Alhambra",
    description: { en: "A palatial fortress and artistic marvel located in Granada, Spain. Built during the Nasrid dynasty in the 13th-15th centuries, the Alhambra showcases exquisite Islamic architecture with intricate tile work, stucco decoration, and beautiful gardens." },
    location: {
      type: 'Point',
      coordinates: [-3.5882, 37.1758],
      address: "Granada, Spain"
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/0/0a/Alhambra%2C_Granada%2C_Andalusia%2C_Spain.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/86/Alhambra_courtyard%2C_Granada.jpg"
    ],
    category: "Historical",
    entryFee: 16
  },
  {
    name: "Mount Fuji",
    description: { en: "Japan's tallest mountain at 12,388 feet, Mount Fuji is an iconic symbol of the country. Its distinctive snow-capped peak can be seen from Tokyo on clear days. The mountain is sacred in Japanese culture and attracts climbers and pilgrims year-round." },
    location: {
      type: 'Point',
      coordinates: [138.7274, 35.3606],
      address: "Yamanashi Prefecture, Japan"
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/0/0c/Mt_Fuji_from_Yamanakako_2013-11-02.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/57/Mt._Fuji_from_Lake_Kawaguchi_%282013-11-02%29.jpg"
    ],
    category: "Nature",
    entryFee: 0
  },
  {
    name: "Sagrada Familia",
    description: { en: "An exquisite basilica in Barcelona, Spain, designed by Antoni Gaudí. Construction began in 1883 and continues to this day, making it one of the most unique churches in the world. Its intricate Gothic and modernist style, with organic forms and stunning stained glass windows, makes it a must-see architectural masterpiece." },
    location: {
      type: 'Point',
      coordinates: [2.1744, 41.4036],
      address: "Barcelona, Spain"
    },
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/6/6d/Sagrada_Familia_nave_roof.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/a/a7/Sagrada_Familia%2C_Barcelona.jpg"
    ],
    category: "Monument",
    entryFee: 26
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
    price: 250,
    amenities: ["WiFi", "Gym", "Restaurant", "Bar", "Room Service", "Spa"],
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop"
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
    price: 450,
    amenities: ["WiFi", "Gym", "Restaurant", "Bar", "Concierge", "Spa", "Pool"],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&h=600&fit=crop"
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
    price: 180,
    amenities: ["WiFi", "Gym", "Restaurant", "Bar", "Business Center", "Spa"],
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop"
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
    price: 220,
    amenities: ["WiFi", "Gym", "Restaurant", "Bar", "Rooftop Terrace"],
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop"
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
    price: 150,
    amenities: ["WiFi", "Restaurant", "Bar", "Taj Mahal View", "Garden"],
    images: [
      "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop"
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
    price: 200,
    amenities: ["WiFi", "Restaurant", "Nature Walks", "Spa", "Terrace"],
    images: [
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop"
    ]
  },
  {
    name: "Copacabana Palace",
    description: "Legendary 5-star beachfront hotel in Rio de Janeiro. Located on the famous Copacabana Beach with stunning ocean views. Offers world-class amenities, fine dining, and direct access to Rio's vibrant beach culture. Perfect for luxury beach vacations.",
    address: "Avenida Atlântica 1702, Rio de Janeiro",
    location: {
      type: 'Point',
      coordinates: [-43.1840, -22.9773]
    },
    price: 350,
    amenities: ["WiFi", "Gym", "Restaurant", "Bar", "Beach Access", "Pool", "Spa"],
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop"
    ]
  },
  {
    name: "Petra Sands Resort",
    description: "Luxury resort near the ancient city of Petra in Jordan. Combines modern comfort with proximity to archaeological wonders. Features stunning desert views, excellent Jordanian cuisine, and knowledgeable guides for Petra tours. Ideal for history and culture enthusiasts.",
    address: "Wadi Musa, Petra Region",
    location: {
      type: 'Point',
      coordinates: [35.4272, 30.3286]
    },
    price: 190,
    amenities: ["WiFi", "Restaurant", "Bar", "Tour Services", "Garden"],
    images: [
      "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop"
    ]
  },
  {
    name: "Angkor Archaeological Hotel",
    description: "Historic hotel in Siem Reap with easy access to the Angkor Wat temple complex. Combines colonial charm with modern amenities. Features knowledgeable staff, excellent Khmer cuisine, and organized tours to nearby temples. Perfect base for exploring Cambodia's cultural heritage.",
    address: "Street 60, Siem Reap",
    location: {
      type: 'Point',
      coordinates: [103.8674, 13.3667]
    },
    price: 120,
    amenities: ["WiFi", "Restaurant", "Bar", "Tour Desk", "Spa"],
    images: [
      "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop"
    ]
  },
  {
    name: "Santorini Sunset Villa",
    description: "Exclusive cliff-top villa resort in Santorini with unparalleled views of the Aegean Sea and sunset. Features private pools, whitewashed suites, and fine dining. Perfect romantic destination with exceptional Greek hospitality and Mediterranean cuisine.",
    address: "Oia, Santorini",
    location: {
      type: 'Point',
      coordinates: [25.4615, 36.4176]
    },
    price: 400,
    amenities: ["WiFi", "Pool", "Restaurant", "Bar", "Spa", "Sunset Views"],
    images: [
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop"
    ]
  },
  {
    name: "The Goring London",
    description: "Luxury 5-star hotel in the heart of London's Belgravia district. Just steps from Buckingham Palace and iconic attractions. Features elegant rooms, Michelin-starred dining, and personalized service. Perfect for experiencing British hospitality at its finest.",
    address: "Beeston Place, London",
    location: {
      type: 'Point',
      coordinates: [-0.1494, 51.4998]
    },
    price: 380,
    amenities: ["WiFi", "Gym", "Restaurant", "Bar", "Concierge", "Spa"],
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
    ]
  },
  {
    name: "Fallsview Hotel & Spa",
    description: "Luxury resort with stunning views of Niagara Falls. Located directly overlooking the cascades with direct access to the Fallsview Tourism Experience. Features spa services, fine dining restaurants, and unforgettable views of one of the world's greatest natural wonders.",
    address: "6755 Fallsview Boulevard, Niagara Falls",
    location: {
      type: 'Point',
      coordinates: [-81.0895, 43.0896]
    },
    price: 280,
    amenities: ["WiFi", "Gym", "Restaurant", "Bar", "Spa", "Falls View", "Pool"],
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop"
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
    duration: 3,
    price: 890,
    images: [
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&h=600&fit=crop"
    ]
  },
  {
    title: "New York Experience",
    description: { en: "5-day immersive New York tour featuring iconic landmarks, Broadway shows, museums, and authentic local experiences. Includes Statue of Liberty tour, Central Park walk, Times Square, and visits to world-class museums. Professional guide and all transfers included." },
    guides: ["Sarah Johnson"],
    availableDates: ["2024-02-01", "2024-03-01", "2024-04-01"],
    duration: 5,
    price: 1290,
    images: [
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1490644658840-3f2e3f8c5625?w=800&h=600&fit=crop"
    ]
  },
  {
    title: "Great Wall Adventure",
    description: { en: "Unforgettable 4-day trek along the Great Wall of China with expert guides. Experience stunning landscapes, hike restored sections of the wall, visit watchtowers, and learn about ancient Chinese history. Includes accommodation, meals, and all necessary equipment." },
    guides: ["Zhang Wei"],
    availableDates: ["2024-03-10", "2024-04-10", "2024-05-10"],
    duration: 4,
    price: 750,
    images: [
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&h=600&fit=crop"
    ]
  },
  {
    title: "Roman History Tour",
    description: { en: "3-day immersive journey through ancient Rome exploring the Colosseum, Roman Forum, Pantheon, and Vatican City. Includes skip-the-line tickets, expert historian guide, and visits to lesser-known ancient sites. Perfect for history enthusiasts." },
    guides: ["Marco Rossi"],
    availableDates: ["2024-04-20", "2024-05-20", "2024-06-20"],
    duration: 3,
    price: 650,
    images: [
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800&h=600&fit=crop"
    ]
  },
  {
    title: "Taj Mahal Experience",
    description: { en: "2-day romantic tour of Agra featuring the world-famous Taj Mahal, Agra Fort, and local markets. Includes sunrise and sunset visits to the monument, expert guide storytelling, and authentic Indian cuisine. Ideal for couples and photography enthusiasts." },
    guides: ["Rajesh Kumar"],
    availableDates: ["2024-05-15", "2024-06-15", "2024-07-15"],
    duration: 2,
    price: 420,
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop"
    ]
  },
  {
    title: "Machu Picchu Trek",
    description: { en: "Ultimate 5-day Incan Trail trek to Machu Picchu. Experience the breathtaking Andean landscapes, camp under the stars, and explore ancient Incan sites. Includes experienced guides, porters, meals, and all camping equipment. Not for beginners." },
    guides: ["Carlos Mamani"],
    availableDates: ["2024-06-01", "2024-07-01", "2024-08-01"],
    duration: 5,
    price: 1100,
    images: [
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&h=600&fit=crop"
    ]
  },
  {
    title: "Rio de Janeiro Beach & Culture",
    description: { en: "4-day tour of Rio de Janeiro including Christ the Redeemer statue, Sugarloaf Mountain cable car, Copacabana and Ipanema beaches, and samba culture. Includes professional guide, beach activities, and authentic Brazilian cuisine and nightlife." },
    guides: ["Carlos Silva"],
    availableDates: ["2024-07-05", "2024-08-05", "2024-09-05"],
    duration: 4,
    price: 920,
    images: [
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800&h=600&fit=crop"
    ]
  },
  {
    title: "Petra & Dead Sea Discovery",
    description: { en: "3-day desert adventure exploring the ancient rose-red city of Petra and floating in the Dead Sea. Includes expert guides explaining Nabatean history, visits to nearby Wadi Musa, and spa treatments using mineral-rich Dead Sea waters." },
    guides: ["Ahmed Hassan"],
    availableDates: ["2024-08-10", "2024-09-10", "2024-10-10"],
    duration: 3,
    price: 580,
    images: [
      "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop"
    ]
  },
  {
    title: "Angkor Wat & Temple Complex",
    description: { en: "4-day tour of Cambodia's most significant temples including the legendary Angkor Wat, Bayon Temple, and Ta Prohm. Includes sunrise viewing from temple tops, guided history lessons, visits to artisan villages, and authentic Khmer cooking class." },
    guides: ["Sokhai Meng"],
    availableDates: ["2024-09-01", "2024-10-01", "2024-11-01"],
    duration: 4,
    price: 680,
    images: [
      "https://images.unsplash.com/photo-1563640214-4b5a6c0b3e5f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=600&fit=crop"
    ]
  },
  {
    title: "Santorini Romance Package",
    description: { en: "3-day romantic getaway in Santorini featuring white-washed villages, stunning sunsets, volcanic beaches, and local wine tasting. Includes boat tours, blue-domed church visits, traditional Greek dinner, and sunset sailing around the caldera." },
    guides: ["Dimitrios Papadopoulos"],
    availableDates: ["2024-10-15", "2024-11-15", "2024-12-15"],
    duration: 3,
    price: 1050,
    images: [
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=800&h=600&fit=crop"
    ]
  },
  {
    title: "London Royal & Historic",
    description: { en: "3-day comprehensive London tour visiting Buckingham Palace, Tower of London, Big Ben, Westminster Abbey, and the British Museum. Includes expert historian guide, traditional afternoon tea, and Thames River cruise with historical commentary." },
    guides: ["Elizabeth Williams"],
    availableDates: ["2024-11-01", "2024-12-01", "2025-01-01"],
    duration: 3,
    price: 745,
    images: [
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&h=600&fit=crop"
    ]
  },
  {
    title: "Niagara Falls Adventure",
    description: { en: "2-day adventure tour of Niagara Falls including Hornblower boat tour into the falls, Journey Behind the Falls tunnel walk, and scenic helicopter ride. Afternoon Niagara Wine Region tour with tastings. All transfers and meals included." },
    guides: ["Robert Thompson"],
    availableDates: ["2024-12-15", "2025-01-15", "2025-02-15"],
    duration: 2,
    price: 560,
    images: [
      "https://images.unsplash.com/photo-1489447068241-b3490214e879?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1467139701929-c3b0b41516f6?w=800&h=600&fit=crop"
    ]
  },
  {
    title: "Alhambra & Granada Cultural",
    description: { en: "2-day cultural immersion in Granada exploring the magnificent Alhambra palace, Islamic heritage sites, and traditional tapas culture. Includes expert art historian guide, flamenco dancing lesson, and visits to local artisan studios and markets." },
    guides: ["Manuel Fernández"],
    availableDates: ["2025-01-10", "2025-02-10", "2025-03-10"],
    duration: 2,
    price: 490,
    images: [
      "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&h=600&fit=crop"
    ]
  },
  {
    title: "Mount Fuji Climbing Expedition",
    description: { en: "4-day guided mountain climbing expedition up Mount Fuji with stay in mountain huts. Experience sunrise from the summit, visit crater lakes, and learn about sacred Shinto shrines. All meals, accommodations, and transportation included. Moderate to challenging fitness level required." },
    guides: ["Takeshi Yamamoto"],
    availableDates: ["2025-02-20", "2025-03-20", "2025-04-20"],
    duration: 4,
    price: 820,
    images: [
      "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1576675784201-0e142b423952?w=800&h=600&fit=crop"
    ]
  },
  {
    title: "Barcelona Gaudí & Architecture",
    description: { en: "3-day architectural and cultural tour focusing on Antoni Gaudí's masterpieces including Sagrada Familia, Park Güell, Casa Batlló, and Casa Milà. Includes expert architecture guide, museum entries, Gothic Quarter walking tour, and traditional Catalan cuisine." },
    guides: ["Francesca Marquez"],
    availableDates: ["2025-03-15", "2025-04-15", "2025-05-15"],
    duration: 3,
    price: 695,
    images: [
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop"
    ]
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
