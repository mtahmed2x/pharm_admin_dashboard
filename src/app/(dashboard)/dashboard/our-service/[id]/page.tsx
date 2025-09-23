"use client";

import { ServiceData, UserFormData } from "@/types/dashboardTypes";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<ServiceData | null>(null);

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
        const res = await fetch("/service.json");
        const data = await res.json();

        const user = data.find((u: ServiceData) => u._id === id);

        if (user) {
          setUser(user);
          // Map the JSON data to form fields
          reset({
            fullName: user.name,
            email: user.email,
            phone: user.phone,
            postCode: user.postCode,
            joinedOn: user.joinedOn,
            gender: user.gender,
            address: user.address,
            sexAssigned: user.sexAssigned,
            nhs: user.nhs,
            gpSurgery: user.gpSurgery,
            contraception: user.contraception,
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

  // ✅ Accept function (like permission approval)
  // const handleAccept = (id: string) => {
  //   Swal.fire({
  //     title: "Accept this request?",
  //     text: "The user will be granted permission.",
  //     icon: "question",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#aaa",
  //     confirmButtonText: "Yes, accept it!",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       // Example API call to update status → you can change endpoint
  //       const res = await axios.patch(`/api/users/${id}`, { status: true });
  //       if (res.data.modifiedCount > 0) {
  //         setUsers(
  //           users.map((u) => (u._id === id ? { ...u, status: true } : u))
  //         );
  //         toast.success("User request accepted!");
  //         Swal.fire("Accepted!", "The request has been approved.", "success");
  //       }
  //     }
  //   });
  // };

  if (loading) {
    return <p className="p-6">Loading user data...</p>;
  }

  if (!user) {
    return <p className="p-6">User not found</p>;
  }

  return (
    <div className="p-6 bg-pink-50/70 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Service request of {user.serviceType}
          </h1>
          <span className="text-gray-700 font-medium">ID : {user.ID}</span>
        </div>
        <Link
          href="/dashboard/message"
          className="bg-pink-200 text-pink-800 hover:bg-pink-400 hover:text-white px-4 py-2 rounded transition"
        >
          Send message
        </Link>
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
          <Link
            href="/dashboard/our-service"
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Back
          </Link>
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
