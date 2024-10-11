import { NextRequest, NextResponse } from "next/server";
import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";

const client = jwksClient({
  jwksUri: `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
});

export async function POST(req: NextRequest) {
  console.log("Received webhook request");
  try {
    const token = await req.text();
    console.log("Received token:", token);

    const { header, payload } = jwt.decode(token, { complete: true });
    console.log("Decoded payload:", payload);

    const { kid } = header;

    const key = await client.getSigningKey(kid);
    const signingKey = key.getPublicKey();
    const event = await jwt.verify(token, signingKey);

    console.log("Verified event:", event);

    if (event?.type === "user.created") {
      const userData = event.data;
      console.log("New user created:", userData);

      // Instead of making an internal fetch request, let's directly call a function
      // to handle the database operation
      const result = await createUserInDatabase(userData);
      console.log("DB creation result:", result);
    }

    return NextResponse.json({ status: 200, statusText: "success" });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

async function createUserInDatabase(userData: any) {
  const { MongoClient } = require("mongodb");
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, {
    // Add any necessary options here
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("userdata");
    const coll = db.collection("users");

    const result = await coll.updateOne(
      { user_id: userData.id },
      {
        $set: {
          email: userData.email,
          given_name: userData.given_name,
          family_name: userData.family_name,
          user_id: userData.id,
        },
      },
      { upsert: true }
    );

    console.log("Database operation result:", result);
    return { success: true, message: "Data updated successfully" };
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    await client.close();
  }
}
