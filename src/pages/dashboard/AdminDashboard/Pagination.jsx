import Button from "../../../components/Button";

const Pagination = ({
  currentPage,
  totalPages,
  usersPerPage,
  filteredUsers,
  indexOfFirstUser,
  indexOfLastUser,
  setCurrentPage,
}) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Showing {indexOfFirstUser + 1} to{" "}
        {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
        {filteredUsers.length} users
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-xs bg-transparent"
        >
          Previous
        </Button>
        <div className="flex gap-1">
          {startPage > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                className="text-xs bg-transparent"
              >
                1
              </Button>
              {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
            </>
          )}
          {pageNumbers.map((number) => (
            <Button
              key={number}
              variant={currentPage === number ? "primary" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(number)}
              className={`text-xs ${
                currentPage !== number ? "bg-transparent" : ""
              }`}
            >
              {number}
            </Button>
          ))}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="px-2 text-gray-500">...</span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                className="text-xs bg-transparent"
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-xs bg-transparent"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
