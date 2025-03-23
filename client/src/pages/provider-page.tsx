import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Service, ServiceProvider, Review } from "@shared/schema";
import MainNav from "@/components/layout/main-nav";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Calendar, ChevronRight, MapPin, Clock, Phone, Mail, BriefcaseBusiness, Award, ThumbsUp } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

export default function ProviderPage() {
  const [, params] = useRoute("/provider/:id");
  const providerId = params?.id ? parseInt(params.id) : null;
  const { user } = useAuth();

  // Fetch provider details
  const { data: provider, isLoading: providerLoading } = useQuery<ServiceProvider>({
    queryKey: [`/api/providers/${providerId}`],
    enabled: !!providerId,
  });

  // Fetch service details
  const { data: service, isLoading: serviceLoading } = useQuery<Service>({
    queryKey: providerId && provider ? [`/api/services/${provider.serviceId}`] : null,
    enabled: !!providerId && !!provider?.serviceId,
  });

  // Fetch reviews for this provider
  const { data: reviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: [`/api/reviews/provider/${providerId}`],
    enabled: !!providerId,
  });

  // Generate star rating display
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-amber-400 text-amber-400 h-4 w-4" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <svg key="half" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 fill-amber-400 text-amber-400">
          <defs>
            <linearGradient id="half-gradient">
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path fill="url(#half-gradient)" stroke="currentColor" strokeWidth="2" d="M12 17.8 5.8 21 7 14.1 2 9.3l7-1L12 2l3 6.3 7 1-5 4.8 1.2 6.9-6.2-3.2z" />
        </svg>
      );
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-amber-400 h-4 w-4" />);
    }
    
    return stars;
  };

  const renderAvailabilityStatus = () => {
    // This would normally be dynamic based on provider data
    const isAvailable = true;
    return (
      <div className={`flex items-center ${isAvailable ? 'text-green-600' : 'text-red-500'}`}>
        <div className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-green-600' : 'bg-red-500'} mr-2`}></div>
        <span className="text-sm font-medium">{isAvailable ? 'Available Now' : 'Currently Unavailable'}</span>
      </div>
    );
  };

  if (providerLoading || serviceLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-grow">
          <div className="bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="animate-pulse">
                <Skeleton className="h-8 w-64 mb-8" />
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <Skeleton className="h-32 w-32 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-8 w-48 mb-2" />
                      <Skeleton className="h-6 w-32 mb-4" />
                      <div className="flex mb-2">
                        <Skeleton className="h-4 w-4 mr-1" />
                        <Skeleton className="h-4 w-4 mr-1" />
                        <Skeleton className="h-4 w-4 mr-1" />
                        <Skeleton className="h-4 w-4 mr-1" />
                        <Skeleton className="h-4 w-4 mr-2" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-6 w-32 mb-4" />
                      <div className="flex gap-2">
                        <Skeleton className="h-10 w-28" />
                        <Skeleton className="h-10 w-28" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <Skeleton className="h-10 w-full mb-6" />
                  <Skeleton className="h-32 w-full mb-4" />
                  <Skeleton className="h-32 w-full mb-4" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!provider || !service) {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center px-4">
            <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-4xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Provider Not Found</h1>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              The service provider you're looking for doesn't exist or may have been removed.
            </p>
            <Link href="/services">
              <Button>Browse Services</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-grow">
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link href="/">
                    <a className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
                      Home
                    </a>
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <Link href="/services">
                      <a className="ml-1 text-sm font-medium text-gray-500 hover:text-gray-700 md:ml-2">
                        Services
                      </a>
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <Link href={`/services/${service.id}`}>
                      <a className="ml-1 text-sm font-medium text-gray-500 hover:text-gray-700 md:ml-2">
                        {service.name}
                      </a>
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                      Provider #{provider.id}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* Provider Card */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center">
                      <i className="fas fa-user text-gray-300 text-5xl"></i>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">Provider #{provider.id}</h1>
                        <p className="text-primary-600 font-medium text-lg">{service.name} Specialist</p>
                        <div className="flex items-center mt-2 mb-4">
                          <div className="flex mr-2">
                            {renderStars(provider.rating || 0)}
                          </div>
                          <span className="text-gray-600 text-sm">
                            {provider.rating || 0} ({provider.reviewCount || 0} reviews)
                          </span>
                        </div>
                        {renderAvailabilityStatus()}
                      </div>
                      <div className="mt-4 md:mt-0 flex gap-2">
                        <Link href={user ? `/booking/${provider.id}` : "/auth"}>
                          <Button className="px-8">Book Now</Button>
                        </Link>
                        <Button variant="outline" className="px-4">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Service Area: Delhi NCR</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Response Time: 30 mins</span>
                  </div>
                  <div className="flex items-center">
                    <BriefcaseBusiness className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Experience: {provider.experience || 5}+ years</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Completed: 200+ jobs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Details Tabs */}
            <Tabs defaultValue="about" className="space-y-8">
              <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">About Provider</h2>
                    <p className="text-gray-600 mb-6">
                      {provider.description || `Professional service provider with over ${provider.experience || 5} years of experience in ${service.name.toLowerCase()}. Specializes in providing high-quality and reliable services to customers across the region.`}
                    </p>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {service.category}
                      </span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        Installation
                      </span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        Repair
                      </span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        Maintenance
                      </span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        Troubleshooting
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Certifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Award className="h-5 w-5 text-primary-600 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-900">Professional {service.name} Certification</h4>
                          <p className="text-gray-500 text-sm">Certified by National Skills Development Corporation</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Award className="h-5 w-5 text-primary-600 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-gray-900">Safety Standards Training</h4>
                          <p className="text-gray-500 text-sm">Completed advanced safety training protocols</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="services" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Services Offered</h2>
                    
                    <div className="space-y-6">
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{service.name}</h3>
                            <p className="text-gray-600 mt-1">{service.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-lg">₹{service.price}</p>
                            <p className="text-sm text-gray-500">Starting price</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-between items-center">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>~1 hour</span>
                          </div>
                          <Link href={user ? `/booking/${provider.id}` : "/auth"}>
                            <Button size="sm">Book Now</Button>
                          </Link>
                        </div>
                      </div>
                      
                      {/* These would normally be dynamically generated based on provider service offerings */}
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{service.name} Maintenance</h3>
                            <p className="text-gray-600 mt-1">Regular maintenance and check-up for your {service.name.toLowerCase()} systems.</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-lg">₹{Math.round(service.price * 0.8)}</p>
                            <p className="text-sm text-gray-500">Starting price</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-between items-center">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>~45 mins</span>
                          </div>
                          <Link href={user ? `/booking/${provider.id}` : "/auth"}>
                            <Button size="sm">Book Now</Button>
                          </Link>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">Emergency {service.name} Service</h3>
                            <p className="text-gray-600 mt-1">24/7 emergency services for urgent {service.name.toLowerCase()} issues.</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-lg">₹{Math.round(service.price * 1.5)}</p>
                            <p className="text-sm text-gray-500">Starting price</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-between items-center">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Express</span>
                          </div>
                          <Link href={user ? `/booking/${provider.id}` : "/auth"}>
                            <Button size="sm">Book Now</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {renderStars(provider.rating || 0)}
                        </div>
                        <span className="text-gray-600">
                          {provider.rating || 0} ({provider.reviewCount || 0} reviews)
                        </span>
                      </div>
                    </div>
                    
                    {reviewsLoading ? (
                      <div className="space-y-6">
                        {[...Array(3)].map((_, index) => (
                          <div key={index} className="border-b pb-6">
                            <div className="flex justify-between mb-3">
                              <div className="flex items-center">
                                <Skeleton className="h-10 w-10 rounded-full mr-3" />
                                <div>
                                  <Skeleton className="h-4 w-32 mb-1" />
                                  <Skeleton className="h-3 w-20" />
                                </div>
                              </div>
                              <Skeleton className="h-4 w-24" />
                            </div>
                            <div className="mb-2">
                              <Skeleton className="h-4 w-full mb-1" />
                              <Skeleton className="h-4 w-4/5" />
                            </div>
                            <Skeleton className="h-3 w-32" />
                          </div>
                        ))}
                      </div>
                    ) : reviews && reviews.length > 0 ? (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div key={review.id} className="border-b pb-6 last:border-b-0">
                            <div className="flex justify-between mb-3">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                  <i className="fas fa-user text-gray-300"></i>
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">User #{review.userId}</h4>
                                  <div className="flex">
                                    {renderStars(review.rating)}
                                  </div>
                                </div>
                              </div>
                              <span className="text-gray-500 text-sm">
                                {format(new Date(review.createdAt), 'MMM d, yyyy')}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">
                              {review.comment || "Great service! Would recommend to others."}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span>Helpful</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
                          <i className="fas fa-comment-slash text-2xl"></i>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          This provider doesn't have any reviews yet. Be the first to book and review their service!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
