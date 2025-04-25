const fs = require('fs');
const path = require('path');

// City data with realistic coordinates and bounds
const cities = {
  Mumbai: {
    center: { lat: 19.0760, lng: 72.8777 },
    bounds: { 
      minLat: 18.8928, maxLat: 19.2724, 
      minLng: 72.7759, maxLng: 72.9577 
    },
    neighborhoods: [
      'Andheri', 'Bandra', 'Colaba', 'Dadar', 'Juhu', 'Lower Parel', 
      'Malad', 'Marine Lines', 'Powai', 'Worli', 'Chembur', 'Goregaon'
    ]
  },
  Pune: {
    center: { lat: 18.5204, lng: 73.8567 },
    bounds: { 
      minLat: 18.4338, maxLat: 18.6144, 
      minLng: 73.7382, maxLng: 73.9732 
    },
    neighborhoods: [
      'Kothrud', 'Aundh', 'Baner', 'Camp', 'Shivaji Nagar', 'Koregaon Park',
      'Viman Nagar', 'Magarpatta', 'Hadapsar', 'Bavdhan', 'Pimpri-Chinchwad', 'Wakad'
    ]
  },
  Bangalore: {
    center: { lat: 12.9716, lng: 77.5946 },
    bounds: { 
      minLat: 12.8354, maxLat: 13.1402, 
      minLng: 77.4601, maxLng: 77.7800 
    },
    neighborhoods: [
      'Indiranagar', 'Koramangala', 'HSR Layout', 'Jayanagar', 'Malleshwaram',
      'JP Nagar', 'Whitefield', 'Electronic City', 'MG Road', 'Ulsoor', 'Brigade Road', 'Basavanagudi'
    ]
  },
  Delhi: {
    center: { lat: 28.7041, lng: 77.1025 },
    bounds: { 
      minLat: 28.4104, maxLat: 28.9578, 
      minLng: 76.8389, maxLng: 77.3478 
    },
    neighborhoods: [
      'Connaught Place', 'Chandni Chowk', 'Hauz Khas', 'Karol Bagh', 'Lajpat Nagar',
      'Paharganj', 'Saket', 'South Extension', 'Vasant Kunj', 'Greater Kailash', 'Rajouri Garden', 'Dwarka'
    ]
  },
  Chennai: {
    center: { lat: 13.0827, lng: 80.2707 },
    bounds: { 
      minLat: 12.8991, maxLat: 13.2366, 
      minLng: 80.1428, maxLng: 80.3419
    },
    neighborhoods: [
      'T. Nagar', 'Adyar', 'Anna Nagar', 'Besant Nagar', 'Mylapore',
      'Velachery', 'Saidapet', 'Nungambakkam', 'Alwarpet', 'Porur', 'Guindy', 'Egmore'
    ]
  }
};

// Food types by region with accurate cuisine types
const foodTypes = {
  common: [
    'Street Food', 'Fast Food', 'Cafe', 'Juice Bar', 'Ice Cream Parlor',
    'Chinese', 'Rolls & Wraps', 'Continental', 'Kebabs', 'Italian', 'Sandwiches'
  ],
  Mumbai: [
    'Vada Pav', 'Pav Bhaji', 'Bombay Sandwich', 'Bhel Puri', 'Chaat',
    'Misal Pav', 'Coastal', 'Malvani', 'Maharashtrian', 'Parsi', 'Mughlai'
  ],
  Pune: [
    'Maharashtrian', 'Misal Pav', 'Vada Pav', 'Chaat', 'Bhel Puri',
    'Puran Poli', 'Sabudana Vada', 'Mastani', 'Thali'
  ],
  Bangalore: [
    'South Indian', 'Dosa', 'Idli', 'Karnataka', 'Andhra', 'Kerala', 'Biryani',
    'Darshini', 'Filter Coffee', 'Thali', 'Seafood'
  ],
  Delhi: [
    'North Indian', 'Mughlai', 'Chaat', 'Paranthe', 'Delhi Street Food',
    'Butter Chicken', 'Kebabs', 'Chole Bhature', 'Punjabi', 'Tandoori'
  ],
  Chennai: [
    'South Indian', 'Tamil', 'Idli', 'Dosa', 'Vada', 'Filter Coffee',
    'Chettinad', 'Seafood', 'Biryani', 'Andhra', 'Kerala'
  ]
};

