import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link href="/">
              <div className="text-2xl font-bold font-poppins mb-4 cursor-pointer">sewa.in</div>
            </Link>
            <p className="text-gray-300 text-sm mb-4">
              India's most trusted home services platform connecting customers with verified service professionals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-base font-medium mb-4">Services</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link href="/services?category=cleaning"><a className="hover:text-white">Cleaning</a></Link></li>
              <li><Link href="/services?category=plumbing"><a className="hover:text-white">Plumbing</a></Link></li>
              <li><Link href="/services?category=electrical"><a className="hover:text-white">Electrical</a></Link></li>
              <li><Link href="/services?category=appliance"><a className="hover:text-white">Appliance Repair</a></Link></li>
              <li><Link href="/services?category=painting"><a className="hover:text-white">Painting</a></Link></li>
              <li><Link href="/services?category=carpentry"><a className="hover:text-white">Carpentry</a></Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><a href="#about" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-base font-medium mb-4">Support</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">FAQs</a></li>
              <li><a href="#" className="hover:text-white">Cancellation</a></li>
              <li><a href="#" className="hover:text-white">Refund Policy</a></li>
              <li><a href="#" className="hover:text-white">Safety</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">© {new Date().getFullYear()} Sewa.in. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <svg className="h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="8" fill="white"/>
              <path d="M15 19H33V29H15V19Z" fill="#F1F1F1"/>
              <path d="M18 33H30C31.6569 33 33 31.6569 33 30V27.5H15V30C15 31.6569 16.3431 33 18 33Z" fill="#3D5AFE"/>
              <path d="M30 15H18C16.3431 15 15 16.3431 15 18V20.5H33V18C33 16.3431 31.6569 15 30 15Z" fill="#FF9E01"/>
            </svg>
            <svg className="h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="8" fill="white"/>
              <path d="M29.778 19H33.5V29H29.778V19Z" fill="#FF5F00"/>
              <path d="M14.5 19H18.222V29H14.5V19Z" fill="#FF5F00"/>
              <path d="M18.222 24C18.222 21.794 19.316 19.857 21 19C19.316 18.143 18.222 16.206 18.222 14C18.222 11.794 19.316 9.857 21 9C22.684 8.143 24.316 8.143 26 9C27.684 9.857 28.778 11.794 28.778 14C28.778 16.206 27.684 18.143 26 19C27.684 19.857 28.778 21.794 28.778 24C28.778 26.206 27.684 28.143 26 29C24.316 29.857 22.684 29.857 21 29C19.316 28.143 18.222 26.206 18.222 24Z" fill="#EB001B"/>
              <path d="M33.5 24C33.5 26.206 32.406 28.143 30.722 29C29.038 29.857 27.406 29.857 25.722 29C24.038 28.143 22.944 26.206 22.944 24C22.944 21.794 24.038 19.857 25.722 19C27.406 18.143 29.038 18.143 30.722 19C32.406 19.857 33.5 21.794 33.5 24Z" fill="#F79E1B"/>
            </svg>
            <svg className="h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="8" fill="white"/>
              <path d="M34 24.4C34 29.828 29.628 34.2 24.2 34.2C18.772 34.2 14.4 29.828 14.4 24.4C14.4 18.972 18.772 14.6 24.2 14.6C29.628 14.6 34 18.972 34 24.4Z" fill="#73CBF8"/>
              <path d="M23.4 24.4H24.2H25.8V28.4C25.8 29.2836 25.0836 30 24.2 30C23.3164 30 22.6 29.2836 22.6 28.4V25.2C22.6 24.7582 22.9582 24.4 23.4 24.4Z" fill="#073A5F"/>
              <path d="M26.6 20.4C26.6 21.7255 25.5255 22.8 24.2 22.8C22.8745 22.8 21.8 21.7255 21.8 20.4C21.8 19.0745 22.8745 18 24.2 18C25.5255 18 26.6 19.0745 26.6 20.4Z" fill="#073A5F"/>
            </svg>
            <svg className="h-8" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="8" fill="white"/>
              <path d="M14 16H34V32H14V16Z" fill="#E2E8F0"/>
              <path d="M24 21L28.4641 28.5H19.5359L24 21Z" fill="#3B82F6"/>
              <path d="M24 21L19.5359 28.5H28.4641L24 21Z" fill="#3B82F6"/>
              <path d="M21.0359 24H26.9641L24 28.5L21.0359 24Z" fill="#3B82F6"/>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
