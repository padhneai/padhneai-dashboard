"use server";
import { Timestamp } from "firebase-admin/firestore";

import { db } from "@/Firebase/admin";





export async function getAllApplications(): Promise<InternApplication[] | null> {
  try {
    const snapshot = await db
      .collection("application")
      .orderBy("createdAt", "desc")
      .get();

    const applications: InternApplication[] = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        ...(data as Omit<InternApplication, "id" | "createdAt">),
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : new Date(data.createdAt || Date.now()), // fallback if missing
      };
    });

    return applications;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return null;
  }
}




// Delete an application by ID
export async function deleteApplication(id: string): Promise<boolean> {
  try {
    const applicationRef = db.collection("application").doc(id);
    const applicationDoc = await applicationRef.get();
    if (!applicationDoc.exists) return false;

    await applicationRef.delete();
    return true;
  } catch (error) {
    console.error("Failed to delete application:", error);
    return false;
  }
}

