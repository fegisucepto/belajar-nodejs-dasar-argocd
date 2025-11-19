const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri); // Removed deprecated options
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  const collectionNames = Object.keys(collections);
  await Promise.all(collectionNames.map(
    (key) => collections[key].deleteMany({}), // Added trailing comma here
  ));
});
