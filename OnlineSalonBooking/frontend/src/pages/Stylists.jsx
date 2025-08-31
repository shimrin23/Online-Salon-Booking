import React, { useEffect, useState } from "react";
import StylistCard from "../components/StylistCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/stylists.css"; 
import fetchData from "../helper/apiCall";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/reducers/rootSlice";
import Empty from "../components/Empty";
import axios from "axios";

const Stylists = () => {
  const [stylists, setStylists] = useState([]);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const fetchAllStylists = async () => {
    dispatch(setLoading(true));
    try {
      const data = await fetchData(`/stylist/getall`);
      setStylists(data);
    } catch (error) {
      console.error("Error fetching stylists:", error);
      // If it's an auth error, try without auth
      try {
        const response = await axios.get("/api/stylist/getall");
        setStylists(response.data);
      } catch (secondError) {
        console.error("Second error:", secondError);
        setStylists([]);
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAllStylists();
  }, []);

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
