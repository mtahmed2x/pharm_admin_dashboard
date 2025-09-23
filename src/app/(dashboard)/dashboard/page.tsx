import ActiveUser from "@/components/Dashboard/ActiveUser";
import UserList from "@/components/Dashboard/UserList";
import { UserCheck, UserPlus, Users, UserX } from "lucide-react";

const Dashboard = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
        {/* Total Users */}
        <div className="bg-white hover:bg-pink-200 rounded-xl shadow-md p-6 flex items-center gap-4 border-b-2 border-gray-400 group">
          <div className="p-4 bg-blue-50 rounded-full">
            <Users className="text-blue-600 w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-600 text-md font-medium">Total Users</p>
            <h2 className="text-2xl font-bold text-pink-400 group-hover:text-white">
              1,250
            </h2>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white hover:bg-pink-200 rounded-xl shadow-md p-6 flex items-center gap-4 border-b-2 border-gray-400 group">
          <div className="p-4 bg-green-50 rounded-full">
            <UserCheck className="text-green-600 w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-600 text-md font-medium">Active Users</p>
            <h2 className="text-2xl font-bold text-pink-400 group-hover:text-white">
              320
            </h2>
          </div>
        </div>

        {/* New Request */}
        <div className="bg-white hover:bg-pink-200 rounded-xl shadow-md p-6 flex items-center gap-4 border-b-2 border-gray-400 group">
          <div className="p-4 bg-yellow-50 rounded-full">
            <UserPlus className="text-yellow-600 w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-600 text-md font-medium">New Requests</p>
            <h2 className="text-2xl font-bold text-pink-400 group-hover:text-white">
              150
            </h2>
          </div>
        </div>

        {/* Incomplete Users */}
        <div className="bg-white hover:bg-pink-200 rounded-xl shadow-md p-6 flex items-center gap-4 border-b-2 border-gray-400 group">
          <div className="p-4 bg-red-50 rounded-full">
            <UserX className="text-red-600 w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-600 text-md font-medium">
              Incomplete Users
            </p>
            <h2 className="text-2xl font-bold text-pink-400 group-hover:text-white">
              45
            </h2>
          </div>
        </div>
      </div>
      <UserList />
      <ActiveUser />
    </div>
  );
};

export default Dashboard;
