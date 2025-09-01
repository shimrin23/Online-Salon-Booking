import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";
import { setLoading } from "../redux/reducers/rootSlice";
import { useDispatch, useSelector } from "react-redux";
import Empty from "./Empty";
import fetchData from "../helper/apiCall";

// API base URL is set in apiCall.js

const Users = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const getAllUsers = async () => {
    try {
      dispatch(setLoading(true));
      const temp = await fetchData(`/api/user/getall`); // Fixed: Added /api prefix
      setUsers(temp);
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const deleteUser = async (userId) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete?");
      if (confirm) {
        await toast.promise(
          axios.delete("/api/user/delete", { // Fixed: Added /api prefix
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
    try {
      const isPromoting = !currentAdminStatus;
      const actionText = isPromoting ? "promote" : "demote";
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
      const isPromoting = !currentAdminStatus;
      const actionText = isPromoting ? "promote" : "demote";
      toast.error(`Error ${actionText}ing user`);
      console.error(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
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
                    <th>Is Stylist</th>
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
                        <td>{ele?.isStylist ? "Yes" : "No"}</td>
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
      )}
    </>
  );
};

export default Users;
