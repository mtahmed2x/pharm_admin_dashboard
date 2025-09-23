"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { _id: 1, name: "January", users: 1000 },
  { _id: 2, name: "February", users: 500 },
  { _id: 3, name: "March", users: 650 },
  { _id: 4, name: "April", users: 250 },
  { _id: 5, name: "May", users: 450 },
  { _id: 6, name: "June", users: 1800 },
  { _id: 7, name: "July", users: 750 },
  { _id: 8, name: "August", users: 600 },
  { _id: 9, name: "September", users: 850 },
  { _id: 10, name: "October", users: 400 },
  { _id: 11, name: "November", users: 950 },
  { _id: 12, name: "December", users: 1500 },
];

const UserList = () => {
  return (
    <div className="bg-white p-4 shadow-sm rounded-xl  border-b-2 border-gray-400 text-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 mx-5">
        <h2 className="text-black font-semibold text-lg">
          User list <span className="font-normal text-gray-500">Last Year</span>
        </h2>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f2cbd6" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="users" fill="#f4a6c1" barSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserList;
