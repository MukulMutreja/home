import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Service } from "@shared/schema";
import MainNav from "@/components/layout/main-nav";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";

export default function ServicesPage() {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Parse the URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    if (category) {
      setSelectedCategory(category);
    }
  }, [location]);

  // Fetch all services
  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  // Filter services based on search query and category
  const filteredServices = services?.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory ? service.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: "plumbing", label: "Plumbing" },
    { value: "electrical", label: "Electrical" },
    { value: "cleaning", label: "Cleaning" },
    { value: "painting", label: "Painting" },
    { value: "bathroom", label: "Bathroom" },
    { value: "appliance", label: "Appliance" }
  ];

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    const searchParams = new URLSearchParams(window.location.search);
    
    if (value) {
      searchParams.set("category", value);
    } else {
      searchParams.delete("category");
    }
    
    const newSearch = searchParams.toString();
    const newPath = newSearch ? `/services?${newSearch}` : "/services";
    setLocation(newPath, { replace: true });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-primary-600 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl font-poppins mb-6">
              Our Services
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-primary-100">
              Find the right service for all your home needs
            </p>
            <div className="mt-8 max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    placeholder="Search services..."
                    className="pl-10 pr-4 py-2 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-6">
                    <Skeleton className="h-16 w-16 rounded-full mb-4" />
                    <Skeleton className="h-6 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-20 w-full mb-4" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredServices && filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => (
                <Card key={service.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="h-16 w-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mr-4">
                        <i className={`${service.image} text-2xl`}></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-secondary-900">{service.name}</h3>
                        <p className="text-primary-600">Starting at ₹{service.price}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    <Link href={`/services/${service.id}`}>
                      <Button className="w-full">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
                <i className="fas fa-search text-4xl"></i>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We couldn't find any services matching your search criteria. Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