// Common prefixes/suffixes for vendor names
const nameComponents = {
  prefixes: [
    'New', 'Royal', 'Shree', 'Sri', 'Classic', 'Original', 'Guru', 'Adyar', 'Amma', 'Old', 'Famous',
    'Best', 'Spicy', 'Grand', 'Supreme', 'Star', 'Deluxe', 'Premium', 'Tasty', 'Fresh', 'Golden', 'Silver'
  ],
  suffixes: [
    'Corner', 'Center', 'Point', 'Junction', 'Express', 'Place', 'Hut', 'House', 'Palace', 'Stall',
    'Dhaba', 'Joint', 'Canteen', 'Cafe', 'Eatery', 'Kitchen', 'Tiffin', 'Bhavan', 'Darbar', 'Sagar'
  ],
  establishments: [
    'Restaurant', 'Food Court', 'Cafe', 'Eatery', 'Kitchen', 'Darshini', 'Bhavan', 'Hotel',
    'Tiffin Center', 'Snacks Center', 'Food Stall', 'Food Truck', 'Cart', 'Plaza', 'Fast Food'
  ]
};

// Random food items with prices
const foodItems = {
  'Vada Pav': { priceRange: [15, 40], popular: true },
  'Pav Bhaji': { priceRange: [60, 120], popular: true },
  'Misal Pav': { priceRange: [70, 130], popular: true },
  'Samosa': { priceRange: [15, 40], popular: true },
  'Panipuri': { priceRange: [30, 70], popular: true },
  'Bhel Puri': { priceRange: [40, 80], popular: true },
  'Dahi Puri': { priceRange: [50, 90], popular: false },
  'Sev Puri': { priceRange: [40, 80], popular: false },
  'Idli': { priceRange: [30, 80], popular: true },
  'Dosa': { priceRange: [60, 150], popular: true },
  'Masala Dosa': { priceRange: [80, 180], popular: true },
  'Rava Dosa': { priceRange: [90, 200], popular: false },
  'Vada': { priceRange: [30, 70], popular: false },
  'Uttapam': { priceRange: [70, 150], popular: false },
  'Upma': { priceRange: [40, 90], popular: false },
  'Pongal': { priceRange: [50, 120], popular: false },
  'Filter Coffee': { priceRange: [20, 60], popular: true },
  'Masala Chai': { priceRange: [15, 40], popular: true },
  'Lassi': { priceRange: [40, 100], popular: true },
  'Falooda': { priceRange: [60, 150], popular: false },
  'Kulfi': { priceRange: [40, 100], popular: true },
  'Chole Bhature': { priceRange: [70, 150], popular: true },
  'Paranthe': { priceRange: [60, 140], popular: true },
  'Butter Chicken': { priceRange: [180, 350], popular: true },
  'Paneer Tikka': { priceRange: [150, 300], popular: true },
  'Biryani': { priceRange: [150, 350], popular: true },
  'Kebabs': { priceRange: [150, 350], popular: true },
  'Rolls': { priceRange: [70, 150], popular: true },
  'Momos': { priceRange: [60, 130], popular: true },
  'Noodles': { priceRange: [80, 180], popular: true },
  'Fried Rice': { priceRange: [100, 200], popular: false },
  'Spring Rolls': { priceRange: [70, 150], popular: false },
  'Thali': { priceRange: [120, 300], popular: true },
  'Chaat': { priceRange: [50, 120], popular: true },
  'Kachori': { priceRange: [30, 80], popular: false },
  'Bhajiya/Pakora': { priceRange: [40, 100], popular: false },
  'Poha': { priceRange: [30, 80], popular: false },
  'Sandwiches': { priceRange: [50, 150], popular: true },
  'Frankie': { priceRange: [70, 180], popular: false },
  'Ice Cream': { priceRange: [50, 200], popular: true },
  'Fresh Juice': { priceRange: [50, 150], popular: true },
  'Sugarcane Juice': { priceRange: [30, 80], popular: false },
  'Coconut Water': { priceRange: [30, 70], popular: false },
  'Kulfis': { priceRange: [40, 120], popular: false },
  'Milkshakes': { priceRange: [70, 180], popular: true }
};

