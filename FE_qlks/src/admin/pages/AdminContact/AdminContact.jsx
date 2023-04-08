import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AdminPagination from "../../features/AdminPagination/AdminPagination";
import {
  deleteContact,
  //   deleteContact,
  getContactAdmin,
  searchContactAdmin,
  //   searchContactAdmin,
} from "../../services/adminService";
import "./AdminContact.css";

const PAGE_SIZE = 5;

const AdminContact = () => {
  const [searchParams] = useSearchParams();
  const pageNumber = searchParams.get("page");
  const navigate = useNavigate();
  const [contact, setContacts] = useState([]);
  console.log(contact);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber) || 1);
  const [totalPages, setTotalPages] = useState(0);

  const newUrl = `${window.location.pathname}?page=${currentPage}`;
  window.history.pushState(null, null, newUrl);

  const handleDeleteContact = async (contactId) => {
    try {
      console.log(contactId);
      const res = await deleteContact(contactId);
      console.log(res);
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact.id !== contactId)
      );
    } catch (err) {
      console.log(err);
    }
  };
  const handleConfirmDelete = (contactId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa liên hệ này không?")) {
      handleDeleteContact(contactId);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const renderContact = async () => {
      try {
        if (searchQuery.trim() !== "") {
          const res = await searchContactAdmin(searchQuery);
          console.log(res);
          setContacts(res.data);
        } else {
          const res = await getContactAdmin(currentPage, PAGE_SIZE);
          // console.log(res.total);
          setContacts(res.data);
          setTotalPages(Math.ceil(res.total / PAGE_SIZE));
        }
      } catch (err) {
        console.log(err);
      }
    };
    renderContact();
  }, [currentPage, searchQuery]);

  // thay đổi page trên url thì update lại data
  useEffect(() => {
    setCurrentPage(parseInt(pageNumber) || 1);
  }, [searchParams]);

  return (
    <div className="adminContact_page">
      <div className="adminContact_header">
        <h2>List Contact Customer</h2>
      </div>

      <form className="adminContact_search">
        <label>
          Search name:
          <input
            type="text"
            placeholder="search name"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </label>
      </form>

      <div className="adminContact_wrap_list">
        <div className="adminContact_list">
          <table className="adminContact_table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {contact.map((contact, id) => (
                <tr key={id}>
                  <td>{contact.id}</td>
                  <td style={{ maxWidth: "400px" }}>{contact.name}</td>
                  <td style={{ maxWidth: "400px" }}>{contact.email}</td>
                  <td style={{ maxWidth: "400px" }}>{contact.phone}</td>
                  <td style={{ maxWidth: "400px" }}>{contact.message}</td>
                  <td className="adminContact_action">
                    <form action="">
                      <button
                        className="adminContact_action-delete"
                        onClick={(e) => {
                          e.preventDefault();
                          return handleConfirmDelete(contact.id);
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
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

export default AdminContact;
