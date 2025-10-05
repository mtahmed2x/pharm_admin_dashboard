"use client";

import { useToggleUserStatusMutation } from "@/api/dashboardApi";
import { User } from "@/types"; // Adjust path if types are in dashboardTypes.ts
import Image from "next/image";
// Adjust path
import toast from "react-hot-toast";

interface UserTableProps {
  users: User[];
  // If you want to refetch all dashboard data after status change,
  // you might pass a refetch function or invalidate tags in RTK Query
}

const UserTable = ({ users }: UserTableProps) => {
  const [toggleUserStatus, { isLoading: isTogglingStatus }] =
    useToggleUserStatusMutation();

  // Handle toggling status via API
  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      // Map frontend boolean status to backend string status
      const newBackendStatus = currentStatus ? "inactive" : "active";
      const response = await toggleUserStatus({
        id,
        status: !currentStatus, // Send the new status (opposite of current)
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "User status updated successfully!");
        // RTK Query's cache invalidation (if configured with 'invalidatesTags')
        // would automatically refetch the dashboard data here.
        // If not, you might manually trigger a refetch of getDashboardData.
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

  return (
    <div className="p-6 bg-white shadow-md rounded-xl text-gray-800 my-16 border-b-2 border-gray-400 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">User List</h2>
      {users.length === 0 ? (
        <p className="text-center text-gray-600">No users to display.</p>
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
                      user.avatar ||
                      "https://i.postimg.cc/4xLZjmW2/dfb6892164e638fc869bc424d651235a519c6d80.png"
                    }
                    alt={user.firstName}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                    quality={100}
                  />
                </td>
                <td className="p-2 border border-pink-200">{user.firstName}</td>
                <td className="p-2 border border-pink-200">{user.email}</td>
                <td className="p-2 border border-pink-200">
                  <div className="w-full flex gap-5  justify-center items-center px-4 py-2">
                    <span>{user.status ? "Active" : "Inactive"}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={user.status === "active"}
                        onChange={() =>
                          handleToggle(user._id, user.status === "active")
                        }
                        disabled={isTogglingStatus} // Disable toggle while status is being updated
                      />
                      <div
                        className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-pink-300 ${
                          user.status ? "bg-pink-400" : ""
                        }`}
                      ></div>
                      <div
                        className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
                          user.status ? "translate-x-5" : ""
                        }`}
                      ></div>
                    </label>
                  </div>
                </td>
                <td className="p-2 border border-pink-200">
                  <button className="px-3 py-1 bg-transparent hover:bg-pink-400 text-gray-700 hover:text-white rounded border border-pink-400">
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserTable;
