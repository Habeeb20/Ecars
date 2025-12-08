// src/pages/admin/components/Overview.jsx
const Overview = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Admin Dashboard Overview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Cards */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-3xl font-bold text-indigo-600">1,234</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-500 text-sm">Active Listings</h3>
          <p className="text-3xl font-bold text-green-600">892</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-500 text-sm">Dealers</h3>
          <p className="text-3xl font-bold text-blue-600">89</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-500 text-sm">Revenue (Month)</h3>
          <p className="text-3xl font-bold text-red-600">₦2.4M</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;