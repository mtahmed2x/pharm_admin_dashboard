"use client";
import { useToggleUserStatusMutation } from "@/api/dashboardApi";
import { User } from "@/types";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

interface UserTableProps {
  users: User[];
}

const UserTable = ({ users }: UserTableProps) => {
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
                    <span>{user.blocked ? "Unblock" : "Block"}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      {/* The hidden checkbox that holds the actual state */}
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={user.blocked}
                        onChange={() => handleToggle(user._id, user.blocked)}
                        disabled={isTogglingStatus}
                      />
                      {/* The background track of the toggle */}
                      {/* Default state (to block) is red */}
                      {/* Checked state (to unblock) is green */}
                      <div className="w-11 h-6 bg-red-500 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-pink-300 peer-checked:bg-green-500"></div>
                      {/* The moving dot/handle */}
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
                    </label>
                  </div>
                </td>
                <td className="p-2 border border-pink-200">
                  <Link
                    href={`/dashboard/user/${user._id}`}
                    className="px-3 py-1 bg-transparent hover:bg-pink-400 text-gray-700 hover:text-white rounded border border-pink-400 transition-colors"
                  >
                    Details
                  </Link>
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
