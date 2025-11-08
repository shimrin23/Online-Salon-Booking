import React, { useEffect, useState } from "react";
import StylistCard from "../components/StylistCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/stylists.css"; 
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/reducers/rootSlice";
import Empty from "../components/Empty";
import axios from "axios";
import { useCallback } from "react";

const Stylists = () => {
  const [stylists, setStylists] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const fetchAllStylists = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      console.log("Fetching stylists from:", "/api/stylist/getall");
      const response = await axios.get("/api/stylist/getall");
      console.log("Stylists API response:", response);
      console.log("Stylists data:", response.data);
      
      if (Array.isArray(response.data)) {
        // Filter out any stylists without proper user data
        const validStylists = response.data.filter(stylist => 
          stylist.userId && stylist.userId.firstname && stylist.userId.lastname
        );
        console.log("Valid stylists:", validStylists);
        setStylists(validStylists);
      } else {
        console.error("Unexpected data format:", response.data);
        setStylists([]);
      }
    } catch (error) {
      console.error("Error fetching stylists:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      setStylists([]);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAllStylists();
  }, [fetchAllStylists]);

  return (
    <>
      <Navbar />
      {loading && <Loading />}
      {!loading && (
        <section className="container stylists">
          <h2 className="page-heading">Our Stylists</h2>
          {stylists.length > 0 ? (
            <div className="stylists-card-container">
              {stylists.map((ele) => (
                <StylistCard ele={ele} key={ele._id} />
              ))}
            </div>
          ) : (
            <Empty />
          )}
        </section>
      )}
      <Footer />
    </>
  );
};

export default Stylists;
