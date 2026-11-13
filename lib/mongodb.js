import { MongoClient } from "mongodb";
let p = global._mevagoldMongo;
export function db() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing");
  if (!p) p = global._mevagoldMongo = new MongoClient(process.env.MONGODB_URI).connect();
  return p.then(c => c.db(process.env.MONGODB_DB || "mevagold"));
}
