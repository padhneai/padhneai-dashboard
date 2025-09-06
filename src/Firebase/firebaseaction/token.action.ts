"use server";
import { Timestamp } from "firebase-admin/firestore";

import { db } from "@/Firebase/admin";
import { randomBytes } from "crypto";
import { getEmailByUid } from "./auth.action";


// Generate a random token and store in Firestore
export async function generateToken(length = 4): Promise<string> {
  try {
    const token = randomBytes(length)
    .toString("hex")
    .slice(0, length)
    .toUpperCase();
    

  const tokenData: Token = {
    value: token,
    createdAt: new Date(),
    usedBy: null,
    usedemail:null,
    expiresAt: null
  };

  await db.collection('tokens').doc(token).set(tokenData);
  // console.log(token)
  return token;
  } catch (error:any) {
    // console.log(error)
    throw new Error(error)
  }
}

// Verify token for a given user UID
export async function verifyToken(token: string, uid: string): Promise<boolean> {
  const tokenDoc = await db.collection('tokens').doc(token).get();

  if (!tokenDoc.exists) return false;

  const data = tokenDoc.data() as Token;

  if (data.usedBy) return false; // Token already used
  if (data.expiresAt && data.expiresAt < new Date()) return false; // Token expired

  // Get user email
  const email = await getEmailByUid(uid);

  // Mark token as used by this user and update user info in one operation
  const batch = db.batch();

  batch.update(db.collection('tokens').doc(token), { usedBy: uid });
  if (email) {
    batch.update(db.collection('users').doc(uid), { 
      usedemail: email,
      tokenVerified: true
    });
  } else {
    // fallback if email not found
    batch.update(db.collection('users').doc(uid), { tokenVerified: true });
  }

  await batch.commit();

  return true;
}




export async function getCurrTokens(): Promise<Token[]> {
  const snapshot = await db.collection("tokens").orderBy("createdAt", "desc").get();

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Token;

    return {
      ...data,
      createdAt:
        data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      expiresAt:
        data.expiresAt instanceof Timestamp
          ? data.expiresAt.toDate()
          : data.expiresAt
          ? new Date(data.expiresAt)
          : null,
    };
  });
}


// Get all tokens with safe date conversion
export async function getAllTokens(): Promise<Token[]> {
  const snapshot = await db.collection('tokens').orderBy('createdAt', 'desc').get();
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Token;
    console.log(data)
    return {
      ...data,
       createdAt:
        data.createdAt instanceof Timestamp ?
         data.createdAt.toDate() 
         : new Date(data.createdAt),
      expiresAt:
        data.expiresAt instanceof Timestamp
          ? data.expiresAt.toDate()
          : data.expiresAt
          ? new Date(data.expiresAt)
          : null,
    
    };
  });
}


// Delete a token by value
export async function deleteToken(token: string): Promise<boolean> {
  try {
    const tokenRef = db.collection('tokens').doc(token);
    const tokenDoc = await tokenRef.get();
    if (!tokenDoc.exists) return false;

    await tokenRef.delete();
    return true;
  } catch (error) {
    console.error("Failed to delete token:", error);
    return false;
  }
}

// Check if a specific user has verified a token

