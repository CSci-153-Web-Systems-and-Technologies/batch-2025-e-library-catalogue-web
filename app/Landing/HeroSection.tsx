"use client";
import { useRouter } from "next/navigation";
import React from "react";

const HeroSection = () => {
  const router = useRouter();
  return (
    <section
      className="relative flex flex-col justify-center items-start px-6 md:px-20 overflow-hidden"
      style={{
        minHeight: "550px",
        height: "90vh",
        maxHeight: "900px",
      }}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(/Background/side.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div 
        className="absolute inset-0 z-10"
        style={{
          background: "linear-gradient(to right, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 55%, transparent 70%)"
        }}
      />

      <div className="relative z-20 max-w-3xl text-white">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-[0_6px_14px_rgba(0,0,0,0.7)]">
          From Browse to Borrow,
          <br />
          in a Click
        </h1>

        <button
          onClick={() => router.push("/auth/login")}
          className="mt-8 px-7 py-4 bg-[#10b8aa] hover:bg-green-700 transition-all duration-300 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl"
        >
          Explore
        </button>
      </div>
    </section>
  );
};

export default HeroSection;