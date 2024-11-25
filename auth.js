import NextAuth from "next-auth";
// import { MongoDBAdapter } from "@auth/mongodb-adapter";
import Google from "next-auth/providers/google";
// import clientPromise from "./libs/mongoClient";
export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: MongoDBAdapter(clientPromise),
  providers: [Google],
});
