import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg 
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" 
            fill="currentColor" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none" 
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-secondary-900 sm:text-5xl md:text-6xl font-poppins">
                <span className="block xl:inline">Quality Home Services</span>{" "}
                <span className="block text-primary-600 xl:inline">At Your Doorstep</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Book trusted professionals for 100+ services including plumbing, electrical work, cleaning, and more. Satisfaction guaranteed.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link href="/services">
                    <Button size="lg" className="w-full flex items-center justify-center px-8 py-3 md:py-4 md:text-lg md:px-10">
                      Book a Service
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link href="/auth?provider=true">
                    <Button size="lg" variant="outline" className="w-full flex items-center justify-center px-8 py-3 md:py-4 md:text-lg md:px-10">
                      Join as Provider
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full bg-gray-100 sm:h-72 md:h-96 lg:w-full lg:h-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full object-cover" viewBox="0 0 1200 800" fill="none">
            <rect width="1200" height="800" fill="#f3f4f6"/>
            <path d="M600 200C600 200 800 250 900 400C1000 550 1000 700 1000 700H200C200 700 200 550 300 400C400 250 600 200 600 200Z" fill="#dbeafe"/>
            <rect x="300" y="500" width="200" height="200" rx="10" fill="#ffffff"/>
            <rect x="360" y="570" width="80" height="80" rx="5" fill="#93c5fd"/>
            <rect x="700" y="550" width="150" height="150" rx="10" fill="#ffffff"/>
            <rect x="750" y="600" width="50" height="50" rx="5" fill="#93c5fd"/>
            <circle cx="600" cy="350" r="100" fill="#ffffff"/>
            <path d="M580 320C580 320 590 340 600 360C610 380 620 400 620 400" stroke="#93c5fd" strokeWidth="10" strokeLinecap="round"/>
            <path d="M550 380C550 380 570 370 600 350C630 330 650 330 650 330" stroke="#93c5fd" strokeWidth="10" strokeLinecap="round"/>
            <path d="M300 700C300 700 450 680 600 700C750 720 900 700 900 700" fill="#bfdbfe"/>
            <circle cx="400" cy="650" r="15" fill="#3b82f6"/>
            <circle cx="800" cy="680" r="10" fill="#3b82f6"/>
            <circle cx="700" cy="620" r="8" fill="#3b82f6"/>
            <circle cx="500" cy="620" r="6" fill="#3b82f6"/>
            <circle cx="600" cy="670" r="12" fill="#3b82f6"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
