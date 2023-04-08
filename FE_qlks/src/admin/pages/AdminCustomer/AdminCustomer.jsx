import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdminPagination from "../../features/AdminPagination/AdminPagination";
import {
  activeCustomer,
  deleteCustomer,
  getCustomersAdmin,
  searchCustomersAdmin,
} from "../../services/adminService";
import "./AdminCustomer.css";

const PAGE_SIZE = 5;

const AdminCustomer = () => {
  const [searchParams] = useSearchParams();
  const pageNumber = searchParams.get("page");
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  console.log(customers);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber) || 1);
  const [totalPages, setTotalPages] = useState(0);

  const newUrl = `${window.location.pathname}?page=${currentPage}`;
  window.history.pushState(null, null, newUrl);

  const handleDeleteCustomer = async (customerId) => {
    try {
      console.log(customerId);
      const res = await deleteCustomer(customerId);
      console.log(res);
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.id !== customerId)
      );
    } catch (err) {
      console.log(err);
    }
  };
  const handleConfirmDelete = (customerId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người này không?")) {
      handleDeleteCustomer(customerId);
    }
  };

  const handleActiveCustomer = async (customerId, customerDisableb) => {
    try {
      // console.log(roomId, roomDisableb);
      const toggleActive = customerDisableb === 0 ? 1 : 0;
      // console.log(toggleActive);
      const res = await activeCustomer(customerId, toggleActive);
      console.log(res);
      setCustomers((prevCustomers) => {
        const updatedCustomers = prevCustomers.map((customer) => {
          if (customer.id === customerId) {
            return {
              ...customer,
              disabled: toggleActive,
            };
          }
          return customer;
        });
        return updatedCustomers;
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
          const res = await searchCustomersAdmin(searchQuery);
          console.log(res);
          setCustomers(res.data);
        } else {
          const res = await getCustomersAdmin(currentPage, PAGE_SIZE);
          // console.log(res.total);
          setCustomers(res.data);
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
    <div className="adminCustomer_page">
      <div className="adminCustomer_header">
        <h2>Manage Customer</h2>
      </div>

      <form className="adminCustomer_search">
        <label>
          Search Customer:
          <input
            type="text"
            placeholder="search customer"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </label>
      </form>

      <div className="adminCustomer_wrap_list">
        <div className="adminCustomer_list">
          <table className="adminCustomer_table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer, id) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>
                    <span
                      className={
                        customer.disabled === 0
                          ? "adminCustomer_active"
                          : "adminCustomer_disabled"
                      }
                    >
                      {customer.disabled === 0 ? "Kích hoạt" : "Bị khóa"}
                    </span>
                  </td>
                  <td className="adminCustomer_action">
                    <form action="">
                      <button
                        className="adminCustomer_action-edit"
                        onClick={(e) => {
                          navigate(`/admin/admin-edit-customer/${customer.id}`);
                        }}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                    </form>

                    <form action="">
                      <button
                        className="adminCustomer_action-delete"
                        onClick={(e) => {
                          e.preventDefault();
                          return handleConfirmDelete(customer.id);
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </form>

                    <form action="">
                      <button
                        className={
                          customer.disabled === 0
                            ? "adminCustomer_action-disabled"
                            : "adminCustomer_action-active"
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          return handleActiveCustomer(
                            customer.id,
                            customer.disabled
                          );
                        }}
                      >
                        {customer.disabled === 0 ? (
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
            newUrl,
            setCurrentPage: setCurrentPage,
          }}
        />
      </div>
    </div>
  );
};

export default AdminCustomer;
