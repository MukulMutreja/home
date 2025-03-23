import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Booking } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import MainNav from "@/components/layout/main-nav";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ReceiptPage() {
  const [, params] = useRoute("/receipt/:bookingId");
  const [, navigate] = useLocation();
  const bookingId = params?.bookingId ? parseInt(params.bookingId) : null;
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentStatus, setPaymentStatus] = useState<"success" | "processing" | "failed" | "unknown">("unknown");
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch booking details
  const { data: booking, isLoading: bookingLoading, refetch: refetchBooking } = useQuery<Booking>({
    queryKey: [`/api/bookings/${bookingId}`],
    enabled: !!bookingId && !!user,
  });

  // Determine payment status from URL parameters when the component mounts
  useEffect(() => {
    const checkPaymentStatus = async () => {
      // Check URL for payment intent and redirect status
      const query = new URLSearchParams(window.location.search);
      const paymentIntent = query.get('payment_intent');
      const redirectStatus = query.get('redirect_status');

      if (!paymentIntent) {
        setPaymentStatus("unknown");
        return;
      }

      // Map Stripe redirect status to our status
      if (redirectStatus === "succeeded") {
        setPaymentStatus("success");
        // Update booking payment status
        if (bookingId) {
          try {
            setIsUpdating(true);
            await apiRequest("PATCH", `/api/bookings/${bookingId}/payment`, {
              paymentStatus: "paid",
              paymentIntentId: paymentIntent
            });
            // Refetch the booking to get the updated status
            await refetchBooking();
            toast({
              title: "Payment Successful",
              description: "Your booking has been confirmed.",
              variant: "default",
            });
          } catch (error: any) {
            console.error("Error updating booking payment status:", error);
            toast({
              title: "Status Update Error",
              description: "Your payment was successful, but we couldn't update your booking status.",
              variant: "destructive",
            });
          } finally {
            setIsUpdating(false);
          }
        }
      } else if (redirectStatus === "processing") {
        setPaymentStatus("processing");
      } else {
        setPaymentStatus("failed");
      }
    };

    checkPaymentStatus();
  }, [bookingId, refetchBooking, toast]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect to auth
  }

  if (bookingLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-grow bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="animate-pulse">
              <Skeleton className="h-8 w-64 mb-8" />
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-60" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-48 w-full mb-6" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col min-h-screen">
        <MainNav />
        <main className="flex-grow bg-gray-50 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mx-auto mb-4">
              <XCircle className="h-12 w-12" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h1>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              We couldn't find the booking you're looking for. It may have been removed or you may not have permission to view it.
            </p>
            <Button onClick={() => navigate("/")}>
              Go to Home
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-extrabold text-gray-900 font-poppins mb-6">Payment Receipt</h1>

          <Card>
            <CardHeader>
              <CardTitle>
                {paymentStatus === "success" && "Payment Successful"}
                {paymentStatus === "processing" && "Payment Processing"}
                {paymentStatus === "failed" && "Payment Failed"}
                {paymentStatus === "unknown" && "Payment Status"}
              </CardTitle>
              <CardDescription>
                Booking #{booking.id} on {new Date(booking.date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isUpdating ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600 mr-3" />
                  <span className="text-gray-700">Updating your booking...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-center py-6">
                    {paymentStatus === "success" && (
                      <div className="text-center">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Completed</h2>
                        <p className="text-gray-600">
                          Your booking has been confirmed and the service provider has been notified.
                        </p>
                      </div>
                    )}
                    {paymentStatus === "processing" && (
                      <div className="text-center">
                        <Clock className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Processing</h2>
                        <p className="text-gray-600">
                          Your payment is being processed. We'll confirm your booking once the payment is complete.
                        </p>
                      </div>
                    )}
                    {paymentStatus === "failed" && (
                      <div className="text-center">
                        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Failed</h2>
                        <p className="text-gray-600">
                          There was an issue processing your payment. Please try again or use a different payment method.
                        </p>
                      </div>
                    )}
                    {paymentStatus === "unknown" && (
                      <div className="text-center">
                        <Loader2 className="h-16 w-16 text-gray-400 animate-spin mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Checking Payment Status</h2>
                        <p className="text-gray-600">
                          We're checking the status of your payment. This may take a moment.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 py-4 px-6 bg-gray-50 rounded-lg border">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Date</span>
                        <span className="font-medium">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Time</span>
                        <span className="font-medium">{new Date(booking.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address</span>
                        <span className="font-medium">{booking.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className="font-medium capitalize">
                          {booking.status}
                          {booking.paymentStatus && ` (Payment: ${booking.paymentStatus})`}
                        </span>
                      </div>
                    </div>
                    <div className="border-t mt-4 pt-4">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-gray-800">Total Amount</span>
                        <span className="text-lg">₹{booking.amount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center gap-4 border-t pt-6">
              {paymentStatus === "success" && (
                <Button onClick={() => navigate("/")}>
                  Return to Home
                </Button>
              )}
              {paymentStatus === "processing" && (
                <Button onClick={() => window.location.reload()}>
                  Check Status
                </Button>
              )}
              {paymentStatus === "failed" && (
                <Button onClick={() => navigate(`/checkout/${booking.id}`)}>
                  Try Again
                </Button>
              )}
              {paymentStatus === "unknown" && (
                <Button onClick={() => window.location.reload()}>
                  Refresh Status
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}