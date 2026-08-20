import mongoose from 'mongoose';
import dns from 'dns';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

// Resolve Node.js Windows DNS SRV lookup issues for MongoDB Atlas (+srv)
try {
  dns.setDefaultResultOrder?.('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  // Ignore DNS override errors if unsupported
}

// Disable command buffering so queries fail fast when DB is disconnected instead of hanging 10s
mongoose.set('bufferCommands', false);

const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('📦 Empty database detected. Auto-seeding initial data...');
      
      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@urbankart.com',
        password: 'password123',
        role: 'admin',
      });

      await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      });

      const categories = await Category.create([
        { name: 'Electronics', description: 'Smartphones, laptops, headphones, and more', image: '/uploads/categories/electronics.jpg' },
        { name: 'Fashion', description: 'Clothing, shoes, and accessories', image: '/uploads/categories/fashion.jpg' },
        { name: 'Home & Kitchen', description: 'Appliances, decor, cookware', image: '/uploads/categories/home.jpg' },
        { name: 'Books', description: 'Bestsellers, fiction, non-fiction', image: '/uploads/categories/books.jpg' },
        { name: 'Beauty', description: 'Skincare, makeup, fragrances', image: '/uploads/categories/beauty.jpg' },
      ]);

      const [electronics, fashion, homeKitchen, books, beauty] = categories;

      await Product.create([
        {
          name: 'iPhone 15 Pro Max 256GB',
          description: 'Apple iPhone 15 Pro Max with A17 Pro chip, 48MP camera system, titanium design.',
          price: 134900,
          comparePrice: 159900,
          category: electronics._id,
          images: ['/uploads/products/iphone15.jpg'],
          stock: 25,
          brand: 'Apple',
          avgRating: 4.5,
          numReviews: 128,
          featured: true,
        },
        {
          name: 'Samsung Galaxy S24 Ultra',
          description: 'Samsung Galaxy S24 Ultra with Galaxy AI, 200MP camera, S Pen built-in, titanium frame.',
          price: 129999,
          comparePrice: 144999,
          category: electronics._id,
          images: ['/uploads/products/samsung-s24.jpg'],
          stock: 30,
          brand: 'Samsung',
          avgRating: 4.3,
          numReviews: 95,
          featured: true,
        },
        {
          name: 'Sony WH-1000XM5 Headphones',
          description: 'Industry-leading noise canceling wireless headphones with Auto NC Optimizer.',
          price: 26990,
          comparePrice: 34990,
          category: electronics._id,
          images: ['/uploads/products/sony-wh1000xm5.jpg'],
          stock: 50,
          brand: 'Sony',
          avgRating: 4.7,
          numReviews: 256,
          featured: true,
        },
        {
          name: 'MacBook Air M3 15-inch',
          description: 'Apple MacBook Air with M3 chip, 15.3-inch Liquid Retina display, 16GB memory.',
          price: 149900,
          comparePrice: 164900,
          category: electronics._id,
          images: ['/uploads/products/macbook-air-m3.jpg'],
          stock: 15,
          brand: 'Apple',
          avgRating: 4.8,
          numReviews: 67,
          featured: true,
        },
        {
          name: 'Atomic Habits by James Clear',
          description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.',
          price: 399,
          comparePrice: 699,
          category: books._id,
          images: ['/uploads/products/atomic-habits.jpg'],
          stock: 200,
          brand: 'Penguin',
          avgRating: 4.7,
          numReviews: 1234,
          featured: true,
        },
        {
          name: 'Nike Air Max 270 Sneakers',
          description: 'Nike Air Max with tall Air unit for all-day comfort.',
          price: 11495,
          comparePrice: 14995,
          category: fashion._id,
          images: ['/uploads/products/nike-airmax270.jpg'],
          stock: 60,
          brand: 'Nike',
          avgRating: 4.4,
          numReviews: 189,
          featured: true,
        },
      ]);

      console.log('✅ Auto-seeding completed! Test accounts ready:');
      console.log('   Admin: admin@urbankart.com / password123');
      console.log('   User:  john@example.com / password123');
    }
  } catch (err) {
    console.error('Auto-seed warning:', err.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await autoSeedIfEmpty();
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error(`⚠️  If you are running locally without local MongoDB installed on port 27017, please update MONGO_URI in server/.env with your MongoDB Atlas connection string.`);
    throw error;
  }
};

export default connectDB;

