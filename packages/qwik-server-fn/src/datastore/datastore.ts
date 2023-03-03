
import { type Db } from 'mongodb';

let _db: Db;
export const getDb = async () => {
  if (_db) return _db;
  const { MongoClient } = await import('mongodb');
  const client = await MongoClient.connect('mongodb://localhost:27017');
  return _db = client.db('suitespot');
};
