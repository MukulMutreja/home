import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Service, ServiceProvider } from "@shared/schema";
import MainNav from "@/components/layout/main-nav";
import Footer from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Check, Clock, ShieldCheck, Star, ChevronRight } from "lucide-react";

export default function ServiceDetailPage() {
  const [, params] = useRoute("/services/:id");
  const serviceId = params?.id ? parseInt(params.id) : null;
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch service details
  const { data: service, isLoading: serviceLoading } = useQuery<Service>({
    queryKey: [`/api/services/${serviceId}`],
    enabled: !!serviceId,
  });

  // Fetch service providers for this service
  const { data: providers, isLoading: providersLoading } = useQuery<ServiceProvider[]>({
    queryKey: [`/api/providers/service/${serviceId}`],
    enabled: !!serviceId,
  });

  // FAQs for the service (these would normally come from the API)
  const faqs = [
    {
      question: "What is included in this service?",
      answer: "Our service includes professional consultation, diagnostics, repairs, and clean-up after the work is completed. All materials and parts are charged separately based on requirements."
    },
    {
      question: "How long does the service usually take?",
      answer: "Service duration depends on the complexity of the job. Simple issues are typically resolved within 1-2 hours, while more complex problems may take 3-4 hours or require multiple visits."
    },
    {
      question: "Are your service providers certified?",
      answer: "Yes, all our service providers are certified, background-checked, and have undergone rigorous training in their respective fields to ensure high-quality service."
    },
    {
      question: "Do you offer any warranty on the service?",
      answer: "Yes, we provide a 30-day warranty on all services. If you face any issues with the work done, we'll send a professional to fix it at no additional cost."
    },
    {
      question: "What is your cancellation policy?",
      answer: "You can reschedule or cancel your booking up to 2 hours before the scheduled service time without any charges. Cancellations made less than 2 hours before the appointment may incur a nominal fee."
    }
  ];

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

  if (serviceLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse">
              <Skeleton className="h-12 w-2/3 mb-4" />
              <Skeleton className="h-6 w-1/3 mb-8" />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Skeleton className="h-64 w-full mb-8 rounded-lg" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-2/3 mb-8" />
                </div>
                <div>
                  <Skeleton className="h-72 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center px-4">
            <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-4xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h1>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              The service you're looking for doesn't exist or may have been removed.
            </p>
            <Link href="/services">
              <Button>Browse All Services</Button>
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
        {/* Service Header */}
        <div className="bg-primary-600 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <nav className="flex mb-4" aria-label="Breadcrumb">
                  <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                      <Link href="/">
                        <a className="inline-flex items-center text-sm font-medium text-primary-100 hover:text-white">
                          Home
                        </a>
                      </Link>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <ChevronRight className="h-4 w-4 text-primary-100" />
                        <Link href="/services">
                          <a className="ml-1 text-sm font-medium text-primary-100 hover:text-white md:ml-2">
                            Services
                          </a>
                        </Link>
                      </div>
                    </li>
                    <li aria-current="page">
                      <div className="flex items-center">
                        <ChevronRight className="h-4 w-4 text-primary-100" />
                        <span className="ml-1 text-sm font-medium text-white md:ml-2">
                          {service.name}
                        </span>
                      </div>
                    </li>
                  </ol>
                </nav>
                <h1 className="text-3xl font-extrabold text-white sm:text-4xl font-poppins">
                  {service.name}
                </h1>
                <p className="mt-2 text-lg text-primary-100">
                  Starting at ₹{service.price}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link href={user ? `/booking/${providersLoading || !providers?.length ? '1' : providers[0]?.id}` : "/auth"}>
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 hover:text-primary-700">
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="grid grid-cols-3 w-full lg:w-2/3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="providers">Providers</TabsTrigger>
                  <TabsTrigger value="faqs">FAQs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div className="bg-gray-100 aspect-video rounded-lg flex items-center justify-center">
                    <div className="h-24 w-24 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
                      <i className={`${service.image} text-5xl`}></i>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-secondary-900">About this service</h2>
                  <p className="text-gray-600">{service.description}</p>
                  
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-secondary-900 mb-4">Service Benefits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-base font-medium text-secondary-900">Expert Professionals</h4>
                          <p className="text-sm text-gray-500">Trained and certified technicians</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-base font-medium text-secondary-900">Quality Materials</h4>
                          <p className="text-sm text-gray-500">Only industry-grade materials used</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Clock className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-base font-medium text-secondary-900">On-time Service</h4>
                          <p className="text-sm text-gray-500">Punctual and efficient service</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <ShieldCheck className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-base font-medium text-secondary-900">30-Day Warranty</h4>
                          <p className="text-sm text-gray-500">All services come with a guarantee</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="providers" className="space-y-6">
                  <h2 className="text-2xl font-bold text-secondary-900 mb-4">Available Service Providers</h2>
                  
                  {providersLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, index) => (
                        <Card key={index} className="overflow-hidden">
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
                  ) : providers && providers.length > 0 ? (
                    <div className="space-y-4">
                      {providers.map((provider) => (
                        <Card key={provider.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-center">
                              <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                <i className="fas fa-user text-gray-300 text-2xl"></i>
                              </div>
                              <div className="ml-4">
                                <h3 className="text-lg font-bold text-secondary-900">Provider #{provider.id}</h3>
                                <p className="text-primary-600 font-medium">{service.name} Specialist</p>
                                <div className="flex mt-1">
                                  {renderStars(provider.rating || 0)}
                                  <span className="ml-1 text-gray-500 text-sm">
                                    {provider.rating || 0} ({provider.reviewCount || 0} reviews)
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <p className="text-gray-500 text-sm">
                                {provider.description || `Professional ${service.name} service provider with ${provider.experience || 0}+ years of experience.`}
                              </p>
                              <div className="mt-4 flex flex-wrap gap-2">
                                <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                                  {service.category}
                                </span>
                                <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                                  {provider.experience}+ Years
                                </span>
                                <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
                                  Certified
                                </span>
                              </div>
                            </div>
                            <div className="mt-5">
                              <Link href={user ? `/booking/${provider.id}` : "/auth"}>
                                <Button className="w-full">Book Now</Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 mx-auto mb-4">
                        <i className="fas fa-user-slash text-2xl"></i>
                      </div>
                      <h3 className="text-lg font-medium text-secondary-900 mb-2">No providers available</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        We don't have any providers for this service at the moment. Please check back later.
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="faqs" className="space-y-6">
                  <h2 className="text-2xl font-bold text-secondary-900 mb-4">Frequently Asked Questions</h2>
                  
                  <Accordion type="single" collapsible className="space-y-4">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-base font-medium text-secondary-900">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Booking Card */}
            <div>
              <Card className="sticky top-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-secondary-900 mb-4">Book This Service</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Base price</span>
                      <span className="font-medium">₹{service.price}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Additional charges</span>
                      <span className="font-medium">As per usage</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600 font-medium">Starting price</span>
                      <span className="font-bold text-lg">₹{service.price}</span>
                    </div>
                  </div>
                  
                  <Link href={user ? `/booking/${providersLoading || !providers?.length ? '1' : providers[0]?.id}` : "/auth"}>
                    <Button className="w-full mb-4">Book Now</Button>
                  </Link>
                  
                  <p className="text-sm text-gray-500 text-center">
                    No payment required until service is completed
                  </p>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center">
                      <ShieldCheck className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Secure payments</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Verified professionals</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Flexible scheduling</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
