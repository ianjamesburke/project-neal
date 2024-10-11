import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  // Add any necessary options here
});

export async function GET() {
  const headersList = headers();
  const userID = headersList.get("userID");
  userID ? console.log("User ID:", userID) : console.log("User ID not found");
  
  try {
    await client.connect();
    const database = client.db("userdata");
    const collection = database.collection("users");

    const userdata = await collection.findOne({ user_id: userID });
    console.log("User data:", userdata);

    return NextResponse.json({ video_url: userdata?.video_url || null }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(req) {
  const data = await req.json();
  console.log("Data received:", data);
  const headersList = headers();
  const userID = headersList.get("userID");
  userID ? console.log("User ID:", userID) : console.log("User ID not found");

  try {
    await client.connect();
    const db = client.db("userdata");
    const coll = db.collection("users");
    
    const result = await coll.updateOne(
      { user_id: userID },
      { $set: { ...data, user_id: userID } },
      { upsert: true }
    );

    console.log("Database operation result:", result);
    return NextResponse.json({ success: true, message: "Data updated successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Unable to connect to database" }, { status: 500 });
  } finally {
    await client.close();
  }
}