"use client";

const LoadingScreen = ({ fullHeight = true }) => {
  return (
    <div
      className={`${fullHeight ? "min-h-screen" : "min-h-[10rem]"} flex items-center justify-center`}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
};

export default LoadingScreen;


