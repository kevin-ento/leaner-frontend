import { memo } from "react";

const LoadingScreen = memo(({ message = "Loading...", size = "default" }) => {
  const sizes = {
    sm: "h-16 w-16",
    default: "h-20 w-20",
    lg: "h-24 w-24",
    xl: "h-32 w-32"
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizes[size]} rounded-full border-4 border-gray-200 dark:border-gray-700`}></div>
        
        {/* Animated ring */}
        <div className={`${sizes[size]} rounded-full border-4 border-transparent border-t-primary-600 dark:border-t-primary-400 absolute top-0 left-0 animate-spin`}></div>
        
        {/* Inner content */}
        <div className={`${sizes[size]} rounded-full bg-primary-50 dark:bg-primary-900 absolute top-0 left-0 flex items-center justify-center`}>
          <div className="w-1/2 h-1/2 bg-primary-400 dark:bg-primary-500 rounded-full"></div>
        </div>
      </div>
      
      {message && (
        <div className="mt-6 text-center">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            {message}
          </p>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
          </div>
        </div>
      )}
    </div>
  );
});

LoadingScreen.displayName = 'LoadingScreen';

export default LoadingScreen;


