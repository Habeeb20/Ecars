// pages/dashboard/Overview.jsx
import { useAuth } from "../../contexts/AuthContext"



import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Legend as PieLegend } from 'recharts';
import { LineChart, Line, XAxis as LineXAxis, YAxis as LineYAxis, CartesianGrid as LineGrid, Tooltip as LineTooltip, Legend as LineLegend } from 'recharts';

// Dummy Data
const salesData = [
  { month: 'Jan', sales: 120, rentals: 80 },
  { month: 'Feb', sales: 150, rentals: 100 },
  { month: 'Mar', sales: 180, rentals: 120 },
  { month: 'Apr', sales: 200, rentals: 140 },
  { month: 'May', sales: 220, rentals: 160 },
  { month: 'Jun', sales: 250, rentals: 180 },
  { month: 'Jul', sales: 280, rentals: 200 },
  { month: 'Aug', sales: 300, rentals: 220 },
  { month: 'Sep', sales: 320, rentals: 240 },
  { month: 'Oct', sales: 350, rentals: 260 },
  { month: 'Nov', sales: 380, rentals: 280 },
  { month: 'Dec', sales: 400, rentals: 300 },
];

const carTypeData = [
  { name: 'Sedan', value: 400, color: '#0088FE' },
  { name: 'SUV', value: 300, color: '#00C49F' },
  { name: 'Truck', value: 200, color: '#FFBB28' },
  { name: 'Sports', value: 100, color: '#FF8042' },
  { name: 'Electric', value: 150, color: '#A28EFF' },
];

const dealerPerformanceData = [
  { dealer: 'Dealer A', sales: 500, rentals: 300 },
  { dealer: 'Dealer B', sales: 400, rentals: 250 },
  { dealer: 'Dealer C', sales: 350, rentals: 200 },
  { dealer: 'Dealer D', sales: 300, rentals: 180 },
  { dealer: 'Dealer E', sales: 250, rentals: 150 },
];

const userEngagementData = [
  { day: 'Mon', buys: 50, rents: 30, views: 200 },
  { day: 'Tue', buys: 60, rents: 40, views: 220 },
  { day: 'Wed', buys: 70, rents: 50, views: 240 },
  { day: 'Thu', buys: 80, rents: 60, views: 260 },
  { day: 'Fri', buys: 90, rents: 70, views: 280 },
  { day: 'Sat', buys: 100, rents: 80, views: 300 },
  { day: 'Sun', buys: 110, rents: 90, views: 320 },
];

const Overview= () => {
  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-7xl mx-auto">
   <h1 className="text-2xl font-bold  bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Welcome back, {useAuth().user?.firstName}!</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales vs Rentals Trend */}
          <div className=" rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold mb-4   bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Sales vs Rentals Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <LineGrid strokeDasharray="3 3" />
                <LineXAxis dataKey="month" stroke="#888" />
                <LineYAxis stroke="#888" />
                <LineTooltip />
                <LineLegend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="rentals" stroke="#82ca9d" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Car Type Distribution */}
          <div className="rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold mb-4  bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Car Type Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={carTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {carTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <PieLegend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Dealer Performance */}
          <div className="rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold mb-4   bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dealer Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dealerPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dealer" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" barSize={40} radius={[4, 4, 0, 0]} />
                <Bar dataKey="rentals" fill="#82ca9d" barSize={40} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* User Engagement */}
          <div className=" rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold mb-4   bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">User Engagement Weekly</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userEngagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Legend />
                <Bar dataKey="buys" fill="#FF8042" barSize={30} radius={[4, 4, 0, 0]} />
                <Bar dataKey="rents" fill="#00C49F" barSize={30} radius={[4, 4, 0, 0]} />
                <Bar dataKey="views" fill="#0088FE" barSize={30} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overview;