"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Page } from "@/models/Page";

import { User } from "@/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
const connectToDatabase = async () => {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};
export async function savePageSettings(formData) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Get session
    const session = await getServerSession(authOptions);
    if (!session) {
      return false; // No session means unauthorized
    }

    // Extract form data keys and prepare update object
    const dataKeys = ["displayName", "location", "bio", "bgType", "bgColor", "bgImage"];
    const dataToUpdate = dataKeys.reduce((acc, key) => {
      if (formData.has(key)) {
        acc[key] = formData.get(key);
      }
      return acc;
    }, {});

    // Update or create Page data
    const pageUpdatePromise = Page.updateOne(
      { owner: session.user.email },
      { $set: dataToUpdate },
      { upsert: true } // Create a new document if no match is found
    );

    // Update User avatar if provided
    let userUpdatePromise = Promise.resolve(); // No-op if no avatar provided
    if (formData.has("avatar")) {
      userUpdatePromise = User.updateOne(
        { email: session.user.email },
        { $set: { image: formData.get("avatar") } }
      );
    }

    // Run updates concurrently
    await Promise.all([pageUpdatePromise, userUpdatePromise]);

    return true; // Successful update or creation
  } catch (error) {
    console.error("Error saving page settings:", error);
    return false; // Return false in case of error
  }
}

export async function savePageButtons(formData) {
  mongoose.connect(process.env.MONGO_URI);
  const session = await getServerSession(authOptions);
  if (session) {
    const buttonsValues = {};
    formData.forEach((value, key) => {
      buttonsValues[key] = value;
    });
    const dataToUpdate = { buttons: buttonsValues };
    await Page.updateOne({ owner: session?.user?.email }, dataToUpdate);
    return true;
  }
  return false;
}

export async function savePageLinks(links) {
  mongoose.connect(process.env.MONGO_URI);
  const session = await getServerSession(authOptions);
  if (session) {
    await Page.updateOne({ owner: session?.user?.email }, { links });
  } else {
    return false;
  }
}
