const ViewToggle = ({ viewMode, setViewMode, setCurrentPage }) => {
  const handleViewChange = (mode) => {
    setViewMode(mode);
    setCurrentPage(1);
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
      <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
        <button
          onClick={() => handleViewChange("cards")}
          className={`px-3 py-1 text-xs ${
            viewMode === "cards"
              ? "bg-gray-50 dark:bg-gray-600"
              : "bg-white dark:bg-gray-700"
          } text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600`}
        >
          Cards
        </button>
        <button
          onClick={() => handleViewChange("table")}
          className={`px-3 py-1 text-xs ${
            viewMode === "table"
              ? "bg-gray-50 dark:bg-gray-600"
              : "bg-white dark:bg-gray-700"
          } text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500`}
        >
          Table
        </button>
      </div>
    </div>
  );
};

export default ViewToggle;
