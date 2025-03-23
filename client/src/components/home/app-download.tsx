import { Button } from "@/components/ui/button";

export default function AppDownload() {
  return (
    <div className="bg-primary-600 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl font-poppins">
              Get the Sewa.in App
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              Book services, track professionals, make payments, and manage your bookings - all from your smartphone.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="bg-black text-white border-black hover:bg-gray-800 hover:text-white px-6 py-3 rounded-lg flex items-center justify-center sm:justify-start">
                <i className="fab fa-apple text-2xl mr-3"></i>
                <div>
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-medium">App Store</div>
                </div>
              </Button>
              <Button variant="outline" className="bg-black text-white border-black hover:bg-gray-800 hover:text-white px-6 py-3 rounded-lg flex items-center justify-center sm:justify-start">
                <i className="fab fa-google-play text-2xl mr-3"></i>
                <div>
                  <div className="text-xs">Get it on</div>
                  <div className="text-sm font-medium">Google Play</div>
                </div>
              </Button>
            </div>
            <div className="mt-8">
              <div className="flex items-center">
                <div className="text-xl font-bold text-white mr-3">4.8</div>
                <div className="text-amber-400 flex">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </div>
                <div className="ml-3 text-primary-100 text-sm">500+ reviews</div>
              </div>
            </div>
          </div>
          <div className="mt-10 lg:mt-0 flex justify-center">
            <div className="w-80 h-auto rounded-2xl shadow-xl bg-gray-200 overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 300 500" fill="none">
                <rect width="300" height="500" rx="20" fill="#ffffff"/>
                <rect x="0" y="0" width="300" height="60" fill="#3b82f6"/>
                <circle cx="30" cy="30" r="15" fill="#ffffff"/>
                <rect x="60" y="25" width="180" height="10" rx="5" fill="#ffffff" fillOpacity="0.8"/>
                <rect x="20" y="80" width="260" height="120" rx="10" fill="#dbeafe"/>
                <rect x="40" y="140" width="120" height="40" rx="5" fill="#3b82f6"/>
                <rect x="20" y="220" width="120" height="100" rx="10" fill="#f3f4f6"/>
                <rect x="30" y="280" width="100" height="10" rx="5" fill="#3b82f6"/>
                <rect x="30" y="300" width="80" height="10" rx="5" fill="#d1d5db"/>
                <rect x="160" y="220" width="120" height="100" rx="10" fill="#f3f4f6"/>
                <rect x="170" y="280" width="100" height="10" rx="5" fill="#3b82f6"/>
                <rect x="170" y="300" width="80" height="10" rx="5" fill="#d1d5db"/>
                <rect x="20" y="340" width="260" height="60" rx="10" fill="#f3f4f6"/>
                <circle cx="50" cy="370" r="20" fill="#dbeafe"/>
                <rect x="80" y="360" width="180" height="10" rx="5" fill="#3b82f6"/>
                <rect x="80" y="380" width="140" height="10" rx="5" fill="#d1d5db"/>
                <rect x="0" y="440" width="300" height="60" fill="#f3f4f6"/>
                <circle cx="50" cy="470" r="15" fill="#3b82f6"/>
                <circle cx="150" cy="470" r="15" fill="#d1d5db"/>
                <circle cx="250" cy="470" r="15" fill="#d1d5db"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
