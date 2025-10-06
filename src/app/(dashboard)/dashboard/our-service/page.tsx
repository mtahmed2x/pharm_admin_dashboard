"use client";

import {
  useGetPopsQuery,
  useGetCocpsQuery,
  useDeletePopMutation,
  useDeleteCocpMutation,
  useUpdatePopStatusMutation,
  useUpdateCocpStatusMutation,
} from "@/api/serviceApi";
import { Pop, Cocp, User } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const OurServicePage = () => {
  const [activeTab, setActiveTab] = useState<"POP" | "COCP">("POP");
  const [popPage, setPopPage] = useState(1);
  const [cocpPage, setCocpPage] = useState(1);
  const limit = 10; // Items per page

  // --- RTK Query Data Fetching Hooks ---
  const {
    data: popResponse,
    isLoading: isPopLoading,
    isFetching: isPopFetching,
    isError: isPopError,
  } = useGetPopsQuery({ page: popPage, limit });

  const {
    data: cocpResponse,
    isLoading: isCocpLoading,
    isFetching: isCocpFetching,
    isError: isCocpError,
  } = useGetCocpsQuery({ page: cocpPage, limit });

  // --- RTK Query Mutation Hooks ---
  const [deletePop] = useDeletePopMutation();
  const [deleteCocp] = useDeleteCocpMutation();
  const [updatePopStatus, { isLoading: isUpdatingPop }] =
    useUpdatePopStatusMutation();
  const [updateCocpStatus, { isLoading: isUpdatingCocp }] =
    useUpdateCocpStatusMutation();

  const isUpdatingStatus = isUpdatingPop || isUpdatingCocp;

  // --- Event Handlers ---

  const handleStatusUpdate = async (
    id: string,
    status: "accept" | "decline"
  ) => {
    const actionText = status === "accept" ? "accept" : "decline";
    try {
      const mutation = activeTab === "POP" ? updatePopStatus : updateCocpStatus;
      const response = await mutation({ id, status }).unwrap();
      toast.success(
        response.message || `Request successfully ${actionText}ed.`
      );
    } catch (err: any) {
      console.error(`Failed to ${actionText} request:`, err);
      toast.error(
        err.data?.message ||
          `An error occurred while trying to ${actionText} the request.`
      );
    }
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This request will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const mutation = activeTab === "POP" ? deletePop : deleteCocp;
          const response = await mutation(id).unwrap();
          toast.success(response.message || "Request deleted successfully!");
          Swal.fire("Deleted!", "The request has been removed.", "success");
        } catch (err: any) {
          console.error("Failed to delete request::", err);
          toast.error(err.data?.message || "An error occurred while deleting.");
        }
      }
    });
  };

  // --- Derived State for Rendering ---
  const isLoading = activeTab === "POP" ? isPopLoading : isCocpLoading;
  const isFetching = activeTab === "POP" ? isPopFetching : isCocpFetching;
  const isError = activeTab === "POP" ? isPopError : isCocpError;
  const responseData = activeTab === "POP" ? popResponse : cocpResponse;

  const requests = responseData?.data || [];
  const meta = responseData?.meta;
  const currentPage = activeTab === "POP" ? popPage : cocpPage;
  const totalPage = meta?.totalPage || 1;
  const setPage = activeTab === "POP" ? setPopPage : setCocpPage;

  const getUser = (user: User | string): Partial<User> => {
    return typeof user === "object" ? user : { _id: user };
  };

  // --- Component Render ---
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
          {/* --- THIS IS THE FIX --- */}
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
          {/* --- THIS IS THE FIX --- */}
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
            Combined Contraceptive Pill (COCP)
          </h2>
        </div>
      </div>

      {/* Table & Pagination Container */}
      <div className="p-6 bg-white shadow-md rounded-md text-gray-800 my-16 overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Service Requests – {activeTab}
          </h2>
          {isFetching && (
            <span className="text-pink-400 text-sm animate-pulse">
              Updating...
            </span>
          )}
        </div>
        <table className="w-full border border-pink-200 rounded-2xl">
          <thead>
            <tr className="bg-fuchsia-100">
              <th className="p-2 border border-pink-200">Profile</th>
              <th className="p-2 border border-pink-200">Name</th>
              <th className="p-2 border border-pink-200">Email</th>
              <th className="p-2 border border-pink-200">Phone</th>
              <th className="p-2 border border-pink-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  Loading requests...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-red-500">
                  Failed to load data. Please try again.
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-gray-500 italic"
                >
                  No requests found for {activeTab}.
                </td>
              </tr>
            ) : (
              requests.map((req: Pop | Cocp) => {
                const user = getUser(req.userId);
                const requestType = activeTab.toLowerCase();
                return (
                  <tr key={req._id} className="text-center">
                    <td className="p-1 border border-pink-200 flex justify-center">
                      <Image
                        src={
                          user.avatar ||
                          "https://i.postimg.cc/4xLZjmW2/dfb6892164e638fc869bc424d651235a519c6d80.png"
                        }
                        alt={user.firstName || "User Avatar"}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </td>
                    <td className="p-2 border border-pink-200">
                      {user.firstName || "N/A"}
                    </td>
                    <td className="p-2 border border-pink-200">
                      {user.email || "N/A"}
                    </td>
                    <td className="p-2 border border-pink-200">
                      {user.phoneNumber || "N/A"}
                    </td>
                    <td className="p-2 border border-pink-200">
                      <div className="flex gap-2 justify-center items-center">
                        {req.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(req._id, "accept")
                              }
                              disabled={isUpdatingStatus}
                              className="px-3 py-1 bg-green-200 hover:bg-green-500 text-green-800 hover:text-white rounded border border-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(req._id, "decline")
                              }
                              disabled={isUpdatingStatus}
                              className="px-3 py-1 bg-yellow-200 hover:bg-yellow-500 text-yellow-800 hover:text-white rounded border border-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {req.status === "accept" && (
                          <Link
                            href={`/dashboard/our-service/${req._id}?type=${requestType}`}
                            className="px-3 py-1 bg-blue-200 hover:bg-blue-500 text-blue-800 hover:text-white rounded border border-blue-300 transition-colors"
                          >
                            Details
                          </Link>
                        )}
                        {req.status === "decline" && (
                          <button
                            onClick={() => handleDelete(req._id)}
                            className="px-3 py-1 bg-red-200 hover:bg-red-500 text-red-800 hover:text-white rounded border border-red-300 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {!isLoading && !isError && totalPage > 1 && (
          <div className="flex justify-end items-center mt-6 space-x-2">
            <button
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || isFetching}
              className="px-4 py-2 text-sm font-medium text-pink-700 bg-pink-100 rounded-lg hover:bg-pink-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-700 text-sm">
              Page {currentPage} of {totalPage}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPage, currentPage + 1))}
              disabled={currentPage === totalPage || isFetching}
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

export default OurServicePage;
