"use client";
import Lottie from "lottie-react";
import animationData from "@/app/assets/intro-animation.json";

export default function LottieIntro({ onFinish }: { onFinish: () => void }) {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <Lottie
        animationData={animationData}
        loop={false}
        onComplete={onFinish}
        style={{ width: 200, height: 200 }}
      />
    </div>
  );
}
