"use client";

import { useGetUserByIdQuery } from "@/api/userApi";
import {
  User as UserIcon,
  Calendar,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  ArrowLeft, // <-- Import the icon for the back button
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation"; // <-- Import useRouter

// A reusable component to display user details neatly
const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | null | boolean;
}) => {
  const displayValue =
    value === null || value === undefined || value === ""
      ? "Not Provided"
      : String(value);

  // Special handling for boolean values
  if (typeof value === "boolean") {
    return (
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <div
          className={`flex items-center gap-2 mt-1 ${
            value ? "text-green-600" : "text-red-600"
          }`}
        >
          {value ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <p className="font-semibold">{value ? "Yes" : "No"}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800 mt-1">{displayValue}</p>
    </div>
  );
};

const UserDetailsPage = () => {
  const params = useParams();
  const router = useRouter(); // <-- Initialize the router
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    data: userResponse,
    isLoading,
    isError,
    error,
  } = useGetUserByIdQuery(id!, {
    skip: !id,
  });

  // Handle Loading State
  if (isLoading) {
    return (
      <p className="p-8 text-center text-pink-500">Loading user data...</p>
    );
  }

  // Handle Error State
  if (isError || !userResponse?.success) {
    console.error("Error fetching user:", error || userResponse?.message);
    return (
      <p className="p-8 text-center text-red-500">
        User not found or failed to load.
      </p>
    );
  }

  const user = userResponse.data;

  // Format the join date
  const joinedOn = new Date(user.createdAt!).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-6 bg-pink-50 min-h-screen text-gray-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          {/* --- THIS IS THE NEW BACK BUTTON --- */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-pink-500 mb-2 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to User List
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            {`${user.firstName} ${user.surname || ""}`.trim()}
          </h1>
        </div>
        <button className="bg-pink-200 text-pink-800 hover:bg-pink-400 hover:text-white px-4 py-2 rounded-lg transition mt-4 md:mt-0">
          Send Message
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white p-8 rounded-xl shadow-md">
        {/* User Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-200">
          <Image
            src={
              user.avatar ||
              "https://i.postimg.cc/4xLZjmW2/dfb6892164e638fc869bc424d651235a519c6d80.png"
            }
            alt="Profile Picture"
            width={100}
            height={100}
            className="rounded-full object-cover border-4 border-pink-100"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-semibold">
              {`${user.firstName} ${user.surname || ""}`.trim()}
            </h2>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 mt-1">
              <Mail size={16} />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 mt-1">
              <Phone size={16} />
              <span>{user.phoneNumber || "No phone number"}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 mt-1">
              <Calendar size={16} />
              <span>Joined on {joinedOn}</span>
            </div>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-6">
            Personal & Medical Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DetailItem label="First Name" value={user.firstName} />
            <DetailItem label="Surname" value={user.surname} />
            <DetailItem label="Email Address" value={user.email} />
            <DetailItem label="Phone Number" value={user.phoneNumber} />
            <DetailItem
              label="Date of Birth"
              value={
                user.dateOfBirth
                  ? new Date(user.dateOfBirth).toLocaleDateString()
                  : null
              }
            />
            <DetailItem label="Gender" value={user.gender} />
            <DetailItem label="Sex Assigned at Birth" value={user.sex} />
            <DetailItem label="Postcode" value={user.postcode} />
            <DetailItem label="NHS Number" value={user.nhs} />
            <DetailItem
              label="Contraception Preference"
              value={user.contraception}
            />
            <DetailItem label="Account Verified" value={user.verified} />
            <DetailItem label="Account Blocked" value={user.blocked} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPage;
