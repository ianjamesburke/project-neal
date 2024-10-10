import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  // Add any necessary options here
});

export async function GET() {
  console.log("GET request received");
  try {
    console.log("Attempting to connect to MongoDB");
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("your_database_name");
    const collection = database.collection("userdata");

    console.log("Attempting to fetch data");
    const userdata = await collection.find({}).limit(10).toArray();
    console.log("Data fetched successfully");

    return NextResponse.json(userdata, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    console.log("Closing MongoDB connection");
    await client.close();
  }
}
