import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AdminPagination from "../../features/AdminPagination/AdminPagination";
import {
  activeService,
  deleteService,
  getServicesAdmin,
  searchServicesAdmin,
} from "../../services/adminService";
import "./AdminService.css";

const PAGE_SIZE = 5;

const AdminService = () => {
  const admin_id = localStorage.getItem("info-admin")
    ? JSON.parse(localStorage.getItem("info-admin")).id
    : "";
  const [searchParams] = useSearchParams();
  const pageNumber = searchParams.get("page");
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  console.log(services);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber) || 1);
  const [totalPages, setTotalPages] = useState(0);

  const newUrl = `${window.location.pathname}?page=${currentPage}`;
  window.history.pushState(null, null, newUrl);

  const handleDelelteService = async (serviceId) => {
    try {
      console.log(serviceId);
      const res = await deleteService(serviceId, admin_id);
      console.log(res);
      setServices((prevServices) =>
        prevServices.filter((service) => service.id !== serviceId)
      );
    } catch (err) {
      console.log(err);
      alert(err.response.data.error || "DELETE error");
    }
  };
  const handleConfirmDelete = (serviceId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa dòng không?")) {
      handleDelelteService(serviceId);
    }
  };

  const handleActiveService = async (serviceId, serviceDisableb) => {
    try {
      // console.log(serviceId, serviceDisableb);
      const toggleActive = serviceDisableb === 0 ? 1 : 0;
      // console.log(toggleActive);
      const res = await activeService(serviceId, toggleActive, admin_id);
      console.log(res);
      setServices((prevServices) => {
        const updatedServices = prevServices.map((service) => {
          if (service.id === serviceId) {
            return {
              ...service,
              disabled: toggleActive,
            };
          }
          return service;
        });
        return updatedServices;
      });
    } catch (err) {
      console.log(err);
      alert(err.response.data.error || "ACTIVE error");
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const renderServices = async () => {
      try {
        if (searchQuery.trim() !== "") {
          const res = await searchServicesAdmin(searchQuery);
          console.log(res);
          setServices(res.data);
        } else {
          const res = await getServicesAdmin(currentPage, PAGE_SIZE);
          // console.log(res.total);
          setServices(res.data);
          setTotalPages(Math.ceil(res.total / PAGE_SIZE));
        }
      } catch (err) {
        console.log(err);
      }
    };
    renderServices();
  }, [currentPage, searchQuery]);

  // thay đổi page trên url thì update lại data
  useEffect(() => {
    setCurrentPage(parseInt(pageNumber) || 1);
  }, [searchParams]);

  return (
    <div className="adminService_page">
      <div className="adminService_header">
        <h2>Manage Service</h2>
      </div>

      <form className="adminService_search">
        <label>
          Search Service:
          <input
            type="text"
            placeholder="search name"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </label>
        <Link to={"/admin/admin-add-service"}>Add Service</Link>
      </form>

      <div className="adminService_wrap_list">
        <div className="adminService_list">
          <table className="adminService_table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Opening Time</th>
                <th>Closing Time</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {services.map((service, id) => {
                return (
                  <tr key={service.id}>
                    <td>{service.id}</td>
                    <td>{service.name}</td>
                    <td>{service.opening_time}</td>
                    <td>{service.closing_time}</td>
                    <td style={{ maxWidth: "400px" }}>{service.description}</td>
                    <td style={{ maxWidth: "200px" }}>
                      <span
                        className={
                          service.disabled === 0
                            ? "adminService_active"
                            : "adminService_disabled"
                        }
                      >
                        {service.disabled === 0 ? "Kích hoạt" : "Bị ẩn"}
                      </span>
                    </td>
                    <td className="adminService_action">
                      <form action="">
                        <button
                          className="adminService_action-edit"
                          onClick={(e) => {
                            navigate(`/admin/admin-edit-service/${service.id}`);
                          }}
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                      </form>

                      <form action="">
                        <button
                          className="adminService_action-delete"
                          onClick={(e) => {
                            e.preventDefault();
                            return handleConfirmDelete(service.id);
                          }}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </form>

                      <form action="">
                        <button
                          className={
                            service.disabled === 0
                              ? "adminRoom_action-disabled"
                              : "adminRoom_action-active"
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            return handleActiveService(
                              service.id,
                              service.disabled
                            );
                          }}
                        >
                          {service.disabled === 0 ? (
                            <i className="fa-solid fa-eye-slash"></i>
                          ) : (
                            <i className="fa-solid fa-eye"></i>
                          )}
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
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

export default AdminService;
