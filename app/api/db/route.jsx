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

    const database = client.db("userdata");
    const collection = database.collection("users");

    console.log("Attempting to fetch data");
    // You will change the user_id to the one you want to fetch
    const userdata = await collection.find({user_id:123456}).toArray();
    userdata && console.log("Data fetched successfully");

    return NextResponse.json(userdata[0].video_url, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    console.log("Closing MongoDB connection");
    await client.close();
  }
}
