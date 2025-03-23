import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon, MenuIcon, SearchIcon, UserIcon } from "lucide-react";

export default function MainNav() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-primary-600 font-poppins font-bold text-2xl cursor-pointer">sewa.in</span>
              </Link>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <Link href="/">
                <a className={`${location === "/" ? "border-primary-600 text-secondary-900" : "border-transparent text-gray-500 hover:text-secondary-900 hover:border-gray-300"} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Home
                </a>
              </Link>
              <Link href="/services">
                <a className={`${location === "/services" ? "border-primary-600 text-secondary-900" : "border-transparent text-gray-500 hover:text-secondary-900 hover:border-gray-300"} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}>
                  Services
                </a>
              </Link>
              <a href="#how-it-works" className="border-transparent text-gray-500 hover:text-secondary-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
                How it works
              </a>
              <a href="#about" className="border-transparent text-gray-500 hover:text-secondary-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
                About Us
              </a>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search services..."
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                <SearchIcon className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <BellIcon className="h-5 w-5 text-gray-500" />
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="ml-2 text-sm hidden md:inline">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>My Bookings</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" className="ml-3 text-gray-500 hover:text-secondary-900">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                      <UserIcon className="h-4 w-4 text-gray-500" />
                    </div>
                    <span className="text-sm">Login / Register</span>
                  </div>
                </Button>
              </Link>
            )}
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <Button variant="ghost" onClick={toggleMobileMenu} aria-expanded={mobileMenuOpen}>
              <span className="sr-only">Open main menu</span>
              <MenuIcon className="h-6 w-6 text-gray-400" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/">
              <a className={`${location === "/" ? "bg-primary-50 border-l-4 border-primary-600 text-primary-700" : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-secondary-900"} block pl-3 pr-4 py-2 text-base font-medium border-l-4`}>
                Home
              </a>
            </Link>
            <Link href="/services">
              <a className={`${location === "/services" ? "bg-primary-50 border-l-4 border-primary-600 text-primary-700" : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-secondary-900"} block pl-3 pr-4 py-2 text-base font-medium border-l-4`}>
                Services
              </a>
            </Link>
            <a href="#how-it-works" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-secondary-900 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              How it works
            </a>
            <a href="#about" className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-secondary-900 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
              About Us
            </a>
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-2 space-y-1">
              <div className="relative mb-3">
                <Input
                  type="text"
                  placeholder="Search services..."
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                  <SearchIcon className="h-4 w-4 text-gray-400" />
                </Button>
              </div>
              
              {user ? (
                <>
                  <div className="flex items-center px-3 py-2">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user.username}</span>
                  </div>
                  <Separator className="my-2" />
                  <Button variant="ghost" className="w-full justify-start px-3 py-2 text-left">
                    Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start px-3 py-2 text-left">
                    My Bookings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start px-3 py-2 text-left">
                    Settings
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start px-3 py-2 text-left"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/auth">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-secondary-900 hover:bg-gray-50">
                    Login / Register
                  </a>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
