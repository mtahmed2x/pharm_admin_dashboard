"use client";

import { MessageCircleHeartIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CgProfile } from "react-icons/cg";
import { FaTowerObservation } from "react-icons/fa6";
import { FiChevronDown, FiChevronUp, FiSettings, FiUser } from "react-icons/fi";
import { MdOutlineDashboard } from "react-icons/md";

// NavItem Component
const NavItem = ({
  href,
  icon: Icon,
  children,
  isDropdown = false,
  isOpen = false,
  onClick,
}: {
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  isDropdown?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = href ? pathname === href : false;

  const className = `text-sm flex items-center p-3 rounded-lg transition-all duration-300 ${
    isActive
      ? "bg-gradient-to-l from-[#ffaced] to-pink-500 text-white font-semibold shadow-lg shadow-pink-200"
      : "text-gray-700 hover:bg-gradient-to-l hover:from-pink-50 hover:to-[#ffecf0] hover:text-pink-600 hover:shadow-lg hover:shadow-pink-200/50"
  }`;

  const content = (
    <>
      {Icon && (
        <Icon
          className={`mr-3 text-lg ${
            isActive ? "text-white" : "text-pink-400 group-hover:text-pink-600"
          }`}
        />
      )}
      <span>{children}</span>
      {isDropdown && (
        <span className="ml-auto">
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </span>
      )}
    </>
  );

  return href ? (
    <Link href={href} className={`group ${className}`}>
      {content}
    </Link>
  ) : (
    <button onClick={onClick} className={`group w-full ${className}`}>
      {content}
    </button>
  );
};

const Sidebar = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // await logOut();
      router.push("/");
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
      console.error("Sign out error:", error);
    }
  };

  return (
    <div className="w-72 h-screen bg-gradient-to-b from-[#fff5f7] to-[#ffeef2] shadow-lg fixed left-0 top-0 p-4 flex flex-col border-r border-pink-100">
      {/* Logo/Institution Name */}
      <Link
        href="/"
        className="flex justify-center gap-2 mb-8 p-4 border-b border-pink-200"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
            herPILL
          </h1>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <NavItem href="/dashboard" icon={MdOutlineDashboard}>
              Dashboard
            </NavItem>
          </li>
          <li>
            <NavItem href="/dashboard/user" icon={FiUser}>
              User
            </NavItem>
          </li>
          <li>
            <NavItem href="/dashboard/our-service" icon={FaTowerObservation}>
              User Service
            </NavItem>
          </li>
          <li>
            <NavItem href="/dashboard/my-profile" icon={CgProfile}>
              My Profile
            </NavItem>
          </li>
          <li>
            <NavItem href="/dashboard/my-setting" icon={FiSettings}>
              Setting
            </NavItem>
          </li>
          <li>
            <NavItem href="/dashboard/messages" icon={MessageCircleHeartIcon}>
              Message
            </NavItem>
          </li>
        </ul>
      </nav>

      {/* Log Out */}
      <div className="mt-auto p-3 border-t border-pink-200">
        <button
          onClick={handleSignOut}
          className="w-full p-3 text-sm rounded-lg text-pink-500 hover:bg-pink-50 hover:text-pink-600 transition-colors duration-300 flex items-center justify-center font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
