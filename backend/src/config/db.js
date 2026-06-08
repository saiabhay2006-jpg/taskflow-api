const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Google DNS (fixes SRV lookup failures with some ISPs)
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('\n💡 Tip: If you don\'t have MongoDB installed locally, use MongoDB Atlas (free):');
    console.error('   1. Go to https://cloud.mongodb.com → Create free cluster');
    console.error('   2. Click Connect → Drivers → Copy connection string');
    console.error('   3. Update MONGO_URI in your .env file\n');
    process.exit(1);
  }
};

module.exports = connectDB;
