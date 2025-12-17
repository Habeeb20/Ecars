// src/pages/admin/components/Overview.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const Overview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    blacklisted: 0,
    carPartSellers: 0,
    reports: 0,
    dealers: 0,
    serviceProviders: 0,
    subscriptions: 0,
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("myToken"); // or "token" — check your localStorage key

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const endpoints = [
          `${import.meta.env.VITE_BACKEND_URL}/admin/allusers`,
          `${import.meta.env.VITE_BACKEND_URL}/admin/blacklisted`,
          `${import.meta.env.VITE_BACKEND_URL}/admin/carpart-sellers`,
          `${import.meta.env.VITE_BACKEND_URL}/reports/reports`,
          `${import.meta.env.VITE_BACKEND_URL}/admin/dealers`,
          `${import.meta.env.VITE_BACKEND_URL}/admin/service-providers`,
          `${import.meta.env.VITE_BACKEND_URL}/subscriptions/all`,
        ];

        const requests = endpoints.map(url =>
          axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(err => {
            console.warn(`Failed to fetch ${url}:`, err.response?.status);
            return { data: {} }; // return empty on error
          })
        );

        const responses = await Promise.all(requests);

        // Super robust count extractor — works with ANY common structure
        const getCount = (res) => {
          const data = res.data;

          // Common patterns
          if (data.results !== undefined) return data.results;
          if (data.total !== undefined) return data.total;
          if (data.count !== undefined) return data.count;
          if (Array.isArray(data)) return data.length;
          if (data.data && Array.isArray(data.data)) return data.data.length;
          if (data.data && data.data.users && Array.isArray(data.data.users)) return data.data.users.length;
          if (data.data && data.data.reports && Array.isArray(data.data.reports)) return data.data.reports.length;
          if (data.users && Array.isArray(data.users)) return data.users.length;
          if (data.reports && Array.isArray(data.reports)) return data.reports.length;
          if (data.dealers && Array.isArray(data.dealers)) return data.dealers.length;

          return 0;
        };

        setStats({
          totalUsers: getCount(responses[0]),
          blacklisted: getCount(responses[1]),
          carPartSellers: getCount(responses[2]),
          reports: getCount(responses[3]),
          dealers: getCount(responses[4]),
          serviceProviders: getCount(responses[5]),
          subscriptions: getCount(responses[6]),
        });
      } catch (error) {
        console.error("Error in fetchStats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, color: "text-indigo-600" },
    { label: "Blacklisted Users", value: stats.blacklisted, color: "text-red-600" },
    { label: "Car Part Sellers", value: stats.carPartSellers, color: "text-purple-600" },
    { label: "Total Reports", value: stats.reports, color: "text-orange-600" },
    { label: "Dealers", value: stats.dealers, color: "text-blue-600" },
    { label: "Service Providers", value: stats.serviceProviders, color: "text-teal-600" },
    { label: "Active Subscriptions", value: stats.subscriptions, color: "text-green-600" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Admin Dashboard Overview
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-40 mb-4"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {stat.label}
              </h3>
              <p className={`text-3xl font-bold mt-3 ${stat.color}`}>
                {stat.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Overview;