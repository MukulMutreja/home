import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Services routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid service ID" });
      }
      
      const service = await storage.getService(id);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json(service);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/services/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const services = await storage.getServicesByCategory(category);
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Service Providers routes
  app.get("/api/providers", async (req, res) => {
    try {
      const providers = await storage.getServiceProviders();
      res.json(providers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/providers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid provider ID" });
      }
      
      const provider = await storage.getServiceProvider(id);
      if (!provider) {
        return res.status(404).json({ message: "Service provider not found" });
      }
      
      res.json(provider);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/providers/service/:serviceId", async (req, res) => {
    try {
      const serviceId = parseInt(req.params.serviceId);
      if (isNaN(serviceId)) {
        return res.status(400).json({ message: "Invalid service ID" });
      }
      
      const providers = await storage.getServiceProvidersByService(serviceId);
      res.json(providers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Booking routes
  app.post("/api/bookings", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const bookingSchema = z.object({
        providerId: z.number(),
        serviceId: z.number(),
        date: z.string().transform(str => new Date(str)),
        address: z.string(),
        amount: z.number()
      });
      
      const parseResult = bookingSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid booking data", errors: parseResult.error });
      }
      
      const booking = await storage.createBooking({
        ...parseResult.data,
        userId: req.user!.id,
        status: "pending",
        paymentStatus: "pending"
      });
      
      res.status(201).json(booking);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const bookings = await storage.getBookingsByUser(req.user!.id);
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }
      
      const booking = await storage.getBooking(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if the booking belongs to the user
      if (booking.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }
      
      const { status } = req.body;
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const booking = await storage.getBooking(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      // Check if the booking belongs to the user
      if (booking.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updatedBooking = await storage.updateBookingStatus(id, status);
      res.json(updatedBooking);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Reviews routes
  app.post("/api/reviews", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      const reviewSchema = z.object({
        providerId: z.number(),
        bookingId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional()
      });
      
      const parseResult = reviewSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ message: "Invalid review data", errors: parseResult.error });
      }
      
      // Check if the booking exists and belongs to the user
      const booking = await storage.getBooking(parseResult.data.bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      if (booking.userId !== req.user!.id) {
        return res.status(403).json({ message: "You can only review your own bookings" });
      }
      
      const review = await storage.createReview({
        ...parseResult.data,
        userId: req.user!.id
      });
      
      res.status(201).json(review);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/reviews/provider/:providerId", async (req, res) => {
    try {
      const providerId = parseInt(req.params.providerId);
      if (isNaN(providerId)) {
        return res.status(400).json({ message: "Invalid provider ID" });
      }
      
      const reviews = await storage.getReviewsByProvider(providerId);
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe Payment Routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { bookingId } = req.body;
      if (!bookingId) {
        return res.status(400).json({ message: "Booking ID is required" });
      }

      // Get the booking
      const booking = await storage.getBooking(Number(bookingId));
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Check if the booking belongs to the user
      if (booking.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(booking.amount * 100), // amount in cents
        currency: "inr",
        metadata: {
          bookingId: booking.id.toString(),
          userId: req.user!.id.toString(),
          serviceId: booking.serviceId.toString(),
          providerId: booking.providerId.toString()
        }
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        bookingId: booking.id
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update booking payment status
  app.patch("/api/bookings/:id/payment", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }

      const { paymentStatus, paymentIntentId } = req.body;
      if (!paymentStatus || typeof paymentStatus !== 'string') {
        return res.status(400).json({ message: "Payment status is required" });
      }

      const booking = await storage.getBooking(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Check if the booking belongs to the user
      if (booking.userId !== req.user!.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Update the booking payment status
      const updatedBooking = await storage.updateBookingStatus(
        id, 
        booking.status, // Keep the current booking status
        paymentStatus
      );

      // If payment is successful, also update the booking status to confirmed
      if (paymentStatus === "paid") {
        await storage.updateBookingStatus(id, "confirmed", paymentStatus);
      }

      res.json(updatedBooking);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe webhook for payment events
  app.post("/api/webhook", async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    let event;

    // Verify the webhook signature
    try {
      // This will throw an error if the signature is invalid
      event = stripe.webhooks.constructEvent(
        req.body, 
        sig, 
        process.env.STRIPE_WEBHOOK_SECRET || "whsec_test"
      );
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle specific events
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Update booking payment status
        if (paymentIntent.metadata?.bookingId) {
          try {
            await storage.updateBookingStatus(
              Number(paymentIntent.metadata.bookingId),
              "confirmed", // Update status to confirmed
              "paid" // Update payment status to paid
            );
          } catch (error) {
            console.error("Error updating booking status:", error);
          }
        }
        break;
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object;
        // Update booking payment status
        if (failedPaymentIntent.metadata?.bookingId) {
          try {
            await storage.updateBookingStatus(
              Number(failedPaymentIntent.metadata.bookingId),
              "pending", // Keep status as pending
              "failed" // Update payment status to failed
            );
          } catch (error) {
            console.error("Error updating booking status:", error);
          }
        }
        break;
      // You can handle other events here
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}
