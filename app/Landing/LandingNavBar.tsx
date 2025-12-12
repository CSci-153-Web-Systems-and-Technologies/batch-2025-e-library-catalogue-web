"use client";
import { useRouter } from "next/navigation";
import { BookOpen, ChevronLeft } from 'lucide-react'
import React from "react";

const LandingNavBar = () => {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
      <div
        onClick={() => router.push("/")}
        className="flex items-center gap-2 cursor-pointer"
      >
          <BookOpen className="w-5 h-5" /> 
        <h1 className="text-xl font-black text-gray-900">BookIt</h1>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => router.push("/auth/login")}
          className="border border-[#10b8aa] text-green-700 px-4 py-1 rounded-full hover:bg-green-50 font-medium"
        >
          Log in
        </button>
        <button
          onClick={() => router.push("/auth/sign-up")}
          className="bg-[#10b8aa] text-white px-4 py-1 rounded-full hover:bg-green-700 font-medium"
        >
          Sign up
        </button>
      </div>
    </header>
  );
};

export default LandingNavBar;