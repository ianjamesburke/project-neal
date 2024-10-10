import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

/** This is used to pull the user data from the database */
export async function GET() {
  const client = new MongoClient(process.env.MONGODB_URI!, {});

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

/** This is used to update the database */
export async function POST(req) {
  const client = new MongoClient(process.env.MONGODB_URI!, {});
  const data = await req.json();

  try {
    /*
        await client.connect()
        const db = client.db('userdata')
        const coll = db.collection('users')
        await coll.insertMany(data)
        */

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Unable to connect to database" });
  } finally {
    await client.close();
  }
}
