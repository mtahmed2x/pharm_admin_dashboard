"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import { FaCamera } from "react-icons/fa";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
} from "@/api/userApi"; // Adjust this import path to your project structure
import { Gender, Sex } from "@/types"; // Adjust import path

// Form data type now only includes fields that are part of the main form
type FormData = {
  firstName: string;
  surname: string;
  dateOfBirth: string;
  gender: Gender;
  sex: Sex;
};

const Page = () => {
  // --- STATE AND REFS ---
  const [isEditMode, setIsEditMode] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- RTK QUERY HOOKS ---
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    isError,
  } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [updateAvatar, { isLoading: isUploadingAvatar }] =
    useUpdateAvatarMutation();

  // --- REACT HOOK FORM ---
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  // --- EFFECTS ---
  // Effect to populate the form when profile data is loaded or edit mode is toggled
  useEffect(() => {
    if (profileData?.success) {
      const user = profileData.data;
      // Format date for the input type="date" which requires 'YYYY-MM-DD'
      const formattedDate = user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "";

      reset({
        firstName: user.firstName || "",
        surname: user.surname || "",
        dateOfBirth: formattedDate,
        gender: user.gender || "not-stated",
        sex: user.sex || "male",
      });
    }
  }, [profileData, isEditMode, reset]);

  // --- HANDLERS ---
  const handleProfileSubmit = async (data: FormData) => {
    try {
      await updateProfile(data).unwrap();
      setIsEditMode(false);
      // Optional: Show a success toast notification
    } catch (err) {
      console.error("Failed to update profile:", err);
      // Optional: Show an error toast notification
    }
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set preview immediately for better UX
    setAvatarPreview(URL.createObjectURL(file));

    try {
      await updateAvatar({ avatar: file }).unwrap();
      // Optional: Show a success toast notification.
      // The profile data will refetch automatically.
    } catch (err) {
      console.error("Failed to upload avatar:", err);
      setAvatarPreview(null); // Revert preview on error
      // Optional: Show an error toast notification
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setAvatarPreview(null);
    // The useEffect will automatically reset the form to the original server data
  };

  // --- RENDER LOGIC ---
  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading Profile...</div>
      </div>
    );
  }

  if (isError || !profileData?.success) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Error loading profile data.</div>
      </div>
    );
  }

  const user = profileData.data;

  return (
    <div className="text-gray-800 space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          {/* --- HEADER SECTION --- */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Image
                  src={
                    avatarPreview ||
                    user.avatar || 
                    "https://i.postimg.cc/4xLZjmW2/dfb6892164e638fc869bc424d651235a519c6d80.png"
                  }
                  alt={user.firstName}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover border-4 border-pink-100"
                  quality={100}
                />
                {isEditMode && (
                  <div
                    className="absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full cursor-pointer hover:bg-gray-800 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploadingAvatar ? (
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                    ) : (
                      <FaCamera className="text-white h-5 w-5" />
                    )}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {user.firstName} {user.surname}
                </h2>
                <p className="text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
            {!isEditMode && (
              <button
                onClick={() => setIsEditMode(true)}
                className="mt-4 md:mt-0 bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500 transition-colors"
              >
                Edit Information
              </button>
            )}
          </div>

          {/* --- INFORMATION SECTION --- */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Personal Information
            </h3>
            {isEditMode ? (
              // --- EDIT MODE FORM ---
              <form
                onSubmit={handleSubmit(handleProfileSubmit)}
                className="space-y-6"
              >
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Form fields here */}
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      {...register("firstName", {
                        required: "First name is required",
                      })}
                      className="w-full text-gray-700 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Surname
                    </label>
                    <input
                      type="text"
                      {...register("surname")}
                      className="w-full text-gray-700 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      {...register("dateOfBirth")}
                      className="w-full text-gray-700 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      {...register("gender")}
                      className="w-full text-gray-700 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                    >
                      <option value="not-stated">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Sex
                    </label>
                    <select
                      {...register("sex")}
                      className="w-full text-gray-700 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500 transition disabled:bg-pink-200"
                  >
                    {isUpdatingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              // --- VIEW MODE ---
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <p className="font-semibold text-gray-600">First Name</p>
                  <p className="text-gray-800">{user.firstName}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Surname</p>
                  <p className="text-gray-800">{user.surname || "N/A"}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Date of Birth</p>
                  <p className="text-gray-800">
                    {user.dateOfBirth
                      ? new Date(user.dateOfBirth).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Gender</p>
                  <p className="text-gray-800 capitalize">
                    {user.gender || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Sex</p>
                  <p className="text-gray-800 capitalize">
                    {user.sex || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-600">Email</p>
                  <p className="text-gray-800">{user.email}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
