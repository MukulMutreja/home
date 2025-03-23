import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { apiRequest } from "@/lib/queryClient";
import MainNav from "@/components/layout/main-nav";
import Footer from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { Booking } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, CheckCircle, XCircle, AlertTriangle, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Initialize Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Payment form component
const CheckoutForm = ({ bookingId }: { bookingId: number }) => {
  const [, navigate] = useLocation();
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Redirect user to receipt page after successful payment
          return_url: window.location.origin + `/receipt/${bookingId}`,
        },
      });

      if (error) {
        setErrorMessage(error.message || "An error occurred during payment.");
        toast({
          title: "Payment Failed",
          description: error.message || "There was an error processing your payment.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred during payment.");
      toast({
        title: "Payment Error",
        description: error.message || "There was an unexpected error during payment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <PaymentElement />
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 text-sm">
          {errorMessage}
        </div>
      )}
      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          "Pay Now"
        )}
      </Button>
    </form>
  );
};

// Main checkout page
export default function CheckoutPage() {
  const [, params] = useRoute("/checkout/:bookingId");
  const [, navigate] = useLocation();
  const bookingId = params?.bookingId ? parseInt(params.bookingId) : null;
  const { user } = useAuth();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"initial" | "processing" | "success" | "error">("initial");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch booking details
  const { data: booking, isLoading: bookingLoading } = useQuery<Booking>({
    queryKey: [`/api/bookings/${bookingId}`],
    enabled: !!bookingId && !!user,
  });

  // Create a payment intent when the component loads
  useEffect(() => {
    if (!bookingId || !user) return;

    const createPaymentIntent = async () => {
      try {
        setPaymentStatus("processing");
        const response = await apiRequest("POST", "/api/create-payment-intent", { bookingId });
        const data = await response.json();

        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          setPaymentStatus("initial");
        } else {
          setPaymentStatus("error");
          setErrorMessage("Failed to initialize payment. Please try again.");
          toast({
            title: "Payment Initialization Failed",
            description: "We couldn't set up your payment. Please try again later.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        setPaymentStatus("error");
        setErrorMessage(error.message || "An error occurred while setting up payment.");
        toast({
          title: "Payment Setup Error",
          description: error.message || "There was an error setting up your payment.",
          variant: "destructive",
        });
      }
    };

    createPaymentIntent();
  }, [bookingId, user, toast]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect to auth
  }

  if (bookingLoading || !booking) {
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
                  <Skeleton className="h-32 w-full mb-6" />
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

  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-6" 
            onClick={() => navigate(`/booking/${booking.providerId}`)}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to booking
          </Button>

          <h1 className="text-3xl font-extrabold text-gray-900 font-poppins mb-6">Complete Your Payment</h1>

          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>
                Please complete your payment to confirm your booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 py-4 px-6 bg-gray-50 rounded-lg border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID</span>
                    <span className="font-medium">#{booking.id}</span>
                  </div>
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
                </div>
                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-gray-800">Total Amount</span>
                    <span className="text-lg">₹{booking.amount}</span>
                  </div>
                </div>
              </div>

              {paymentStatus === "processing" && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-lg text-gray-700 font-medium">Setting up your payment...</p>
                </div>
              )}

              {paymentStatus === "error" && (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
                  <h3 className="text-lg text-gray-900 font-medium mb-2">Payment Setup Failed</h3>
                  <p className="text-gray-600 mb-4 text-center">{errorMessage || "There was an error setting up your payment"}</p>
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="outline"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {paymentStatus === "initial" && clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm bookingId={booking.id} />
                </Elements>
              )}
            </CardContent>
            <CardFooter className="text-sm text-gray-500 border-t pt-4">
              <p>
                Your payment is securely processed by Stripe. We do not store your card details.
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}