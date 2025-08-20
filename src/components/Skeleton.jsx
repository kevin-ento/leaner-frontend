import { memo } from "react";

const Skeleton = memo(({ 
  variant = "text", 
  className = "", 
  lines = 1,
  width = "full",
  height = "h-4"
}) => {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-700 rounded";
  
  const variants = {
    text: `${height} ${width}`,
    circle: "rounded-full",
    rectangle: "rounded-lg",
    card: "rounded-lg p-4 space-y-3"
  };

  const widths = {
    full: "w-full",
    "1/2": "w-1/2",
    "1/3": "w-1/3",
    "2/3": "w-2/3",
    "1/4": "w-1/4",
    "3/4": "w-3/4",
    auto: "w-auto"
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variants[variant]} ${widths[width]} ${
              index === lines - 1 ? widths[width] : "w-full"
            }`}
          />
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`${baseClasses} ${variants[variant]} ${className}`}>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${variants[variant]} ${widths[width]} ${height} ${className}`} />
  );
});

Skeleton.displayName = 'Skeleton';

export default Skeleton;
