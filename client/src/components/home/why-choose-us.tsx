export default function WhyChooseUs() {
  const benefits = [
    {
      icon: "fas fa-user-check",
      title: "Verified Professionals",
      description: "All service providers undergo background checks and skill verification before joining our platform."
    },
    {
      icon: "fas fa-shield-alt",
      title: "Service Guarantee",
      description: "Not satisfied with a service? We'll send another professional or refund your payment."
    },
    {
      icon: "fas fa-rupee-sign",
      title: "Transparent Pricing",
      description: "Clear upfront pricing with no hidden charges. Pay only for what you book."
    },
    {
      icon: "fas fa-calendar-check",
      title: "On-time Service",
      description: "Our professionals arrive on schedule. If we're late, we offer a discount on your service."
    },
    {
      icon: "fas fa-headset",
      title: "24/7 Customer Support",
      description: "Our team is available around the clock to address any concerns or questions."
    },
    {
      icon: "fas fa-certificate",
      title: "Insured Services",
      description: "All our services come with insurance coverage for additional peace of mind."
    }
  ];

  return (
    <div className="bg-gray-50 py-16" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Benefits</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-secondary-900 sm:text-4xl font-poppins">
            Why Choose Sewa.in?
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            We're committed to providing the best home service experience
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-600 text-white">
                  <i className={benefit.icon}></i>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-secondary-900">{benefit.title}</h3>
                  <p className="mt-2 text-base text-gray-500">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
