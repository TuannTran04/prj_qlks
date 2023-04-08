import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AdminPagination from "../../features/AdminPagination/AdminPagination";
import {
  activeFAQ,
  deleteFAQ,
  getFAQsAdmin,
  searchFAQsAdmin,
} from "../../services/adminService";
import "./AdminFAQs.css";

const PAGE_SIZE = 5;

const AdminFAQs = () => {
  const [searchParams] = useSearchParams();
  const pageNumber = searchParams.get("page");
  const navigate = useNavigate();
  const [FAQs, setFAQs] = useState([]);
  console.log(FAQs);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber) || 1);
  const [totalPages, setTotalPages] = useState(0);

  const newUrl = `${window.location.pathname}?page=${currentPage}`;
  window.history.pushState(null, null, newUrl);

  const handleDeleteFAQs = async (faqId) => {
    try {
      console.log(faqId);
      const res = await deleteFAQ(faqId);
      console.log(res);
      setFAQs((prevFAQs) => prevFAQs.filter((faq) => faq.id !== faqId));
    } catch (err) {
      console.log(err);
    }
  };
  const handleConfirmDelete = (faqId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này không?")) {
      handleDeleteFAQs(faqId);
    }
  };

  const handleActiveFAQs = async (faqId, faqDisableb) => {
    try {
      // console.log(faqId, roomDisableb);
      const toggleActive = faqDisableb === 0 ? 1 : 0;
      // console.log(toggleActive);
      const res = await activeFAQ(faqId, toggleActive);
      console.log(res);
      setFAQs((prevFAQs) => {
        const updatedFAQs = prevFAQs.map((faq) => {
          if (faq.id === faqId) {
            return {
              ...faq,
              disabled: toggleActive,
            };
          }
          return faq;
        });
        return updatedFAQs;
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const renderRoom = async () => {
      try {
        if (searchQuery.trim() !== "") {
          const res = await searchFAQsAdmin(searchQuery);
          console.log(res);
          setFAQs(res.data);
        } else {
          const res = await getFAQsAdmin(currentPage, PAGE_SIZE);
          // console.log(res.total);
          setFAQs(res.data);
          setTotalPages(Math.ceil(res.total / PAGE_SIZE));
        }
      } catch (err) {
        console.log(err);
      }
    };
    renderRoom();
  }, [currentPage, searchQuery]);

  // thay đổi page trên url thì update lại data
  useEffect(() => {
    setCurrentPage(parseInt(pageNumber) || 1);
  }, [searchParams]);

  return (
    <div className="adminFAQ_page">
      <div className="adminFAQ_header">
        <h2>Manage FAQs</h2>
      </div>

      <form className="adminFAQ_search">
        <label>
          Search FAQs:
          <input
            type="text"
            placeholder="search FAQs"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </label>
        <Link to="/admin/admin-add-faq">Add FAQ</Link>
      </form>

      <div className="adminFAQ_wrap_list">
        <div className="adminFAQ_list">
          <table className="adminFAQ_table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Question</th>
                <th>Answer</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {FAQs.map((faq, id) => (
                <tr key={id}>
                  <td>{faq.id}</td>
                  <td style={{ maxWidth: "400px" }}>{faq.question}</td>
                  <td style={{ maxWidth: "400px" }}>{faq.answer}</td>
                  <td>
                    <span
                      className={
                        faq.disabled === 0
                          ? "adminFAQ_active"
                          : "adminFAQ_disabled"
                      }
                    >
                      {faq.disabled === 0 ? "Kích hoạt" : "Bị ẩn"}
                    </span>
                  </td>
                  <td className="adminFAQ_action">
                    <form action="">
                      <button
                        className="adminFAQ_action-edit"
                        onClick={(e) => {
                          navigate(`/admin/admin-edit-faq/${faq.id}`);
                        }}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                    </form>

                    <form action="">
                      <button
                        className="adminFAQ_action-delete"
                        onClick={(e) => {
                          e.preventDefault();
                          return handleConfirmDelete(faq.id);
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </form>

                    <form action="">
                      <button
                        className={
                          faq.disabled === 0
                            ? "adminFAQ_action-disabled"
                            : "adminFAQ_action-active"
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          return handleActiveFAQs(faq.id, faq.disabled);
                        }}
                      >
                        {faq.disabled === 0 ? (
                          <i className="fa-solid fa-eye-slash"></i>
                        ) : (
                          <i className="fa-solid fa-eye"></i>
                        )}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AdminPagination
          paginationData={{
            currentPage,
            totalPages,
            setCurrentPage: setCurrentPage,
          }}
        />
      </div>
    </div>
  );
};

export default AdminFAQs;
