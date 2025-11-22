require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/portail_touristique';

async function main() {
  const argv = require('minimist')(process.argv.slice(2));
  const name = argv.name || argv.n || process.env.ADMIN_NAME || 'admin';
  const email = argv.email || argv.e || process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = argv.password || argv.p || process.env.ADMIN_PASSWORD || 'ChangeMe123!';

  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  let user = await User.findOne({ email });
  const hash = await bcrypt.hash(password, 10);

  if (user) {
    user.name = name;
    user.password = hash;
    user.isAdmin = true;
    await user.save();
    console.log(`Updated existing user ${email} to admin.`);
  } else {
    user = await User.create({ name, email, password: hash, isAdmin: true });
    console.log(`Created new admin user ${email}.`);
  }

  console.log('Done.');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
