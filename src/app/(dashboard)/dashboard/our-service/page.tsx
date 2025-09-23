"use client";

import { ServiceData } from "@/types/dashboardTypes";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const OurService = () => {
  const [users, setUsers] = useState<ServiceData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("POP"); // default tab

  useEffect(() => {
    fetch("/service.json")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // API call for delete (replace with your API)
        const res = await axios.delete(`/api/users/${id}`);
        if (res.data.deletedCount > 0) {
          setUsers(users.filter((u) => u._id !== id)); // remove from UI
          toast.success("User has been deleted!");
          Swal.fire("Deleted!", "The user has been deleted.", "success");
        }
      }
    });
  };

  // Filtered users based on active tab (serviceType)
  const filteredUsers = users.filter((user) => user.serviceType === activeTab);

  return (
    <div>
      {/* Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <div
          onClick={() => setActiveTab("POP")}
          className={`cursor-pointer rounded-xl shadow-md p-6 border-b-2 border-gray-400 group transition-all duration-300 ${
            activeTab === "POP"
              ? "bg-pink-300 text-white"
              : "bg-white hover:bg-pink-200"
          }`}
        >
          <p
            className={`text-md font-medium ${
              activeTab === "POP"
                ? "text-white"
                : "text-gray-600 group-hover:text-white"
            }`}
          >
            Request
          </p>
          <h2
            className={`text-2xl font-bold ${
              activeTab === "POP"
                ? "text-white"
                : "text-pink-400 group-hover:text-white"
            }`}
          >
            Progesterone Only Pill (POP)
          </h2>
        </div>

        <div
          onClick={() => setActiveTab("COCP")}
          className={`cursor-pointer rounded-xl shadow-md p-6 border-b-2 border-gray-400 group transition-all duration-300 ${
            activeTab === "COCP"
              ? "bg-pink-300 text-white"
              : "bg-white hover:bg-pink-200"
          }`}
        >
          <p
            className={`text-md font-medium ${
              activeTab === "COCP"
                ? "text-white"
                : "text-gray-600 group-hover:text-white"
            }`}
          >
            Request
          </p>
          <h2
            className={`text-2xl font-bold ${
              activeTab === "COCP"
                ? "text-white"
                : "text-pink-400 group-hover:text-white"
            }`}
          >
            Combined Only Contraception Pill (COCP)
          </h2>
        </div>
      </div>

      {/* Table */}
      <div>
        <div className="p-6 bg-white shadow-md rounded-md text-gray-800 my-16 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">
            Service request – {activeTab}
          </h2>
          <table className="w-full border border-pink-200 rounded-2xl">
            <thead>
              <tr className="bg-fuchsia-100">
                <th className="p-2 border border-pink-200">ID</th>
                <th className="p-2 border border-pink-200">Profile</th>
                <th className="p-2 border border-pink-200">Name</th>
                <th className="p-2 border border-pink-200">Email</th>
                <th className="p-2 border border-pink-200">Phone</th>
                <th className="p-2 border border-pink-200">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="text-center">
                  <td className="p-2 border border-pink-200">{user.ID}</td>
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
                    <div className="flex gap-4 justify-center">
                      <Link
                        href={`/dashboard/our-service/${user._id}`}
                        className="px-3 py-1 bg-pink-300 hover:bg-pink-600 text-gray-800 hover:text-white rounded border border-pink-300 cursor-pointer"
                      >
                        Accept
                      </Link>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="px-3 py-1 bg-transparent hover:bg-pink-400 text-gray-700 hover:text-white rounded border border-pink-400 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-4 text-center text-gray-500 italic"
                  >
                    No requests found for {activeTab}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OurService;
