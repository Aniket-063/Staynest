require('dotenv').config({ path: './.env' }); // Path specify kar diya
const mongoose = require('mongoose')
const Listing = require('./models/Listing.model')
const User = require('./models/User.model')

async function seedDatabase() {
  try {
    // 1. Database se connect karo
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // 2. Purana kachra saaf karo (Reset DB)
    await Listing.deleteMany({})
    console.log('🧹 Cleared old listings')

    // 3. Ek Dummy Host (User) banao kyunki har listing ka ek malik (host) hona zaroori hai
    let host = await User.findOne({ email: 'host@staynest.com' })
    if (!host) {
      host = await User.create({
        name: 'Super Host',
        email: 'host@staynest.com',
        password: 'password123', // Real app mein password hash hota hai, par seed ke liye theek hai
      })
      console.log('👤 Created dummy host')
    }

    // 4. Asli Properties ka data
const sampleListings = [
      { 
        title: 'Luxury Beachfront Villa', price: 350, description: 'Stunning ocean views with private pool.', 
        images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://plus.unsplash.com/premium_photo-1661963239507-7bdf41a5e66b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGx1eHVyeSUyMGhvdGVsfGVufDB8fDB8fHww', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Bali', country: 'Indonesia', lat: -8.4095, lng: 115.1889 }, category: 'beach', bedrooms: 3, bathrooms: 2, maxGuests: 6, rating: 4.9, reviewCount: 124, host: host._id 
      },
      { 
        title: 'Bali Jungle Treehouse', price: 160, description: 'Sleep in the trees, surrounded by nature.', 
        images: ['https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://img.magnific.com/free-photo/luxury-bedroom-interior-with-rich-furniture-scenic-view-from-walkout-deck_1258-111480.jpg?semt=ais_hybrid&w=740&q=80', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Ubud', country: 'Indonesia', lat: -8.5069, lng: 115.2645 }, category: 'countryside', bedrooms: 1, bathrooms: 1, maxGuests: 2, rating: 4.8, reviewCount: 130, host: host._id 
      },
      { 
        title: 'Cozy Mountain Chalet', price: 142, description: 'Wooden cabin in snowy mountains.', 
        images: ['https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://images6.alphacoders.com/349/thumb-1920-349835.jpg', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Zermatt', country: 'Switzerland', lat: 46.0207, lng: 7.7491 }, category: 'mountain', bedrooms: 2, bathrooms: 1, maxGuests: 4, rating: 4.7, reviewCount: 89, host: host._id 
      },
      { 
        title: 'Modern City Loft', price: 225, description: 'Stylish loft in the heart of Manhattan.', 
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80','https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZmFuY3klMjBob3RlbHxlbnwwfHwwfHx8MA%3D%3D', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 }, category: 'city', bedrooms: 1, bathrooms: 1, maxGuests: 2, rating: 4.8, reviewCount: 203, host: host._id 
      },
      { 
        title: 'Santorini Private Pool Villa', price: 450, description: 'Luxury living with iconic caldera views.', 
        images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80','https://media.istockphoto.com/id/1347151098/photo/3d-render-luxury-hotel-lobby-entrance.jpg?s=612x612&w=0&k=20&c=uR_2ueGq-3glTRe33WL5gYxCuCzxvRY-qrlfsl-S0Z8=', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Santorini', country: 'Greece', lat: 36.3932, lng: 25.4615 }, category: 'luxury', bedrooms: 4, bathrooms: 3, maxGuests: 8, rating: 5.0, reviewCount: 67, host: host._id 
      },
      { 
        title: 'Tuscan Farmhouse', price: 165, description: 'Rustic charm in the Italian countryside.', 
        images: ['https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80','https://images.luxuryescapes.com/fl_progressive,q_auto:best,dpr_2.0/x4qb9ujsd6gquojno7u', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Siena', country: 'Italy', lat: 43.3186, lng: 11.3306 }, category: 'countryside', bedrooms: 3, bathrooms: 2, maxGuests: 6, rating: 4.6, reviewCount: 45, host: host._id 
      },
      { 
        title: 'Parisian Chic Apartment', price: 198, description: 'Elegant apartment near the Eiffel Tower.', 
        images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80','https://www.holidify.com/images/cmsuploads/compressed/60029006_20210122111707.jpg', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 }, category: 'city', bedrooms: 2, bathrooms: 1, maxGuests: 4, rating: 4.8, reviewCount: 178, host: host._id 
      },
      { 
        title: 'Tropical Beach Bungalow', price: 119, description: 'Simple, serene living on the beach.', 
        images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://www.holidify.com/images/cmsuploads/compressed/60029006_20210122111707.jpg', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Phuket', country: 'Thailand', lat: 7.8804, lng: 98.3923 }, category: 'beach', bedrooms: 1, bathrooms: 1, maxGuests: 2, rating: 4.5, reviewCount: 92, host: host._id 
      },
      { 
        title: 'Alpine Ski Cabin', price: 310, description: 'Ski-in/Ski-out mountain experience.', 
        images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80','https://assets.cntraveller.in/photos/63b80c6d79d81704e445df00/16:9/w_2560%2Cc_limit/Westin%2520Himalayas%2520facade.jpg', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Chamonix', country: 'France', lat: 45.9237, lng: 6.8694 }, category: 'mountain', bedrooms: 3, bathrooms: 2, maxGuests: 6, rating: 4.9, reviewCount: 56, host: host._id 
      },
      { 
        title: 'Kyoto Zen Garden House', price: 280, description: 'Traditional home with private garden.', 
        images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://www.theindia.co.in/blog/wp-content/uploads/2024/07/praveg-ghoghla-beach-resort-diu-1200x676.jpg', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Kyoto', country: 'Japan', lat: 35.0116, lng: 135.7681 }, category: 'countryside', bedrooms: 2, bathrooms: 1, maxGuests: 3, rating: 4.9, reviewCount: 112, host: host._id 
      },
      { 
        title: 'Dubai Palm Jumeirah Apartment', price: 550, description: 'Luxury apartment with stunning city skyline views.', 
        images: ['https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://www.theindia.co.in/blog/wp-content/uploads/2024/07/praveg-ghoghla-beach-resort-diu-1200x676.jpg', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Dubai', country: 'UAE', lat: 25.1124, lng: 55.1390 }, category: 'luxury', bedrooms: 2, bathrooms: 2, maxGuests: 4, rating: 4.9, reviewCount: 88, host: host._id 
      },
      { 
        title: 'Swiss Alps Glass Igloo', price: 600, description: 'Sleep under the stars in a heated glass dome.', 
        images: ['https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-ly1PgW7yhMAgF7Ue36nsFGlJwnm5K5fvOOhj3qRDqhUmuzup1dLYCRE&s=10', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Zermatt', country: 'Switzerland', lat: 46.0207, lng: 7.7491 }, category: 'mountain', bedrooms: 1, bathrooms: 1, maxGuests: 2, rating: 5.0, reviewCount: 42, host: host._id 
      },
      { 
        title: 'London Victorian Townhouse', price: 290, description: 'Historic home near Hyde Park.', 
        images: ['https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-ly1PgW7yhMAgF7Ue36nsFGlJwnm5K5fvOOhj3qRDqhUmuzup1dLYCRE&s=10', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 }, category: 'city', bedrooms: 3, bathrooms: 2, maxGuests: 6, rating: 4.7, reviewCount: 156, host: host._id 
      },
      { 
        title: 'Icelandic Wilderness Cabin', price: 210, description: 'Secluded cabin near volcanic landscapes.', 
        images: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://c4.wallpaperflare.com/wallpaper/782/201/264/luxury-resort-wallpaper-preview.jpg', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Reykjavik', country: 'Iceland', lat: 64.1265, lng: -21.8174 }, category: 'countryside', bedrooms: 2, bathrooms: 1, maxGuests: 4, rating: 4.8, reviewCount: 38, host: host._id 
      },
      { 
        title: 'Cape Town Sea View Flat', price: 180, description: 'Modern flat overlooking the Atlantic Ocean.', 
        images: ['https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://c4.wallpaperflare.com/wallpaper/782/201/264/luxury-resort-wallpaper-preview.jpg', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241 }, category: 'beach', bedrooms: 2, bathrooms: 2, maxGuests: 4, rating: 4.6, reviewCount: 95, host: host._id 
      },
      { 
        title: 'Rio de Janeiro Penthouse', price: 320, description: 'Luxury penthouse with balcony beach views.', 
        images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://w0.peakpx.com/wallpaper/872/339/HD-wallpaper-luxury-hotel-sea-view-paradise-maldives-resort.jpg', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Rio', country: 'Brazil', lat: -22.9068, lng: -43.1729 }, category: 'luxury', bedrooms: 3, bathrooms: 3, maxGuests: 6, rating: 4.9, reviewCount: 110, host: host._id 
      },
      { 
        title: 'Toronto Downtown Condo', price: 240, description: 'High-rise condo in the busy city center.', 
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://w0.peakpx.com/wallpaper/872/339/HD-wallpaper-luxury-hotel-sea-view-paradise-maldives-resort.jpg', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 }, category: 'city', bedrooms: 1, bathrooms: 1, maxGuests: 2, rating: 4.5, reviewCount: 64, host: host._id 
      },
      { 
        title: 'Spanish Olive Grove Villa', price: 195, description: 'Experience the authentic rural lifestyle.', 
        images: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://w0.peakpx.com/wallpaper/872/339/HD-wallpaper-luxury-hotel-sea-view-paradise-maldives-resort.jpg', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Seville', country: 'Spain', lat: 37.3891, lng: -5.9845 }, category: 'countryside', bedrooms: 3, bathrooms: 2, maxGuests: 6, rating: 4.8, reviewCount: 72, host: host._id 
      },
      { 
        title: 'Colorado Riverfront Cabin', price: 155, description: 'Peaceful fishing retreat by the river.', 
        images: ['https://images.unsplash.com/photo-1518733057094-95b53143d2a7?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://w0.peakpx.com/wallpaper/872/339/HD-wallpaper-luxury-hotel-sea-view-paradise-maldives-resort.jpg', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Aspen', country: 'USA', lat: 39.1911, lng: -106.8175 }, category: 'mountain', bedrooms: 2, bathrooms: 1, maxGuests: 4, rating: 4.7, reviewCount: 50, host: host._id 
      },
      { 
        title: 'Greek Island Stone Cottage', price: 130, description: 'Traditional white-washed island home.', 
        images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://content.r9cdn.net/rimg/kimg/39/12/a6d3f17d1a184e05.jpg?width=335&height=268&crop=true', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Mykonos', country: 'Greece', lat: 37.4467, lng: 25.3289 }, category: 'countryside', bedrooms: 1, bathrooms: 1, maxGuests: 2, rating: 4.9, reviewCount: 81, host: host._id 
      },
      { 
        title: 'Maldives Overwater Bungalow', price: 800, description: 'Ultimate luxury above crystal waters.', 
        images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://content.r9cdn.net/rimg/kimg/39/12/a6d3f17d1a184e05.jpg?width=335&height=268&crop=true', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Male', country: 'Maldives', lat: 4.1755, lng: 73.5093 }, category: 'luxury', bedrooms: 1, bathrooms: 1, maxGuests: 2, rating: 5.0, reviewCount: 200, host: host._id 
      },
      { 
        title: 'Tokyo Skytree View Studio', price: 275, description: 'Modern studio with incredible city views.', 
        images: ['https://media.cntraveler.com/photos/5a9333698087c02669a7dc09/16:9/w_2560,c_limit/ONE@Tokyo_2018_29_Library-Suite.jpg', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80', 'https://content.r9cdn.net/rimg/kimg/39/12/a6d3f17d1a184e05.jpg?width=335&height=268&crop=true', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80'], 
        location: { city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 }, category: 'city', bedrooms: 1, bathrooms: 1, maxGuests: 2, rating: 4.9, reviewCount: 99, host: host._id 
      },
      { 
        title: 'Amsterdam Canal House', price: 310, description: 'Classic home right on the water.', 
        images: ['https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW0qlMflGqgBIXNn8pJAXEZQqk5ps3epoGMhx2Pgpj8Q&s=10', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041 }, category: 'city', bedrooms: 2, bathrooms: 1, maxGuests: 4, rating: 4.8, reviewCount: 115, host: host._id 
      },
      { 
        title: 'New York Penthouse Suite', price: 950, description: 'Ultimate luxury overlooking Central Park.', 
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW0qlMflGqgBIXNn8pJAXEZQqk5ps3epoGMhx2Pgpj8Q&s=10', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'New York', country: 'USA', lat: 40.7850, lng: -73.9682 }, category: 'luxury', bedrooms: 3, bathrooms: 3, maxGuests: 6, rating: 5.0, reviewCount: 45, host: host._id 
      },
      { 
        title: 'Icelandic Glacier Dome', price: 420, description: 'Unique stay in the frozen tundra.', 
        images: ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW0qlMflGqgBIXNn8pJAXEZQqk5ps3epoGMhx2Pgpj8Q&s=10', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Hella', country: 'Iceland', lat: 63.8342, lng: -20.3951 }, category: 'countryside', bedrooms: 1, bathrooms: 1, maxGuests: 2, rating: 4.9, reviewCount: 52, host: host._id 
      },
      { 
        title: 'Venice Grand Canal Palazzo', price: 750, description: 'Step back in history in this majestic palace.', 
        images: ['https://images.unsplash.com/photo-1534190239940-9ba8944ea261?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW0qlMflGqgBIXNn8pJAXEZQqk5ps3epoGMhx2Pgpj8Q&s=10', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Venice', country: 'Italy', lat: 45.4408, lng: 12.3155 }, category: 'luxury', bedrooms: 4, bathrooms: 4, maxGuests: 8, rating: 4.9, reviewCount: 88, host: host._id 
      },
      { 
        title: 'Singapore Marina Bay Loft', price: 620, description: 'Futuristic living in the city center.', 
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW0qlMflGqgBIXNn8pJAXEZQqk5ps3epoGMhx2Pgpj8Q&s=10', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Singapore', country: 'Singapore', lat: 1.2879, lng: 103.8519 }, category: 'city', bedrooms: 2, bathrooms: 2, maxGuests: 4, rating: 4.9, reviewCount: 140, host: host._id 
      },
      { 
        title: 'Mexican Beachfront Casita', price: 145, description: 'Colorful home right on the sand.', 
        images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://www.global-gallivanting.com/wp-content/uploads/2017/11/taj-holiday-village-pool-1024x683.jpg', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Tulum', country: 'Mexico', lat: 20.2114, lng: -87.4654 }, category: 'beach', bedrooms: 1, bathrooms: 1, maxGuests: 2, rating: 4.7, reviewCount: 77, host: host._id 
      },
      { 
        title: 'Berlin Industrial Warehouse Loft', price: 230, description: 'Cool, raw aesthetic in a trendy area.', 
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://www.global-gallivanting.com/wp-content/uploads/2017/11/taj-holiday-village-pool-1024x683.jpg', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 }, category: 'city', bedrooms: 2, bathrooms: 1, maxGuests: 4, rating: 4.6, reviewCount: 65, host: host._id 
      },
      { 
        title: 'Moroccan Riad Oasis', price: 260, description: 'Traditional courtyard home with pool.', 
        images: ['https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80', 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80', 'https://www.global-gallivanting.com/wp-content/uploads/2017/11/taj-holiday-village-pool-1024x683.jpg', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'], 
        location: { city: 'Marrakech', country: 'Morocco', lat: 31.6295, lng: -7.9811 }, category: 'countryside', bedrooms: 3, bathrooms: 2, maxGuests: 6, rating: 4.8, reviewCount: 92, host: host._id 
      }
    ]

    // 5. Data ko MongoDB mein insert karo
    await Listing.insertMany(sampleListings)
    console.log('🎉 Successfully added real properties to database!')
    
    // Script ko band karo
    process.exit()

  } catch (error) {
    console.error('❌ Error seeding data:', error)
    process.exit(1)
  }
}

seedDatabase()