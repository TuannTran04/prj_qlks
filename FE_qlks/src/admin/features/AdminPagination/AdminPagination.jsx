import React from "react";
import "./AdminPagination.css";

const AdminPagination = ({ paginationData }) => {
  const { currentPage, totalPages, newUrl, setCurrentPage } = paginationData;
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Thay đổi URL trên trình duyệt
    window.history.pushState(null, null, newUrl);
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`product_pagination-item product_pages ${
            i === currentPage ? "active" : ""
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <>
      <div className="adminRoom_pagination">
        <button
          className="adminRoom_pagination-item adminRoom_prev"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {renderPagination()}
        <button
          className="adminRoom_pagination-item adminRoom_next"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default AdminPagination;
