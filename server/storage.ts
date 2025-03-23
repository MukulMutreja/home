import { 
  users, type User, type InsertUser,
  services, type Service, type InsertService,
  serviceProviders, type ServiceProvider, type InsertServiceProvider,
  bookings, type Booking, type InsertBooking,
  reviews, type Review, type InsertReview
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

// Create the memory store for sessions
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Service methods
  getService(id: number): Promise<Service | undefined>;
  getServices(): Promise<Service[]>;
  getServicesByCategory(category: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  
  // ServiceProvider methods
  getServiceProvider(id: number): Promise<ServiceProvider | undefined>;
  getServiceProviders(): Promise<ServiceProvider[]>;
  getServiceProvidersByService(serviceId: number): Promise<ServiceProvider[]>;
  createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider>;
  updateServiceProviderRating(id: number, rating: number): Promise<ServiceProvider>;
  
  // Booking methods
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByUser(userId: number): Promise<Booking[]>;
  getBookingsByProvider(providerId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string, paymentStatus?: string): Promise<Booking>;
  
  // Review methods
  getReview(id: number): Promise<Review | undefined>;
  getReviewsByProvider(providerId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Session storage
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private services: Map<number, Service>;
  private serviceProviders: Map<number, ServiceProvider>;
  private bookings: Map<number, Booking>;
  private reviews: Map<number, Review>;
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private serviceIdCounter: number;
  private providerIdCounter: number;
  private bookingIdCounter: number;
  private reviewIdCounter: number;

  constructor() {
    this.users = new Map();
    this.services = new Map();
    this.serviceProviders = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    
    this.userIdCounter = 1;
    this.serviceIdCounter = 1;
    this.providerIdCounter = 1;
    this.bookingIdCounter = 1;
    this.reviewIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize with some services
    this.initializeServices();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...userData, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Service methods
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      (service) => service.category === category
    );
  }

  async createService(serviceData: InsertService): Promise<Service> {
    const id = this.serviceIdCounter++;
    const service: Service = { ...serviceData, id, createdAt: new Date() };
    this.services.set(id, service);
    return service;
  }

  // ServiceProvider methods
  async getServiceProvider(id: number): Promise<ServiceProvider | undefined> {
    return this.serviceProviders.get(id);
  }

  async getServiceProviders(): Promise<ServiceProvider[]> {
    return Array.from(this.serviceProviders.values());
  }

  async getServiceProvidersByService(serviceId: number): Promise<ServiceProvider[]> {
    return Array.from(this.serviceProviders.values()).filter(
      (provider) => provider.serviceId === serviceId
    );
  }

  async createServiceProvider(providerData: InsertServiceProvider): Promise<ServiceProvider> {
    const id = this.providerIdCounter++;
    const provider: ServiceProvider = { 
      ...providerData, 
      id, 
      rating: 0,
      reviewCount: 0,
      createdAt: new Date() 
    };
    this.serviceProviders.set(id, provider);
    return provider;
  }

  async updateServiceProviderRating(id: number, rating: number): Promise<ServiceProvider> {
    const provider = this.serviceProviders.get(id);
    if (!provider) {
      throw new Error(`ServiceProvider with ID ${id} not found`);
    }
    
    const newReviewCount = provider.reviewCount + 1;
    const newRating = Math.round(((provider.rating * provider.reviewCount) + rating) / newReviewCount);
    
    const updatedProvider = { 
      ...provider, 
      rating: newRating,
      reviewCount: newReviewCount
    };
    
    this.serviceProviders.set(id, updatedProvider);
    return updatedProvider;
  }

  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId
    );
  }

  async getBookingsByProvider(providerId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.providerId === providerId
    );
  }

  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const id = this.bookingIdCounter++;
    const booking: Booking = { ...bookingData, id, createdAt: new Date() };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingStatus(id: number, status: string, paymentStatus?: string): Promise<Booking> {
    const booking = this.bookings.get(id);
    if (!booking) {
      throw new Error(`Booking with ID ${id} not found`);
    }
    
    const updatedBooking = { 
      ...booking, 
      status,
      // Only update payment status if provided
      ...(paymentStatus && { paymentStatus })
    };
    
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Review methods
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getReviewsByProvider(providerId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.providerId === providerId
    );
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const review: Review = { ...reviewData, id, createdAt: new Date() };
    this.reviews.set(id, review);
    
    // Update provider rating
    await this.updateServiceProviderRating(reviewData.providerId, reviewData.rating);
    
    return review;
  }
  
  // Initialize the storage with some sample services
  private initializeServices() {
    const serviceCategories = [
      {
        name: "Plumbing",
        description: "Professional plumbing services for all your home needs",
        category: "plumbing",
        price: 299,
        image: "fas fa-wrench"
      },
      {
        name: "Electrical",
        description: "Expert electrical repair and installation services",
        category: "electrical",
        price: 349,
        image: "fas fa-bolt"
      },
      {
        name: "Cleaning",
        description: "Professional home cleaning services",
        category: "cleaning",
        price: 499,
        image: "fas fa-broom"
      },
      {
        name: "Painting",
        description: "Interior and exterior painting services",
        category: "painting",
        price: 1999,
        image: "fas fa-paint-roller"
      },
      {
        name: "Bathroom",
        description: "Bathroom repair and renovation services",
        category: "bathroom",
        price: 699,
        image: "fas fa-shower"
      },
      {
        name: "Appliance",
        description: "Appliance repair and maintenance services",
        category: "appliance",
        price: 399,
        image: "fas fa-tools"
      }
    ];
    
    for (const service of serviceCategories) {
      this.createService(service);
    }
  }
}

export const storage = new MemStorage();
