"use client";

import { useGetPopByIdQuery, useGetCocpByIdQuery } from "@/api/serviceApi";
import { Pop, Cocp, User } from "@/types";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Calendar,
  Mail,
  Phone,
  Pill,
  User as UserIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

// Reusable component for displaying key-value pairs
const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | string[] | boolean | number | null;
}) => {
  let displayValue: React.ReactNode = "Not Provided";

  if (value === true || value === false) {
    displayValue = (
      <div
        className={`flex items-center gap-1.5 font-semibold ${
          value ? "text-green-600" : "text-red-600"
        }`}
      >
        {value ? <CheckCircle size={16} /> : <XCircle size={16} />}
        <span>{value ? "Yes" : "No"}</span>
      </div>
    );
  } else if (Array.isArray(value) && value.length > 0) {
    displayValue = value.join(", ");
  } else if (value) {
    displayValue = String(value);
  }

  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-gray-800 font-medium mt-1 break-words">
        {displayValue}
      </p>
    </div>
  );
};

const ServiceDetailsPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params.id as string;
  const type = searchParams.get("type"); // 'pop' or 'cocp'

  // Conditionally fetch data based on the 'type' query parameter
  const {
    data: popResponse,
    isLoading: isPopLoading,
    isError: isPopError,
  } = useGetPopByIdQuery(id, { skip: type !== "pop" });
  const {
    data: cocpResponse,
    isLoading: isCocpLoading,
    isError: isCocpError,
  } = useGetCocpByIdQuery(id, { skip: type !== "cocp" });

  const isLoading = isPopLoading || isCocpLoading;
  const isError = isPopError || isCocpError;
  const response = type === "pop" ? popResponse : cocpResponse;

  if (!type) {
    return (
      <div className="p-8 text-center text-red-500">
        Error: Service type is missing from the URL.
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="p-8 text-center text-pink-500">
        Loading service request details...
      </div>
    );
  }
  if (isError || !response?.success) {
    toast.error("Failed to load service details.");
    return (
      <div className="p-8 text-center text-red-500">
        Could not find the requested service.
      </div>
    );
  }

  const requestData = response.data as Pop | Cocp;
  const user = requestData.userId as User;
  const requestType = type.toUpperCase();

  const joinedOn = new Date(user.createdAt!).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-6 bg-pink-50/70 min-h-screen text-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-pink-500 mb-2"
          >
            <ArrowLeft size={16} />
            Back to Service List
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            {requestType} Request Details
          </h1>
        </div>
        <Link
          href="/dashboard/messages"
          className="bg-pink-200 text-pink-800 hover:bg-pink-400 hover:text-white px-4 py-2 rounded-lg transition"
        >
          Send Message
        </Link>
      </div>

      {/* Main Content Card */}
      <div className="bg-white p-8 rounded-xl shadow-md space-y-10">
        {/* User Profile Section */}
        <section>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <UserIcon /> User Information
          </h2>
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
            <div className="text-center sm:text-left grid gap-1">
              <h3 className="text-2xl font-bold">
                {`${user.firstName} ${user.surname || ""}`.trim()}
              </h3>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500">
                <Mail size={16} />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500">
                <Phone size={16} />
                <span>{user.phoneNumber || "Not Provided"}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500">
                <Calendar size={16} />
                <span>Joined on {joinedOn}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Request Details Section */}
        <section>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
            <Pill /> Contraception Request Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Common Fields */}
            <DetailItem label="Consent Given" value={requestData.consent} />
            <DetailItem
              label="Consent to Share with GP"
              value={requestData.shareConsent}
            />
            <DetailItem
              label="Wants to Speak with Specialist"
              value={requestData.speakWithSpecialist}
            />
            <DetailItem
              label="Medical History"
              value={requestData.medicalHistory}
            />
            <DetailItem
              label="Medical Details"
              value={requestData.medicalDetails}
            />
            <DetailItem
              label="Currently Pregnant"
              value={requestData.isPregnant}
            />
            <DetailItem
              label="Exclusions Noted"
              value={requestData.exclusions}
            />
            <DetailItem
              label="Appointment Needed"
              value={requestData.needAppointment}
            />
            <DetailItem
              label="Request Status"
              value={
                requestData.status.charAt(0).toUpperCase() +
                requestData.status.slice(1)
              }
            />

            {/* Conditional Fields for POP vs COCP */}
            {type === "pop" && (
              <DetailItem
                label="POP Choice"
                value={(requestData as Pop).popOptions}
              />
            )}
            {type === "cocp" && (
              <>
                <DetailItem
                  label="COCP Choice"
                  value={(requestData as Cocp).cocp}
                />
                <DetailItem
                  label="Other Drugs"
                  value={(requestData as Cocp).drugs}
                />
                <DetailItem
                  label="Blood Pressure Status"
                  value={(requestData as Cocp).bloodPreasureStatus}
                />
                <DetailItem label="BMI" value={(requestData as Cocp).bmi} />
                <DetailItem
                  label="Systolic BP"
                  value={(requestData as Cocp).systolic}
                />
                <DetailItem
                  label="Diastolic BP"
                  value={(requestData as Cocp).diastolic}
                />
                <DetailItem
                  label="Weight Recently Checked"
                  value={(requestData as Cocp).weightChecked}
                />
                <DetailItem
                  label="Additional Comments"
                  value={(requestData as Cocp).comment}
                />
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