// Time slots for business hours
const timeSlots = [
  '6 AM - 10 PM', '7 AM - 10 PM', '8 AM - 10 PM', '9 AM - 9 PM', 
  '10 AM - 10 PM', '11 AM - 11 PM', '12 PM - 10 PM', '8 AM - 8 PM',
  '7 AM - 11 PM', '9 AM - 11 PM', '10 AM - 11 PM', '11 AM - 12 AM',
  '12 PM - 12 AM', '4 PM - 12 AM', '5 PM - 1 AM', '6 PM - 1 AM'
];

// Description templates
const descriptionTemplates = [
  'Popular {type} joint known for authentic {specialty}.',
  'Family-run {type} spot famous for {specialty} since {year}.',
  'Iconic {type} stall serving delicious {specialty} for over {duration} years.',
  'Bustling {type} place with mouthwatering {specialty} at affordable prices.',
  'Hidden gem offering the best {specialty} in {neighborhood}.',
  'Local favorite serving delectable {specialty} in a casual setting.',
  'Award-winning {type} known for its signature {specialty}.',
  'Traditional {type} famous among locals for authentic {specialty}.',
  'Cozy {type} joint specializing in homemade {specialty}.',
  'Well-known {type} spot with loyal customers for its {specialty}.',
  'Charming streetside {type} offering freshly made {specialty}.',
  'No-frills {type} serving delicious {specialty} with secret family recipes.'
];

