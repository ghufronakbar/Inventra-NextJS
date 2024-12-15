import { Pagination } from "@/interface/response/Api";
import { useRouter } from "next/router";

const PaginationButton = ({ paging }: { paging: Pagination }) => {
  const router = useRouter();
  const pathname = router.pathname;
  const query = router.query;

  const handlePageChange = (page: number) => {
    router.push({
      pathname,
      query: {
        ...query,
        page: page.toString(),
      },
    });
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const totalPagesToShow = 5;
    const totalPages = paging.totalPage;

    let startPage = Math.max(
      1,
      paging.currentPage - Math.floor(totalPagesToShow / 2)
    );
    let endPage = startPage + totalPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - totalPagesToShow + 1);
    }

    // Add first page
    if (startPage > 1) {
      pageNumbers.push(
        <li key={1}>
          <button
            onClick={() => handlePageChange(1)}
            className={`flex items-center justify-center px-4 h-10 leading-tight ${
              paging.currentPage === 1
                ? "text-blue-600 bg-blue-50 border-blue-300"
                : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            } border`}
          >
            1
          </button>
        </li>
      );

      if (startPage > 2) {
        pageNumbers.push(
          <li key="start-ellipsis">
            <button
              onClick={() => handlePageChange(Math.floor((startPage + 1) / 2))}
              className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            >
              ...
            </button>
          </li>
        );
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li key={i}>
          <button
            onClick={() => handlePageChange(i)}
            className={`flex items-center justify-center px-4 h-10 leading-tight ${
              paging.currentPage === i
                ? "text-blue-600 bg-blue-50 border-blue-300"
                : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            } border`}
          >
            {i}
          </button>
        </li>
      );
    }

    // Add last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <li key="end-ellipsis">
            <button
              onClick={() =>
                handlePageChange(Math.floor((endPage + totalPages) / 2))
              }
              className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            >
              ...
            </button>
          </li>
        );
      }

      pageNumbers.push(
        <li key={totalPages}>
          <button
            onClick={() => handlePageChange(totalPages)}
            className={`flex items-center justify-center px-4 h-10 leading-tight ${
              paging.currentPage === totalPages
                ? "text-blue-600 bg-blue-50 border-blue-300"
                : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            } border`}
          >
            {totalPages}
          </button>
        </li>
      );
    }

    return pageNumbers;
  };

  return (
    <>
      <nav className="mt-4 mb-2 mx-auto">
        <ul className="inline-flex -space-x-px text-base h-10">
          {/* First and Previous Buttons */}
          {paging.currentPage > 1 && (
            <>
              <li>
                <button
                  onClick={() => handlePageChange(1)}
                  className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                >
                  First
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageChange(paging.currentPage - 1)}
                  className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                >
                  &laquo;
                </button>
              </li>
            </>
          )}

          {/* Page Number Buttons */}
          {renderPageNumbers()}

          {/* Next and Last Buttons */}
          {paging.currentPage < paging.totalPage && (
            <>
              <li>
                <button
                  onClick={() => handlePageChange(paging.currentPage + 1)}
                  className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                >
                  &raquo;
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageChange(paging.totalPage)}
                  className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
                >
                  Last
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div className="text-sm mx-auto">
        Page: {paging.currentPage} / {paging.totalPage}
      </div>
    </>
  );
};

export default PaginationButton;
