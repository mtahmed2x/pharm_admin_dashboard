"use client";

import UserList from "@/components/Dashboard/UserList";
import { UserCheck, UserPlus, Users, UserX } from "lucide-react";
import toast from "react-hot-toast";
import { User } from "@/types";
import ActiveUser from "@/components/Dashboard/ActiveUser";
import { useGetDashboardDataQuery } from "@/api/dashboardApi";

const Dashboard = () => {
  const {
    data: dashboardResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetDashboardDataQuery();

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-pink-400">
        Loading Dashboard...
      </div>
    );
  }

  if (isError) {
    console.error("Dashboard data fetch error:", error);
    toast.error(
      (error as any)?.data?.message ||
        "Failed to load dashboard data. Please try again."
    );
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
        <p className="text-xl mb-4">Error loading dashboard data.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-pink-400 text-white rounded hover:bg-pink-500"
        >
          Retry
        </button>
      </div>
    );
  }

  // Ensure data exists and is successful
  if (!dashboardResponse || !dashboardResponse.success) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p className="text-xl">No dashboard data available.</p>
      </div>
    );
  }

  const { stats, monthlyStat, users } = dashboardResponse.data;

  // Map API User to UserTableData for the table component
  const userTableData: User[] = users.map((user) => ({
    _id: user._id,
    email: user.email,
    role: user.role,
    verified: user.verified,
    firstName: user.firstName,
    surname: user.surname,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    sex: user.sex,
    postcode: user.postcode,
    contraception: user.contraception,
    nhs: user.nhs,
    // image: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`, // Placeholder image for now
    name: `${user.firstName} ${user.surname || ""}`.trim(),
    phone: "N/A", // Your API doesn't provide phone, so using a placeholder
    status: user.status, // Assuming 'verified' from API maps to 'status' in frontend
  }));

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
        {/* Total Users */}
        <div className="bg-white hover:bg-pink-200 rounded-xl shadow-md p-6 flex items-center gap-4 border-b-2 border-gray-400 group">
          <div className="p-4 bg-blue-50 rounded-full">
            <Users className="text-blue-600 w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-600 text-md font-medium">Total Users</p>
            <h2 className="text-2xl font-bold text-pink-400 group-hover:text-white">
              {stats.totalUsers.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white hover:bg-pink-200 rounded-xl shadow-md p-6 flex items-center gap-4 border-b-2 border-gray-400 group">
          <div className="p-4 bg-green-50 rounded-full">
            <UserCheck className="text-green-600 w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-600 text-md font-medium">Active Users</p>
            <h2 className="text-2xl font-bold text-pink-400 group-hover:text-white">
              {stats.activeUsers.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* New Request */}
        <div className="bg-white hover:bg-pink-200 rounded-xl shadow-md p-6 flex items-center gap-4 border-b-2 border-gray-400 group">
          <div className="p-4 bg-yellow-50 rounded-full">
            <UserPlus className="text-yellow-600 w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-600 text-md font-medium">New Requests</p>
            <h2 className="text-2xl font-bold text-pink-400 group-hover:text-white">
              {stats.newRequests.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Incomplete Users */}
        <div className="bg-white hover:bg-pink-200 rounded-xl shadow-md p-6 flex items-center gap-4 border-b-2 border-gray-400 group">
          <div className="p-4 bg-red-50 rounded-full">
            <UserX className="text-red-600 w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-600 text-md font-medium">
              Incomplete Users
            </p>
            <h2 className="text-2xl font-bold text-pink-400 group-hover:text-white">
              {stats.incompleteUsers.toLocaleString()}
            </h2>
          </div>
        </div>
      </div>
      <UserList monthlyStats={monthlyStat} />
      <ActiveUser users={userTableData} />{" "}
    </div>
  );
};

export default Dashboard;
