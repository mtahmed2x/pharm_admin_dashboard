// src/components/Dashboard/UserList.tsx
"use client";
import { MonthlyUserStat } from "@/types"; // Adjust path
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface UserListProps {
  monthlyStats: MonthlyUserStat[];
}

const UserList = ({ monthlyStats }: UserListProps) => {
  return (
    <div className="bg-white p-4 shadow-sm rounded-xl border-b-2 border-gray-400 text-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 mx-5">
        <h2 className="text-black font-semibold text-lg">
          User list <span className="font-normal text-gray-500">Last Year</span>
        </h2>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={monthlyStats}>
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
