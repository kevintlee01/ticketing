import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  var signin: () => string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'test_key';

  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }

  await mongoose.connection.close();
});

global.signin = () => {
  // Build a JWT payload. {id, email}
  const payload = {
    id: 'fake_id',
    email: 'test@test.com'
  }

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object. {jwt: test_key}
  const session = { jwt: token };

  // Turn session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it to base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Return a string that's the cookie with encoded data
  return [`session=${base64}`];
};
