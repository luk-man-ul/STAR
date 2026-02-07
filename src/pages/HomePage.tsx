import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Ruler, Truck } from 'lucide-react';
import { ServiceCard, LoadingSpinner } from '../components';
import { Service } from '../types';
import { getAllServices } from '../services/firestoreService';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch services from Firebase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedServices = await getAllServices();
        setServices(fetchedServices);
      } catch (err: any) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBookAppointment = () => {
    navigate('/book');
  };

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
      <section id="services-section" className="px-4 py-12 bg-primary-50 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-8 md:mb-12">
            Our Services
          </h2>
          
          {loading ? (
            <LoadingSpinner text="Loading services..." className="py-12" />
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md mx-auto">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✂️</span>
              </div>
              <p className="text-slate-600 text-lg">No services available at the moment.</p>
              <p className="text-slate-500 mt-2">Please check back later.</p>
            </div>
          ) : (
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
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;