// Utility functions
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals = 4) {
  const rand = Math.random() * (max - min) + min;
  return parseFloat(rand.toFixed(decimals));
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Generate a random location within city bounds
function getRandomLocation(city) {
  const bounds = cities[city].bounds;
  return {
    lat: getRandomFloat(bounds.minLat, bounds.maxLat),
    lng: getRandomFloat(bounds.minLng, bounds.maxLng)
  };
}

// Generate a random business name
function generateBusinessName(city, foodType) {
  const usePrefix = Math.random() > 0.5;
  const useSuffix = Math.random() > 0.5;
  const useEstablishment = Math.random() > 0.4;
  
  let name = '';
  
  // Add city or neighborhood reference sometimes
  if (Math.random() > 0.7) {
    if (Math.random() > 0.5) {
      name += city + ' ';
    } else {
      name += getRandomElement(cities[city].neighborhoods) + ' ';
    }
  }
  
  // Add prefix sometimes
  if (usePrefix && Math.random() > 0.5) {
    name += getRandomElement(nameComponents.prefixes) + ' ';
  }
  
  // Add food type or generic name
  if (Math.random() > 0.5) {
    name += foodType + ' ';
  } else {
    // Some invented or common names
    const genericNames = [
      'Taste', 'Flavors', 'Delight', 'Treat', 'Spice', 'Aroma',
      'Hunger', 'Bite', 'Craving', 'Appetite', 'Yummy', 'Delicious'
    ];
    name += getRandomElement(genericNames) + ' ';
  }
  
  // Add suffix sometimes
  if (useSuffix) {
    name += getRandomElement(nameComponents.suffixes) + ' ';
  }
  
  // Add establishment type sometimes
  if (useEstablishment) {
    name += getRandomElement(nameComponents.establishments);
  }
  
  return name.trim();
}

// Generate a random menu
function generateMenu(city, foodType) {
  const menuSize = getRandomInt(4, 8);
  let menu = [];
  
  // Get food items relevant to the cuisine
  let relevantItems = Object.keys(foodItems).filter(item => {
    // Higher probability for items matching the food type or city's common foods
    if (item.toLowerCase().includes(foodType.toLowerCase())) return true;
    
    // Check if item is common in that city's cuisine
    const cityFoods = foodTypes[city] || [];
    for (const food of cityFoods) {
      if (item.toLowerCase().includes(food.toLowerCase())) return true;
    }
    
    return Math.random() > 0.5; // Random chance to include other food items
  });
  
  // If not enough items, add some generic ones
  if (relevantItems.length < menuSize) {
    relevantItems = [...relevantItems, ...Object.keys(foodItems)];
  }
  
  // Select random items for the menu
  const selectedItems = getRandomElements(relevantItems, menuSize);
  
  // Generate menu with prices
  for (const item of selectedItems) {
    const foodItem = foodItems[item];
    const price = getRandomInt(foodItem.priceRange[0], foodItem.priceRange[1]);
    const isPopular = foodItem.popular || Math.random() > 0.7;
    
    menu.push({
      name: item,
      price: price,
      isPopular: isPopular
    });
  }
  
  return menu;
}

// Generate a vendor
function generateVendor(id, city) {
  // Select food type biased towards city's specialties
  const citySpecificTypes = foodTypes[city] || [];
  const commonTypes = foodTypes.common;
  
  let allPossibleTypes;
  if (Math.random() > 0.3) {
    // 70% chance to use city-specific food type
    allPossibleTypes = [...citySpecificTypes, ...commonTypes];
  } else {
    // 30% chance to use common food type
    allPossibleTypes = commonTypes;
  }
  
  const foodType = getRandomElement(allPossibleTypes);
  
  // Generate other vendor details
  const name = generateBusinessName(city, foodType);
  const location = getRandomLocation(city);
  const rating = getRandomFloat(3.0, 4.9, 1);
  const openHours = getRandomElement(timeSlots);
  const neighborhood = getRandomElement(cities[city].neighborhoods);
  
  // Generate description
  const specialty = getRandomElement(Object.keys(foodItems));
  const year = getRandomInt(1970, 2015);
  const duration = 2023 - year;
  let description = getRandomElement(descriptionTemplates)
    .replace('{type}', foodType.toLowerCase())
    .replace('{specialty}', specialty.toLowerCase())
    .replace('{year}', year)
    .replace('{duration}', duration)
    .replace('{neighborhood}', neighborhood);
  
  // Generate menu
  const menu = generateMenu(city, foodType);
  
  // Generate wait time reports
  const waitTimeReports = [];
  const reportCount = getRandomInt(0, 3);
  for (let i = 0; i < reportCount; i++) {
    waitTimeReports.push({
      time: new Date(2023, 6, 15, getRandomInt(8, 22), getRandomInt(0, 59)).toISOString(),
      waitTime: getRandomInt(5, 60),
      userId: `user${getRandomInt(100, 999)}`
    });
  }
  
  // Generate visit data
  const visitData = [];
  const visitDataPoints = getRandomInt(3, 8);
  for (let i = 0; i < visitDataPoints; i++) {
    visitData.push({
      hour: getRandomInt(8, 22),
      day: getRandomInt(0, 6),
      count: getRandomInt(20, 150)
    });
  }
  
  // Generate current wait time (if reports exist, average them, otherwise random)
  let currentWaitTime;
  if (waitTimeReports.length > 0) {
    const sum = waitTimeReports.reduce((total, report) => total + report.waitTime, 0);
    currentWaitTime = Math.round(sum / waitTimeReports.length);
  } else {
    currentWaitTime = getRandomInt(5, 45);
  }
  
  // Sample photo URLs (use placeholders)
  const photos = [
    `https://images.unsplash.com/photo-${getRandomInt(1500000000, 1650000000)}?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`,
    `https://images.unsplash.com/photo-${getRandomInt(1500000000, 1650000000)}?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`,
    `https://images.unsplash.com/photo-${getRandomInt(1500000000, 1650000000)}?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`
  ];
  
  return {
    id,
    name,
    description,
    type: foodType,
    rating,
    openHours,
    city,
    neighborhood,
    location,
    photos,
    menu,
    waitTimeReports,
    visitData,
    currentWaitTime
  };
}

// Generate vendors for each city
function generateVendors() {
  let allVendors = [];
  let id = 1;
  
  // Generate 50+ vendors for each city
  for (const city of Object.keys(cities)) {
    const vendorCount = getRandomInt(50, 60); // 50-60 vendors per city
    
    for (let i = 0; i < vendorCount; i++) {
      const vendor = generateVendor(id++, city);
      allVendors.push(vendor);
    }
  }
  
  return allVendors;
}

// Generate and save the data
const vendors = generateVendors();
const outputDir = path.join(__dirname, '..', 'src', 'data');

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write data to file
fs.writeFileSync(
  path.join(outputDir, 'vendors.json'),
  JSON.stringify(vendors, null, 2)
);

console.log(`Generated ${vendors.length} vendors across ${Object.keys(cities).length} cities.`);
console.log(`Data saved to ${path.join(outputDir, 'vendors.json')}`); 