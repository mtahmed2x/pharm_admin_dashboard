"use client";

import { UserTableData } from "@/types/dashboardTypes";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {
  const [users, setUsers] = useState<UserTableData[]>([]);

  useEffect(() => {
    fetch("/users.json")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  // Toggle status per user
  const handleToggle = (id: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === id ? { ...user, status: !user.status } : user
      )
    );
  };

  return (
    <div className="text-gray-800 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 text-pink-500">
        <User className="w-8 h-8" />
        <h1 className="text-2xl font-bold">Users</h1>
      </div>

      {/* Stats Filters */}
      <div className="bg-white px-6 py-5 rounded-xl border border-gray-200 grid grid-cols-2 lg:grid-cols-4 gap-6 shadow-sm">
        <button className="hover:bg-pink-300 hover:text-white px-4 py-3 rounded-xl text-center font-medium transition">
          All Users <span className="text-sm text-gray-500">(32)</span>
        </button>
        <button className="hover:bg-pink-300 hover:text-white px-4 py-3 rounded-xl text-center font-medium transition">
          Request Users <span className="text-sm text-gray-500">(32)</span>
        </button>
        <button className="hover:bg-pink-300 hover:text-white px-4 py-3 rounded-xl text-center font-medium transition">
          Active Projects <span className="text-sm text-gray-500">(296)</span>
        </button>
        <button className="hover:bg-pink-300 hover:text-white px-4 py-3 rounded-xl text-center font-medium transition">
          Incomplete Users <span className="text-sm text-gray-500">(48)</span>
        </button>
      </div>

      {/* User Table */}
      <div className="p-6 bg-white shadow-md rounded-xl text-gray-800 my-16 border-b-2 border-gray-400 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">User List</h2>
        <table className="w-full border border-pink-200 rounded-2xl">
          <thead>
            <tr className="bg-fuchsia-100">
              <th className="p-2 border border-pink-200">ID</th>
              <th className="p-2 border border-pink-200">Image</th>
              <th className="p-2 border border-pink-200">Name</th>
              <th className="p-2 border border-pink-200">Email</th>
              <th className="p-2 border border-pink-200">Phone</th>
              <th className="p-2 border border-pink-200">Status</th>
              <th className="p-2 border border-pink-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="p-2 border border-pink-200">{user._id}</td>
                <td className="p-1 border border-pink-200 flex justify-center">
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                    quality={100}
                  />
                </td>
                <td className="p-2 border border-pink-200">{user.name}</td>
                <td className="p-2 border border-pink-200">{user.email}</td>
                <td className="p-2 border border-pink-200">{user.phone}</td>
                <td className="p-2 border border-pink-200">
                  <div className="w-full flex gap-5  justify-center items-center px-4 py-2">
                    <span>{user.status ? "Active" : "Inactive"}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={user.status}
                        onChange={() => handleToggle(user._id)}
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
      </div>
    </div>
  );
};

export default Page;
