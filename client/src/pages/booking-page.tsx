import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Service, ServiceProvider, insertBookingSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import MainNav from "@/components/layout/main-nav";
import Footer from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, ChevronLeft, ChevronRight, CalendarIcon, Clock, Check } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Extended booking schema with validation
const bookingSchema = z.object({
  date: z.date({
    required_error: "Please select a date and time.",
  }).refine(date => date > new Date(), {
    message: "Date must be in the future",
  }),
  timeSlot: z.string({
    required_error: "Please select a time slot.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  notes: z.string().optional(),
});

type BookingValues = z.infer<typeof bookingSchema>;

export default function BookingPage() {
  const [, params] = useRoute("/booking/:providerId");
  const [, navigate] = useLocation();
  const providerId = params?.providerId ? parseInt(params.providerId) : null;
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 9; i <= 20; i++) {
      const hour = i % 12 === 0 ? 12 : i % 12;
      const ampm = i < 12 ? 'AM' : 'PM';
      slots.push(`${hour}:00 ${ampm}`);
      if (i < 20) {
        slots.push(`${hour}:30 ${ampm}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

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

  // Form setup
  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      date: addDays(new Date(), 1),
      timeSlot: "10:00 AM",
      address: user?.address || "",
      notes: "",
    },
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/bookings", data);
      return res.json();
    },
    onSuccess: (booking) => {
      toast({
        title: "Booking Created",
        description: "Please proceed to payment to confirm your booking.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      // Redirect to checkout page with the booking ID
      navigate(`/checkout/${booking.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error creating your booking.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: BookingValues) => {
    if (!providerId || !service || !user) {
      toast({
        title: "Booking Failed",
        description: "Missing required information. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Format date with time slot
    const [time, period] = data.timeSlot.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    const bookingDate = new Date(data.date);
    bookingDate.setHours(hour, parseInt(minutes) || 0, 0);

    createBookingMutation.mutate({
      providerId,
      serviceId: service.id,
      date: bookingDate.toISOString(),
      address: data.address,
      amount: service.price,
      notes: data.notes
    });
  };

  if (!user) {
    return null; // Will redirect to auth page
  }

  if (providerLoading || serviceLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-grow bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse">
              <Skeleton className="h-8 w-64 mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <Skeleton className="h-10 w-full mb-6" />
                  <Skeleton className="h-48 w-full mb-6" />
                  <Skeleton className="h-24 w-full mb-6" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-64 w-full rounded-lg" />
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
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-4xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Provider Not Found</h1>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              The service provider you're looking for doesn't exist or may have been removed.
            </p>
            <Button onClick={() => navigate("/services")}>
              Browse Services
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mb-2" 
              onClick={() => navigate(`/services/${service.id}`)}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to service
            </Button>
            <h1 className="text-3xl font-extrabold text-gray-900 font-poppins">Book {service.name}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                  <CardDescription>
                    Fill in the details to book your service appointment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Service Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => 
                                    date < new Date() || // Can't book in the past
                                    date > addDays(new Date(), 30) // Can't book more than 30 days in advance
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              Choose a date for your service appointment
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="timeSlot"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time Slot</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a time slot" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timeSlots.map((slot) => (
                                  <SelectItem key={slot} value={slot}>
                                    {slot}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Select your preferred time slot
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Address</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter your complete address"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Provide the complete address where you need the service
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Notes</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Any specific instructions or details..."
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Optional: Add any specific requirements or information for the service provider
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Confirm Booking"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b">
                    <div className="h-16 w-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
                      <i className={`${service.image} text-2xl`}></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <p className="text-gray-500">Service ID: {service.id}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Service Provider</p>
                    <p className="font-medium">Provider #{provider.id}</p>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base price</span>
                      <span className="font-medium">₹{service.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service charges</span>
                      <span className="font-medium">₹{Math.round(service.price * 0.05)}</span>
                    </div>
                    <div className="flex justify-between pt-4 border-t">
                      <span className="text-gray-800 font-medium">Total amount</span>
                      <span className="font-bold text-lg">₹{service.price + Math.round(service.price * 0.05)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>Free cancellation before 2 hours</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>Pay after service completion</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>100% service guarantee</span>
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
