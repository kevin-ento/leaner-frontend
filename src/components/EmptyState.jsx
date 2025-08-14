"use client";

const EmptyState = ({ icon, title, subtitle, action }) => {
  return (
    <div className="text-center py-6 sm:py-8">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
        <span className="text-lg sm:text-2xl">{icon}</span>
      </div>
      {title && (
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-3">
          {subtitle}
        </p>
      )}
      {action}
    </div>
  );
};

export default EmptyState;


