"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  number: string;
};

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
    reset();
  };

  return (
    <div className="text-gray-800 space-y-6 p-6">
      {/* Profile Section */}
      <div className="bg-white p-4 rounded-xl space-y-5 shadow-md">
        <div className="flex justify-between">
          <h4 className="text-lg font-semibold">Admin Personal Information</h4>
          <a className="text-pink-300 underline cursor-pointer">Upload Photo</a>
        </div>

        <div className="flex gap-4 items-center">
          <Image
            src="https://i.postimg.cc/4xLZjmW2/dfb6892164e638fc869bc424d651235a519c6d80.png"
            alt="Admin"
            width={48}
            height={48}
            className="w-14 h-14 rounded-full object-cover"
            quality={100}
          />
          <div>
            <h5 className="text-xl font-medium">Hasib</h5>
            <p className="text-gray-600">Admin</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white p-4 rounded-xl space-y-5 shadow-md">
        <h2 className="text-2xl font-bold mb-4">Basic information</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-4 relative"
        >
          {/* First Name */}
          <div>
            <label className="block mb-1">First Name</label>
            <input
              type="text"
              {...register("firstName", { required: "First name is required" })}
              className="w-full text-gray-600 border border-pink-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            {errors.firstName && (
              <p className="text-red-500 mt-1">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block mb-1">Last Name</label>
            <input
              type="text"
              {...register("lastName", { required: "Last name is required" })}
              className="w-full text-gray-600 border border-pink-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            {errors.lastName && (
              <p className="text-red-500 mt-1">{errors.lastName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full text-gray-600 border border-pink-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            {errors.email && (
              <p className="text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block mb-1">Phone Number</label>
            <input
              type="tel"
              {...register("number", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10,14}$/,
                  message: "Invalid phone number",
                },
              })}
              className="w-full text-gray-600 border border-pink-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            {errors.number && (
              <p className="text-red-500 mt-1">{errors.number.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="col-span-1 lg:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-pink-300 text-white px-6 py-2 rounded hover:bg-pink-500"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
