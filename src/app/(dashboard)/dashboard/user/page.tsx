"use client";

import { useGetAllUserQuery, useToggleUserStatusMutation } from "@/api/userApi"; // Use 'userApi' for getAllUser
import { User as UserIcon } from "lucide-react"; // Renamed User import to UserIcon
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

// Define the component
const UsersPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(15); // Fixed limit to 15 per page

  // Fetch paginated user data
  const {
    data: usersResponse,
    isLoading,
    isFetching, // use isFetching for loading indicator on pagination/refetch
    isError,
    error,
    refetch,
  } = useGetAllUserQuery({ page, limit });

  const [toggleUserStatus, { isLoading: isTogglingStatus }] =
    useToggleUserStatusMutation();

  const handleToggle = async (id: string, currentBlockedStatus: boolean) => {
    try {
      const response = await toggleUserStatus({
        id,
        blocked: !currentBlockedStatus,
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "User status updated successfully!");
        // RTK Query's cache invalidation should handle refetching/UI update
      } else {
        toast.error(response.message || "Failed to update user status.");
      }
    } catch (err: any) {
      console.error("Failed to toggle user status:", err);
      toast.error(
        err.data?.message || "An error occurred while updating status."
      );
    }
  };

  const users = usersResponse?.data || [];
  const meta = usersResponse?.meta;
  const totalPage = meta?.totalPage || 1;

  // --- Render Loading/Error States ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-pink-400">
        Loading Users...
      </div>
    );
  }

  if (isError) {
    console.error("User data fetch error:", error);
    toast.error(
      (error as any)?.data?.message ||
        "Failed to load user data. Please try again."
    );
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
        <p className="text-xl mb-4">Error loading user data.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-pink-400 text-white rounded hover:bg-pink-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="text-gray-800 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 text-pink-500">
        <UserIcon className="w-8 h-8" />
        <h1 className="text-2xl font-bold">Users</h1>
      </div>

      {/* User Table */}
      <div className="p-6 bg-white shadow-md rounded-xl text-gray-800 my-16 border-b-2 border-gray-400 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">User List</h2>
          {isFetching && (
            <span className="text-pink-400 text-sm">Updating...</span>
          )}
        </div>

        {users.length === 0 ? (
          <p className="text-center text-gray-600 py-4">No users found.</p>
        ) : (
          <table className="w-full border border-pink-200 rounded-2xl">
            <thead>
              <tr className="bg-fuchsia-100">
                <th className="p-2 border border-pink-200">Image</th>
                <th className="p-2 border border-pink-200">Name</th>
                <th className="p-2 border border-pink-200">Email</th>
                <th className="p-2 border border-pink-200">Status</th>
                <th className="p-2 border border-pink-200">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="text-center">
                  <td className="p-1 border border-pink-200 flex justify-center">
                    <Image
                      src={
                        user.avatar || // Use the 'avatar' property from the User type
                        "https://i.postimg.cc/4xLZjmW2/dfb6892164e638fc869bc424d651235a519c6d80.png"
                      }
                      alt={user.firstName} // Use firstName since 'name' is derived
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                      quality={100}
                    />
                  </td>
                  <td className="p-2 border border-pink-200">
                    {`${user.firstName} ${user.surname || ""}`.trim()}
                  </td>
                  <td className="p-2 border border-pink-200">{user.email}</td>
                  {/* Removed Phone column as it wasn't consistently available in the User type from previous context */}

                  {/* Block/Unblock Status Column */}
                  <td className="p-2 border border-pink-200">
                    <div className="w-full flex gap-5  justify-center items-center px-4 py-2">
                      <span>{user.blocked ? "Unblock" : "Block"}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={user.blocked} // Checked if currently blocked
                          onChange={() => handleToggle(user._id, user.blocked)}
                          disabled={isTogglingStatus}
                        />
                        {/* Toggle switch with Red (default/block) and Green (checked/unblock) style */}
                        <div className="w-11 h-6 bg-red-500 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-pink-300 peer-checked:bg-green-500"></div>
                        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
                      </label>
                    </div>
                  </td>

                  <td className="p-2 border border-pink-200">
                    <Link
                      href={`/dashboard/user/${user._id}`}
                      className="px-3 py-1 bg-transparent hover:bg-pink-400 text-gray-700 hover:text-white rounded border border-pink-400"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination Controls */}
        {totalPage > 1 && (
          <div className="flex justify-end items-center mt-6 space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isFetching}
              className="px-4 py-2 text-sm font-medium text-pink-700 bg-pink-100 rounded-lg hover:bg-pink-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-700 text-sm">
              Page {page} of {totalPage}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
              disabled={page === totalPage || isFetching}
              className="px-4 py-2 text-sm font-medium text-pink-700 bg-pink-100 rounded-lg hover:bg-pink-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
