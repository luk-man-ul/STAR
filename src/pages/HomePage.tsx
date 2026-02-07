import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Ruler, Truck } from 'lucide-react';
import { ServiceCard } from '../components';
import { Service } from '../types';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate('/book');
  };

  // Mock service data
  const services: Service[] = [
    {
      id: 'blouse',
      name: 'Blouse Stitching',
      description: 'Custom blouse stitching with perfect fit and elegant designs',
      category: 'blouse',
      estimatedDays: 3,
      requiresMeasurements: true,
      pricing: [
        {
          type: 'Simple Blouse',
          price: 500,
          description: 'Basic blouse with standard design'
        },
        {
          type: 'Designer Blouse',
          price: 800,
          description: 'Intricate designs with embellishments'
        },
        {
          type: 'Heavy Work Blouse',
          price: 1200,
          description: 'Premium blouse with heavy embroidery'
        }
      ]
    },
    {
      id: 'kurti',
      name: 'Kurti Stitching',
      description: 'Comfortable and stylish kurti designs for everyday wear',
      category: 'kurti',
      estimatedDays: 4,
      requiresMeasurements: true,
      pricing: [
        {
          type: 'Cotton Kurti',
          price: 600,
          description: 'Comfortable cotton kurti for daily wear'
        },
        {
          type: 'Silk Kurti',
          price: 900,
          description: 'Elegant silk kurti for special occasions'
        },
        {
          type: 'Embroidered Kurti',
          price: 1100,
          description: 'Beautiful embroidered kurti with detailed work'
        }
      ]
    },
    {
      id: 'bridal',
      name: 'Bridal Wear',
      description: 'Exquisite bridal outfits for your special day',
      category: 'bridal',
      estimatedDays: 14,
      requiresMeasurements: true,
      pricing: [
        {
          type: 'Lehenga Set',
          price: 5000,
          description: 'Complete bridal lehenga with blouse and dupatta'
        },
        {
          type: 'Saree Blouse',
          price: 2000,
          description: 'Designer blouse for bridal saree'
        },
        {
          type: 'Custom Bridal Outfit',
          price: 8000,
          description: 'Fully customized bridal wear with premium fabrics'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Hero Section */}
      <section className="px-4 pt-8 pb-12 text-center md:pt-16 md:pb-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            Welcome to Our Stitching Center
          </h1>
          <p className="text-text-secondary text-lg md:text-xl mb-8 max-w-md mx-auto">
            Custom dress stitching with perfect fit and timely delivery
          </p>
          <button
            onClick={handleBookAppointment}
            className="bg-primary-600 text-white px-8 py-4 rounded-button text-lg font-semibold min-h-touch min-w-touch hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label="Book an appointment for dress stitching"
          >
            Book Appointment
          </button>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="px-4 py-12 bg-white md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-8 md:mb-12">
            How it Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-md mx-auto md:max-w-none">
            {/* Step 1 */}
            <div className="flex items-start space-x-4 md:flex-col md:items-center md:text-center md:space-x-0 md:space-y-4">
              <div className="bg-primary-100 p-3 rounded-full flex-shrink-0">
                <Scissors className="w-6 h-6 text-primary-600" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Choose Style</h3>
                <p className="text-text-secondary">
                  Browse our collection and select your preferred dress style
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-4 md:flex-col md:items-center md:text-center md:space-x-0 md:space-y-4">
              <div className="bg-primary-100 p-3 rounded-full flex-shrink-0">
                <Ruler className="w-6 h-6 text-primary-600" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Get Measured</h3>
                <p className="text-text-secondary">
                  Visit our shop for precise measurements or provide your own
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-4 md:flex-col md:items-center md:text-center md:space-x-0 md:space-y-4">
              <div className="bg-primary-100 p-3 rounded-full flex-shrink-0">
                <Truck className="w-6 h-6 text-primary-600" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Doorstep Delivery</h3>
                <p className="text-text-secondary">
                  Receive your perfectly stitched dress at your doorstep
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-4 py-12 bg-primary-50 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-8 md:mb-12">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-md mx-auto md:max-w-none">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                name={service.name}
                description={service.description}
                pricing={service.pricing}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;