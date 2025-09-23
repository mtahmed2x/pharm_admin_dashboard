import { Bell } from "lucide-react";
import { toast } from "react-hot-toast";

const Topbar = () => {
  return (
    <header className="fixed flex justify-between w-[80%] h-16 bg-white shadow items-center px-6 z-10">
      {/* Logo / Title */}
      <div className="font-semibold text-lg bg-gradient-to-r from-pink-600 to-fuchsia-400 text-transparent bg-clip-text">
        Admin Panel
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button
          className="p-2 rounded-lg hover:bg-gray-100 relative"
          aria-label="Notifications"
          onClick={() => toast("No new notifications")}
        >
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
        </button>

        {/* User Info (No Dropdown) */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">A</span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
