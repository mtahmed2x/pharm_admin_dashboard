"use client";

import { UserTableData } from "@/types/dashboardTypes";
import Image from "next/image";
import { useState } from "react";
import userData from "../../../public/users.json";

const UserTable = () => {
  const [users, setUsers] = useState<UserTableData[]>(userData);

  // Toggle status per user
  const handleToggle = (id: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === id ? { ...user, status: !user.status } : user
      )
    );
  };

  return (
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
                <button className="px-3 py-1 bg-transparent hover:bg-pink-400 text-gray-700 hover:text-white rounded border border-pink-400">
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
