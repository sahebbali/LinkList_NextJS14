"use client";

import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function LoginWithGoogle() {


  return (
    <button
      onClick={() => signIn("google")}
      className="bg-white shadow text-center w-full py-4 flex gap-3 items-center justify-center hover:bg-gray-100 transition"
    >
      <FaGoogle className="h-6" />
      <span>Sign In with Google</span>
    </button>
  );
}
