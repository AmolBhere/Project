import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const lastUserRef = useRef();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios.get(`http://localhost:7000/getContacts?page=${page}&limit=${limit}`)
      .then(response => {
        if (response.data.length === 0) {
          setHasMore(false);
        } else {
          setUsers(prevUsers => [...prevUsers, ...response.data]);
          setPage(prevPage => prevPage + 1);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  };
  
  const handleIntersection = (entries) => {
    const target = entries[0];
    if (target.isIntersecting && !loading && hasMore) {
      fetchData();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    if (lastUserRef.current) {
      observer.observe(lastUserRef.current);
    }

    return () => {
      if (lastUserRef.current) {
        observer.unobserve(lastUserRef.current);
      }
    };
  }, [loading, hasMore]);

  return (
    <div>
      <h1>Infinite Scrolling React App</h1>
      <ul>
        {users.map((user, index) => (
          <li key={index} ref={index === users.length - 1 ? lastUserRef : null}>
            <img src="/hulk.jpg" alt="Profile" className="profile-image" />
            <div>
              <p>Name: {user.name}</p>
              <p>Phone Number: {user.phone_number}</p>
            </div>
          </li>
        ))}
      </ul>
      {loading && <p>Loading...</p>}
      {!loading && !hasMore && <p>No more users</p>}
    </div>
  );
}

export default App;
