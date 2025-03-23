export default function HowItWorks() {
  return (
    <div className="bg-gray-50 py-16" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Process</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-secondary-900 sm:text-4xl font-poppins">
            How Sewa.in Works
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Getting quality home services has never been this easy
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary-100 text-primary-600 text-2xl font-bold mb-5">
                1
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">Book Service</h3>
              <p className="text-gray-500">
                Select a service, choose your preferred time slot, and provide your address details.
              </p>
              <div className="mt-5 rounded-lg shadow-md w-full h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 400 300" fill="none">
                  <rect width="400" height="300" fill="#f3f4f6"/>
                  <rect x="100" y="50" width="200" height="200" rx="10" fill="#ffffff"/>
                  <rect x="120" y="70" width="160" height="30" rx="5" fill="#dbeafe"/>
                  <rect x="120" y="110" width="160" height="30" rx="5" fill="#dbeafe"/>
                  <rect x="120" y="150" width="160" height="30" rx="5" fill="#dbeafe"/>
                  <rect x="150" y="200" width="100" height="30" rx="5" fill="#3b82f6"/>
                  <circle cx="360" cy="40" r="25" fill="#3b82f6" fillOpacity="0.2"/>
                  <circle cx="40" cy="260" r="25" fill="#3b82f6" fillOpacity="0.2"/>
                </svg>
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary-100 text-primary-600 text-2xl font-bold mb-5">
                2
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">Professional Arrives</h3>
              <p className="text-gray-500">
                A verified professional will arrive at your doorstep at the scheduled time.
              </p>
              <div className="mt-5 rounded-lg shadow-md w-full h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 400 300" fill="none">
                  <rect width="400" height="300" fill="#f3f4f6"/>
                  <rect x="140" y="70" width="120" height="180" rx="10" fill="#ffffff"/>
                  <rect x="160" y="90" width="80" height="120" rx="5" fill="#dbeafe"/>
                  <circle cx="200" cy="230" r="10" fill="#3b82f6"/>
                  <path d="M240 50C240 50 280 90 290 130C300 170 300 250 300 250H100C100 250 100 170 110 130C120 90 160 50 160 50H240Z" fill="#3b82f6" fillOpacity="0.1"/>
                  <circle cx="200" cy="130" r="30" fill="#ffffff"/>
                  <path d="M190 115C190 115 195 125 200 135C205 145 210 155 210 155" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M175 135C175 135 185 130 200 120C215 110 225 110 225 110" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary-100 text-primary-600 text-2xl font-bold mb-5">
                3
              </div>
              <h3 className="text-lg font-medium text-secondary-900 mb-2">Relax & Review</h3>
              <p className="text-gray-500">
                Sit back while the work is completed, then pay and share your feedback.
              </p>
              <div className="mt-5 rounded-lg shadow-md w-full h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 400 300" fill="none">
                  <rect width="400" height="300" fill="#f3f4f6"/>
                  <rect x="100" y="50" width="200" height="200" rx="10" fill="#ffffff"/>
                  <path d="M150 125L175 150L250 75" stroke="#3b82f6" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="200" cy="200" r="20" fill="#dbeafe"/>
                  <circle cx="250" cy="200" r="20" fill="#dbeafe"/>
                  <circle cx="150" cy="200" r="20" fill="#dbeafe"/>
                  <path d="M160 200L140 200" stroke="#3b82f6" strokeWidth="2"/>
                  <path d="M210 200L190 200" stroke="#3b82f6" strokeWidth="2"/>
                  <path d="M260 200L240 200" stroke="#3b82f6" strokeWidth="2"/>
                  <path d="M150 190L150 210" stroke="#3b82f6" strokeWidth="2"/>
                  <path d="M200 190L200 210" stroke="#3b82f6" strokeWidth="2"/>
                  <path d="M250 190L250 210" stroke="#3b82f6" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
