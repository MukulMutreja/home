import { Card, CardContent } from "@/components/ui/card";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Rahul Gupta",
      location: "Delhi",
      rating: 5,
      comment: "The plumber arrived on time and fixed our leaking tap in less than 30 minutes. Very professional and cleaned up afterward. Will definitely use Sewa.in again!",
      service: "Plumbing Service",
      time: "2 weeks ago"
    },
    {
      name: "Ananya Patel",
      location: "Mumbai",
      rating: 4.5,
      comment: "I booked a deep cleaning service for my 2BHK apartment. The team was thorough and paid attention to every corner. My home hasn't been this clean in years!",
      service: "Home Cleaning",
      time: "1 month ago"
    },
    {
      name: "Sunil Mehta",
      location: "Bangalore",
      rating: 4,
      comment: "Rajesh did an excellent job fixing the electrical issues in my home. He explained everything clearly and suggested some energy-saving improvements too.",
      service: "Electrical Service",
      time: "3 weeks ago"
    }
  ];

  // Generate star rating display
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }
    
    return stars;
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-secondary-900 sm:text-4xl font-poppins">
            What Our Customers Say
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-50 rounded-xl shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        <i className="fas fa-user text-gray-300"></i>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-semibold text-secondary-900">{testimonial.name}</h4>
                        <p className="text-xs text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>
                    <div className="text-amber-400 flex">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600 text-sm">
                    "{testimonial.comment}"
                  </p>
                  <p className="mt-3 text-xs text-gray-500">{testimonial.service} • {testimonial.time}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <a href="#" className="inline-flex items-center text-primary-600 hover:text-primary-700">
            Read more customer reviews
            <i className="fas fa-long-arrow-alt-right ml-2"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
