import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import ServicesPage from "@/pages/services-page";
import ServiceDetailPage from "@/pages/service-detail-page";
import AuthPage from "@/pages/auth-page";
import BookingPage from "@/pages/booking-page";
import ProviderPage from "@/pages/provider-page";
import CheckoutPage from "@/pages/checkout-page";
import ReceiptPage from "@/pages/receipt-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/services/:id" component={ServiceDetailPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/booking/:providerId" component={BookingPage} />
      <Route path="/provider/:id" component={ProviderPage} />
      <ProtectedRoute path="/checkout/:bookingId" component={CheckoutPage} />
      <ProtectedRoute path="/receipt/:bookingId" component={ReceiptPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
