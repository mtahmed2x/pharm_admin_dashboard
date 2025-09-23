"use client";

import { UserFormData, UserTableData } from "@/types/dashboardTypes";
import { User } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserTableData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>();

  // fetch user data by id
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/users.json");
        const data = await res.json();

        const user = data.find((u: UserTableData) => u._id === id);

        if (user) {
          setUser(user);
          // Map the JSON data to form fields
          reset({
            fullName: user.name,
            email: user.email,
            phone: user.phone,
            postCode: "",
            joinedOn: "",
            gender: "",
            address: "",
            sexAssigned: "",
            nhs: "",
            gpSurgery: "",
            contraception: "",
            image: user.image,
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, reset]);

  const onSubmit = (data: UserFormData) => {
    console.log("Form Submitted:", data);
    alert("Profile updated!");
  };

  if (loading) {
    return <p className="p-6">Loading user data...</p>;
  }

  if (!user) {
    return <p className="p-6">User not found</p>;
  }

  return (
    <div className="p-6 bg-pink-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <User className="w-4 h-4" />
        <span>Users</span>
        <span className="text-pink-400">/ {user.ID}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">{user.name}</h1>
        <button className="bg-pink-200 text-pink-800 hover:bg-pink-400 hover:text-white px-4 py-2 rounded-lg transition">
          Send message
        </button>
      </div>

      {/* Profile Picture */}
      <div className="items-center gap-6 mb-10">
        <p className="font-medium text-gray-700">Profile Picture</p>
        <Image
          src={user.image || "https://i.pravatar.cc/150?img=12"}
          alt="Profile Picture"
          width={80}
          height={80}
          className="rounded-full object-cover"
        />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block text-md text-gray-700 font-medium">
            Full Name
          </label>
          <input
            {...register("fullName", { required: true })}
            className="mt-1 w-full bg-white border border-pink-300 rounded px-3 py-2 focus:outline-2 focus:outline-pink-500 text-gray-500"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">Full name is required</p>
          )}
        </div>

        <div>
          <label className="block text-md text-gray-700 font-medium">
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="mt-1 w-full bg-white border border-pink-300 rounded px-3 py-2 focus:outline-2 focus:outline-pink-500 text-gray-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">Email is required</p>
          )}
        </div>

        <div>
          <label className="block text-md text-gray-700 font-medium">
            Phone Number
          </label>
          <input
            {...register("phone", { required: true })}
            className="mt-1 w-full bg-white border border-pink-300 rounded px-3 py-2 focus:outline-2 focus:outline-pink-500 text-gray-500"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">Phone number is required</p>
          )}
        </div>

        <div>
          <label className="block text-md text-gray-700 font-medium">
            Post code
          </label>
          <input
            {...register("postCode", { required: true })}
            className="mt-1 w-full bg-white border border-pink-300 rounded px-3 py-2 focus:outline-2 focus:outline-pink-500 text-gray-500"
          />
          {errors.postCode && (
            <p className="text-red-500 text-sm">Post code is required</p>
          )}
        </div>

        <div>
          <label className="block text-md text-gray-700 font-medium">
            Joined on
          </label>
          <input
            type="date"
            {...register("joinedOn", { required: true })}
            className="mt-1 w-full bg-white border border-pink-300 rounded px-3 py-2 focus:outline-2 focus:outline-pink-500 text-gray-500"
          />
          {errors.joinedOn && (
            <p className="text-red-500 text-sm">Join date is required</p>
          )}
        </div>

        <div>
          <label className="block text-md text-gray-700 font-medium">
            Gender
          </label>
          <select
            {...register("gender", { required: true })}
            className="mt-1 w-full bg-white border border-pink-300 rounded px-3 py-2 focus:outline-2 focus:outline-pink-500 text-gray-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-sm">Gender is required</p>
          )}
        </div>
        <div>
          <label className="block text-md text-gray-700 font-medium">
            Sex assigned at birth
          </label>
          <select
            {...register("sexAssigned", { required: true })}
            className="mt-1 w-full bg-white border border-pink-300 rounded px-3 py-2 focus:outline-2 focus:outline-pink-500 text-gray-500"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="intersex">Intersex</option>
          </select>
          {errors.sexAssigned && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}
        </div>

        <div>
          <label className="block text-md text-gray-700 font-medium">
            NHS no
          </label>
          <input
            {...register("nhs", { required: true })}
            className="mt-1 w-full bg-white border border-pink-300 rounded px-3 py-2 focus:outline-2 focus:outline-pink-500 text-gray-500"
          />
          {errors.nhs && (
            <p className="text-red-500 text-sm">NHS number is required</p>
          )}
        </div>

        <div>
          <label className="block text-md text-gray-700 font-medium">
            Current GP surgery
          </label>
          <input
            {...register("gpSurgery", { required: true })}
            className="mt-1 w-full bg-white border border-pink-300 rounded px-3 py-2 focus:outline-2 focus:outline-pink-500 text-gray-500"
          />
          {errors.gpSurgery && (
            <p className="text-red-500 text-sm">GP surgery is required</p>
          )}
        </div>

        <div>
          <label className="block text-md text-gray-700 font-medium">
            Who will take the contraception
          </label>
          <input
            {...register("contraception", { required: true })}
            className="mt-1 w-full bg-white border border-pink-300 rounded px-3 py-2 focus:outline-2 focus:outline-pink-500 text-gray-500"
          />
          {errors.contraception && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}
        </div>
        <div>
          <label className="block text-md text-gray-700 font-medium">
            Address
          </label>
          <textarea
            {...register("address", { required: true })}
            className="mt-1 w-full bg-white border border-pink-300 rounded px-3 py-2 focus:outline-2 focus:outline-pink-500 text-gray-500"
            rows={3}
          />
          {errors.address && (
            <p className="text-red-500 text-sm">Address is required</p>
          )}
        </div>

        {/* Buttons */}
        <div className="col-span-2 flex justify-end gap-4 mt-6">
          <button
            type="button"
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
