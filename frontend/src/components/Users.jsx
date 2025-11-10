import React, { useState, useEffect } from "react";
import axios from "axios";
import fetchData from "../helper/apiCall";
import toast from "react-hot-toast";
import Empty from "./Empty";

// API base URL is set in apiCall.js

const Users = () => {
  const [users, setUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const temp = await fetchData(`/api/users/getall`); // Fixed: Changed from /api/user/getall to /api/users/getall
      setUsers(temp);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      // dispatch(setLoading(false)); // Removed loading effect
    }
  };

  const deleteUser = async (userId) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete?");
      if (confirm) {
        await toast.promise(
          axios.delete("/api/users/delete", { // Fixed: Changed from /api/user/delete to /api/users/delete
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            data: { userId },
          }),
          {
            pending: "Deleting user...",
            success: "User deleted successfully",
            error: "Unable to delete user",
          }
        );
        getAllUsers();
      }
    } catch (error) {
      toast.error("Error deleting user");
      console.error(error);
    }
  };

  // Add new function for admin management
  const toggleAdminStatus = async (userId, currentAdminStatus) => {
    // Move these variables outside the try block so they're accessible in catch
    const isPromoting = !currentAdminStatus;
    const actionText = isPromoting ? "promote" : "demote";
    
    try {
      const confirmMessage = `Are you sure you want to ${actionText} this user ${isPromoting ? "to admin" : "from admin"}?`;
      
      const confirm = window.confirm(confirmMessage);
      
      if (confirm) {
        await toast.promise(
          axios.put(
            "/api/users/toggleAdmin",
            { userId, isAdmin: !currentAdminStatus },
            {
              headers: {
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          ),
          {
            pending: `${isPromoting ? "Promoting" : "Demoting"} user...`,
            success: `User ${isPromoting ? "promoted to admin" : "demoted from admin"} successfully`,
            error: `Unable to ${actionText} user`,
          }
        );
        getAllUsers(); // Refresh the user list
      }
    } catch (error) {
      toast.error(`Error ${actionText}ing user`);
      console.error(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      {/* {loading ? ( // Removed loading effect
        <Loading />
      ) : ( */}
        <section className="user-section">
          <h3 className="home-sub-heading">All Users</h3>
          {users.length > 0 ? (
            <div className="user-container">
              <table>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Pic</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Mobile No.</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Admin Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((ele, i) => {
                    return (
                      <tr key={ele?._id}>
                        <td>{i + 1}</td>
                        <td>
                          <img
                            className="user-table-pic"
                            src={ele?.pic}
                            alt={ele?.firstname}
                          />
                        </td>
                        <td>{ele?.firstname}</td>
                        <td>{ele?.lastname}</td>
                        <td>{ele?.email}</td>
                        <td>{ele?.mobile}</td>
                        <td>{ele?.age}</td>
                        <td>{ele?.gender}</td>
                        <td>
                          <span className={`admin-status ${ele?.isAdmin ? "admin" : "user"}`}>
                            {ele?.isAdmin ? "Admin" : "User"}
                          </span>
                        </td>
                        <td className="select">
                          <button
                            className="btn user-btn"
                            onClick={() => {
                              deleteUser(ele?._id);
                            }}
                          >
                            Remove
                          </button>
                          <button
                            className={`btn ${ele?.isAdmin ? "demote-btn" : "promote-btn"}`}
                            onClick={() => toggleAdminStatus(ele?._id, ele?.isAdmin)}
                          >
                            {ele?.isAdmin ? "Demote" : "Promote"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
        </section>
      {/* )} */}
    </>
  );
};

export default Users;
