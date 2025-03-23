import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function JoinAsPro() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div className="order-2 lg:order-1">
            <div className="rounded-lg shadow-lg overflow-hidden bg-gray-200 h-80 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 600 400" fill="none">
                <rect width="600" height="400" fill="#f3f4f6"/>
                <circle cx="300" cy="160" r="60" fill="#ffffff"/>
                <path d="M280 140C280 140 290 160 300 180C310 200 320 220 320 220" stroke="#3b82f6" strokeWidth="10" strokeLinecap="round"/>
                <path d="M250 180C250 180 270 170 300 150C330 130 350 130 350 130" stroke="#3b82f6" strokeWidth="10" strokeLinecap="round"/>
                <rect x="260" y="230" width="80" height="120" rx="10" fill="#ffffff"/>
                <rect x="180" y="260" width="60" height="90" rx="5" fill="#dbeafe"/>
                <rect x="360" y="260" width="60" height="90" rx="5" fill="#dbeafe"/>
                <circle cx="300" cy="350" r="20" fill="#3b82f6"/>
                <rect x="0" y="350" width="600" height="50" fill="#bfdbfe"/>
                <circle cx="200" cy="80" r="20" fill="#dbeafe"/>
                <circle cx="400" cy="100" r="15" fill="#dbeafe"/>
                <circle cx="100" cy="180" r="25" fill="#dbeafe"/>
                <circle cx="500" cy="220" r="30" fill="#dbeafe"/>
              </svg>
            </div>
          </div>
          <div className="mb-10 lg:mb-0 order-1 lg:order-2">
            <h2 className="text-3xl font-extrabold text-secondary-900 sm:text-4xl font-poppins">
              Become a Service Provider
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Join our network of skilled professionals and grow your business. Set your own schedule and earn more with Sewa.in.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary-600 text-white">
                    <i className="fas fa-money-bill-wave"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-secondary-900">Earn More</h3>
                  <p className="mt-1 text-sm text-gray-500">Get consistent work and higher earnings with our platform fees lower than the industry average.</p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary-600 text-white">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-secondary-900">Flexible Schedule</h3>
                  <p className="mt-1 text-sm text-gray-500">Choose when you want to work. Accept only the jobs that fit your schedule and skills.</p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary-600 text-white">
                    <i className="fas fa-chart-line"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-secondary-900">Career Growth</h3>
                  <p className="mt-1 text-sm text-gray-500">Access to training, certification programs, and opportunities to upskill and increase your earnings.</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Link href="/auth?provider=true">
                <Button className="inline-flex items-center px-6 py-3 shadow-sm">
                  Apply as Provider
                  <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
