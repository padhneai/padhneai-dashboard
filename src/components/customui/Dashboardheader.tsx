import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Settings, User } from "lucide-react";

const Dashboardheader = () => {
  // Mock user data - replace with actual auth state in future
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "", // Empty for now, will show fallback
    isLoggedIn: true // Set to false to show login button
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left side - Logo/Title */}
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PadhneAI</h1>
              <p className="text-sm text-gray-500">Dashboard</p>
            </div>
          </div>

          {/* Right side - User section */}
          <div className="flex items-center space-x-4">
            {user.isLoggedIn ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Button>

                {/* Settings */}
                <Button variant="ghost" size="sm">
                  <Settings className="h-5 w-5 text-gray-600" />
                </Button>

                {/* User Profile */}
                <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </>
            ) : (
              /* Login button for unauthenticated users */
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Dashboardheader;