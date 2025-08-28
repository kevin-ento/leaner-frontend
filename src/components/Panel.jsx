"use client";

import { memo } from "react";

const Panel = memo(({ title, count, actions, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          {title && (
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {title}
              {typeof count === "number" && (
                <span className="ml-1 text-gray-500 dark:text-gray-400">({count})</span>
              )}
            </h3>
          )}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
});

Panel.displayName = 'Panel';

export default Panel;


