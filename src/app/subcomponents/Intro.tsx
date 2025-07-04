"use client";

import { useEffect, useState } from "react";
import { QUOTES } from "@/app/data/quoteData";

export default function Intro({ onFinish }: { onFinish: () => void }) {
  const [showTitle, setShowTitle] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Pick and lock a random quote once
    const random =
      QUOTES[Math.floor(Math.random() * QUOTES.length)] ||
      "Success is not by chance, it's by choice.";
    setQuote(random);

    // Fade in Pru MDRT
    setShowTitle(true);

    // After 1.5s, fade in quote
    const quoteTimer = setTimeout(() => {
      setShowQuote(true);
    }, 1500);

    // After 5s, fade out all
    const finishTimer = setTimeout(() => {
      setShowTitle(false);
      setShowQuote(false);
    }, 5000);

    // After 6s, run onFinish
    const exitTimer = setTimeout(() => {
      onFinish();
    }, 6000);

    return () => {
      clearTimeout(quoteTimer);
      clearTimeout(finishTimer);
      clearTimeout(exitTimer);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <h1
        className={`text-4xl font-bold mb-4 text-red-600 transition-opacity duration-1000 ${
          showTitle ? "opacity-100" : "opacity-0"
        }`}
      >
        Pru MDRT
      </h1>

      <div
        className={`mx-4 rounded-2xl bg-white/90 text-[#e31d1a] p-4 border border-[#e31d1a] shadow-md transition-opacity duration-1000 ${
          showQuote ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-center text-2xl italic">“{quote}”</p>
      </div>
    </div>
  );
}
