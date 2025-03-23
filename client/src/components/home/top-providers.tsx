import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceProvider, User } from "@shared/schema";

// This is a mock component since we don't have actual provider data in our initial setup
export default function TopProviders() {
  // In a real application, this would fetch from the API
  const { data: providers, isLoading } = useQuery<ServiceProvider[]>({
    queryKey: ["/api/providers"],
    enabled: false, // Disable the query since we don't have real provider data yet
  });
  
  // Placeholder data for display purposes
  const topProviders = [
    {
      id: 1,
      name: "Rajesh Kumar",
      profession: "Electrician",
      rating: 4.8,
      reviewCount: 234,
      description: "Rajesh has 8+ years of experience in electrical installations and troubleshooting. Certified & insured.",
      skills: ["Circuit Repair", "Fan Installation", "Wiring"]
    },
    {
      id: 2,
      name: "Priya Sharma",
      profession: "Home Cleaning",
      rating: 5.0,
      reviewCount: 186,
      description: "Priya specializes in deep cleaning services with eco-friendly products. 5+ years experience in residential cleaning.",
      skills: ["Deep Cleaning", "Kitchen Sanitizing", "Bathroom Cleaning"]
    },
    {
      id: 3,
      name: "Vikram Singh",
      profession: "Plumber",
      rating: 4.1,
      reviewCount: 157,
      description: "Vikram is a licensed plumber with expertise in leak repair, installation, and maintenance. 10+ years experience.",
      skills: ["Leak Repair", "Tap Installation", "Drainage Issues"]
    }
  ];

  // Generate star rating display
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Our Experts</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-secondary-900 sm:text-4xl font-poppins">
            Top-Rated Service Providers
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Meet some of our highest rated professionals with proven track records
          </p>
        </div>

        <div className="mt-12">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <div className="ml-4">
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-5/6 mb-4" />
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                    </div>
                    <div className="mt-5">
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {topProviders.map((provider) => (
                <Card key={provider.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        <i className="fas fa-user text-gray-300 text-2xl"></i>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-bold text-secondary-900">{provider.name}</h3>
                        <p className="text-primary-600 font-medium">{provider.profession}</p>
                        <div className="flex mt-1 text-amber-400">
                          {renderStars(provider.rating)}
                          <span className="ml-1 text-gray-500 text-sm">{provider.rating} ({provider.reviewCount} reviews)</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-500 text-sm">
                        "{provider.description}"
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {provider.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-5">
                      <Link href={`/provider/${provider.id}`}>
                        <Button className="w-full">Book Now</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link href="/services">
            <Button variant="outline" className="inline-flex items-center px-6 py-3">
              View All Professionals
              <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
