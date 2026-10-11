import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoUrl = process.env.MONGODB_URL;

if (!mongoUrl) {
  throw new Error("MONGODB_URL must be set to use authentication.");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
  mongoClientUrl?: string;
};

const client =
  globalForMongo.mongoClientUrl === mongoUrl && globalForMongo.mongoClient
    ? globalForMongo.mongoClient
    : new MongoClient(mongoUrl);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
  globalForMongo.mongoClientUrl = mongoUrl;
}

const db = client.db("new-bazar");

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true, 
  },
  socialProviders: {
    ...(googleClientId && googleClientSecret
      ? { google: { clientId: googleClientId, clientSecret: googleClientSecret } }
      : {}),
    ...(githubClientId && githubClientSecret
      ? { github: { clientId: githubClientId, clientSecret: githubClientSecret } }
      : {}),
  },
  database: mongodbAdapter(db, {
    client,
  }),
});