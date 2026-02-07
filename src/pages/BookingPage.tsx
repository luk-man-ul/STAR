import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BookingData, Service } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { createOrder, getAllServices } from '../services/firestoreService';
import { LoadingSpinner } from '../components';

const BookingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BookingData>>({
    measurementType: 'shop'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 2;

  // Fetch services from Firebase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const fetchedServices = await getAllServices();
        setServices(fetchedServices);
      } catch (error) {
        console.error('Error fetching services:', error);
        setErrors({ services: 'Failed to load services. Please refresh the page.' });
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.serviceId) {
      newErrors.serviceId = 'Please select a service';
    }
    
    if (!formData.pricingTier) {
      newErrors.pricingTier = 'Please select a pricing tier';
    }
    
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Please select an appointment date';
    } else {
      const selectedDate = new Date(formData.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.appointmentDate = 'Appointment date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.measurementType === 'custom') {
      if (!formData.measurements) {
        newErrors.measurements = 'Please provide measurements';
        setErrors(newErrors);
        return false;
      }
      
      const { bust, waist, hip, sleeveLength, totalLength } = formData.measurements;
      
      if (!bust || bust <= 0) {
        newErrors.bust = 'Please enter a valid bust measurement';
      }
      if (!waist || waist <= 0) {
        newErrors.waist = 'Please enter a valid waist measurement';
      }
      if (!hip || hip <= 0) {
        newErrors.hip = 'Please enter a valid hip measurement';
      }
      if (!sleeveLength || sleeveLength <= 0) {
        newErrors.sleeveLength = 'Please enter a valid sleeve length';
      }
      if (!totalLength || totalLength <= 0) {
        newErrors.totalLength = 'Please enter a valid total length';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    
    if (currentStep === 1) {
      if (!validateStep1()) {
        return;
      }
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({}); // Clear errors when going back
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    if (!user) {
      setErrors({ submit: 'You must be logged in to create a booking' });
      return;
    }

    if (!formData.serviceId || !formData.appointmentDate) {
      setErrors({ submit: 'Please complete all required fields' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create order in Firebase
      const orderData: any = {
        customerId: user.id,
        serviceId: formData.serviceId,
        pricingTier: formData.pricingTier,
        status: 'pending',
        appointmentDate: formData.appointmentDate,
        specialInstructions: formData.measurementType === 'shop' 
          ? 'Customer will visit shop for measurements' 
          : 'Customer provided measurements'
      };
      
      // Only add measurements if they exist (custom measurements)
      if (formData.measurements) {
        orderData.measurements = formData.measurements;
      }
      
      const orderId = await createOrder(orderData);
      
      console.log('Order created successfully:', orderId);
      alert('Booking submitted successfully! Order ID: ' + orderId + '\n\nWe will contact you soon.');
      
      // Reset form
      setFormData({ measurementType: 'shop' });
      setCurrentStep(1);
      setErrors({});
      
      // Redirect to home page after 1 second
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error: any) {
      console.error('Submission error:', error);
      setErrors({ submit: error.message || 'Failed to submit booking. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light p-4 md:py-8">
      <div className="max-w-md mx-auto md:max-w-2xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Book Appointment</h1>
          <p className="text-slate-600 mt-1">Schedule your dress stitching appointment</p>
        </div>

        {/* Loading Services */}
        {loadingServices ? (
          <LoadingSpinner text="Loading services..." className="py-12" />
        ) : errors.services ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-red-600">{errors.services}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-red-700 underline"
            >
              Refresh Page
            </button>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
            <p className="text-yellow-800">No services available. Please contact the administrator.</p>
          </div>
        ) : (
          <>
            {/* Progress Indicator */}
            <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-slate-500">
              {currentStep === 1 ? 'Service & Date' : 'Measurements'}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps} aria-label={`Booking progress: step ${currentStep} of ${totalSteps}`}>
            <div 
              className="bg-rose-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {currentStep === 1 && (
            <fieldset className="space-y-6">
              <legend className="sr-only">Service and appointment details</legend>
              {/* Service Selection */}
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-slate-700 mb-2">
                  Select Service *
                </label>
                <select
                  id="service"
                  value={formData.serviceId || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, serviceId: e.target.value, pricingTier: undefined });
                    if (errors.serviceId) {
                      setErrors({ ...errors, serviceId: '' });
                    }
                  }}
                  className={`w-full px-4 py-3 text-base border rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white min-h-[48px] ${
                    errors.serviceId ? 'border-red-500' : 'border-slate-300'
                  }`}
                  required
                >
                  <option value="">Choose a service...</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ₹{service.pricing[0].price}
                      {service.pricing.length > 1 && ` - ₹${service.pricing[service.pricing.length - 1].price}`}
                      {' '}({service.estimatedDays} days)
                    </option>
                  ))}
                </select>
                {errors.serviceId && (
                  <p className="text-red-500 text-sm mt-1">{errors.serviceId}</p>
                )}
              </div>

              {/* Pricing Tier Selection - Only show if service is selected and has multiple tiers */}
              {formData.serviceId && (() => {
                const selectedService = services.find(s => s.id === formData.serviceId);
                return selectedService && selectedService.pricing.length > 0 ? (
                  <div>
                    <label htmlFor="pricingTier" className="block text-sm font-medium text-slate-700 mb-2">
                      Select Pricing Tier *
                    </label>
                    <div className="space-y-2">
                      {selectedService.pricing.map((tier, index) => (
                        <label
                          key={index}
                          className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                            formData.pricingTier === tier.type
                              ? 'border-rose-500 bg-rose-50'
                              : 'border-slate-300 bg-white hover:border-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              id={`tier-${index}`}
                              name="pricingTier"
                              value={tier.type}
                              checked={formData.pricingTier === tier.type}
                              onChange={(e) => {
                                setFormData({ ...formData, pricingTier: e.target.value });
                                if (errors.pricingTier) {
                                  setErrors({ ...errors, pricingTier: '' });
                                }
                              }}
                              className="w-4 h-4 text-rose-600 border-slate-300 focus:ring-rose-500"
                              required
                            />
                            <div>
                              <div className="font-medium text-slate-800">{tier.type}</div>
                              {tier.description && (
                                <div className="text-sm text-slate-600">{tier.description}</div>
                              )}
                            </div>
                          </div>
                          <div className="text-lg font-bold text-rose-600">
                            ₹{tier.price}
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.pricingTier && (
                      <p className="text-red-500 text-sm mt-1">{errors.pricingTier}</p>
                    )}
                  </div>
                ) : null;
              })()}

              {/* Date Selection */}
              <div>
                <label htmlFor="appointmentDate" className="block text-sm font-medium text-slate-700 mb-2">
                  Appointment Date *
                </label>
                <input
                  type="date"
                  id="appointmentDate"
                  value={formData.appointmentDate ? formData.appointmentDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    setFormData({ 
                      ...formData, 
                      appointmentDate: e.target.value ? new Date(e.target.value) : undefined 
                    });
                    if (errors.appointmentDate) {
                      setErrors({ ...errors, appointmentDate: '' });
                    }
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 text-base border rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white min-h-[48px] ${
                    errors.appointmentDate ? 'border-red-500' : 'border-slate-300'
                  }`}
                  required
                />
                {errors.appointmentDate ? (
                  <p className="text-red-500 text-sm mt-1">{errors.appointmentDate}</p>
                ) : (
                  <p className="text-sm text-slate-500 mt-1">
                    Select your preferred appointment date
                  </p>
                )}
              </div>

              {/* Service Details */}
              {formData.serviceId && (
                <div className="bg-rose-50 p-4 rounded-2xl">
                  {(() => {
                    const selectedService = services.find(s => s.id === formData.serviceId);
                    return selectedService ? (
                      <div>
                        <h3 className="font-medium text-slate-800 mb-2">{selectedService.name}</h3>
                        <p className="text-sm text-slate-600 mb-2">{selectedService.description}</p>
                        
                        {/* Show all pricing tiers */}
                        <div className="space-y-1 mb-2">
                          {selectedService.pricing.map((tier, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-slate-600">{tier.type}:</span>
                              <span className="font-medium text-rose-600">₹{tier.price}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-between text-sm mt-1">
                          <span className="text-slate-600">Estimated Days:</span>
                          <span className="font-medium">{selectedService.estimatedDays} days</span>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </fieldset>
          )}

          {currentStep === 2 && (
            <fieldset className="space-y-6">
              <legend className="sr-only">Measurement details</legend>
              {/* Measurement Type Toggle */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Measurement Option *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, measurementType: 'shop', measurements: undefined })}
                    className={`p-4 rounded-2xl border-2 transition-all min-h-[48px] ${
                      formData.measurementType === 'shop'
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-medium">Measure at Shop</div>
                      <div className="text-xs mt-1">Visit our store</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, measurementType: 'custom' })}
                    className={`p-4 rounded-2xl border-2 transition-all min-h-[48px] ${
                      formData.measurementType === 'custom'
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-medium">Enter My Own</div>
                      <div className="text-xs mt-1">Provide measurements</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Custom Measurements Grid */}
              {formData.measurementType === 'custom' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-slate-800">Enter Your Measurements</h3>
                  <p className="text-sm text-slate-600">All measurements should be in inches</p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="bust" className="block text-sm font-medium text-slate-700 mb-1">
                        Bust *
                      </label>
                      <input
                        type="number"
                        id="bust"
                        step="0.5"
                        min="20"
                        max="60"
                        value={formData.measurements?.bust || ''}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            measurements: {
                              ...formData.measurements,
                              bust: parseFloat(e.target.value) || 0,
                              waist: formData.measurements?.waist || 0,
                              hip: formData.measurements?.hip || 0,
                              sleeveLength: formData.measurements?.sleeveLength || 0,
                              totalLength: formData.measurements?.totalLength || 0
                            }
                          });
                          if (errors.bust) {
                            setErrors({ ...errors, bust: '' });
                          }
                        }}
                        className={`w-full px-4 py-3 text-base border rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white min-h-[48px] ${
                          errors.bust ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="e.g. 34"
                        required
                      />
                      {errors.bust && (
                        <p className="text-red-500 text-sm mt-1">{errors.bust}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="waist" className="block text-sm font-medium text-slate-700 mb-1">
                        Waist *
                      </label>
                      <input
                        type="number"
                        id="waist"
                        step="0.5"
                        min="20"
                        max="50"
                        value={formData.measurements?.waist || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          measurements: {
                            ...formData.measurements,
                            bust: formData.measurements?.bust || 0,
                            waist: parseFloat(e.target.value) || 0,
                            hip: formData.measurements?.hip || 0,
                            sleeveLength: formData.measurements?.sleeveLength || 0,
                            totalLength: formData.measurements?.totalLength || 0
                          }
                        })}
                        className="w-full px-4 py-3 text-base border border-slate-300 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white min-h-[48px]"
                        placeholder="e.g. 28"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="hip" className="block text-sm font-medium text-slate-700 mb-1">
                        Hip *
                      </label>
                      <input
                        type="number"
                        id="hip"
                        step="0.5"
                        min="25"
                        max="60"
                        value={formData.measurements?.hip || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          measurements: {
                            ...formData.measurements,
                            bust: formData.measurements?.bust || 0,
                            waist: formData.measurements?.waist || 0,
                            hip: parseFloat(e.target.value) || 0,
                            sleeveLength: formData.measurements?.sleeveLength || 0,
                            totalLength: formData.measurements?.totalLength || 0
                          }
                        })}
                        className="w-full px-4 py-3 text-base border border-slate-300 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white min-h-[48px]"
                        placeholder="e.g. 36"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="sleeveLength" className="block text-sm font-medium text-slate-700 mb-1">
                        Sleeve Length *
                      </label>
                      <input
                        type="number"
                        id="sleeveLength"
                        step="0.5"
                        min="10"
                        max="30"
                        value={formData.measurements?.sleeveLength || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          measurements: {
                            ...formData.measurements,
                            bust: formData.measurements?.bust || 0,
                            waist: formData.measurements?.waist || 0,
                            hip: formData.measurements?.hip || 0,
                            sleeveLength: parseFloat(e.target.value) || 0,
                            totalLength: formData.measurements?.totalLength || 0
                          }
                        })}
                        className="w-full px-4 py-3 text-base border border-slate-300 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white min-h-[48px]"
                        placeholder="e.g. 18"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="totalLength" className="block text-sm font-medium text-slate-700 mb-1">
                        Total Length *
                      </label>
                      <input
                        type="number"
                        id="totalLength"
                        step="0.5"
                        min="20"
                        max="60"
                        value={formData.measurements?.totalLength || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          measurements: {
                            ...formData.measurements,
                            bust: formData.measurements?.bust || 0,
                            waist: formData.measurements?.waist || 0,
                            hip: formData.measurements?.hip || 0,
                            sleeveLength: formData.measurements?.sleeveLength || 0,
                            totalLength: parseFloat(e.target.value) || 0
                          }
                        })}
                        className="w-full px-4 py-3 text-base border border-slate-300 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white min-h-[48px]"
                        placeholder="e.g. 42"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-2xl">
                    <h4 className="font-medium text-blue-800 mb-2">Measurement Tips</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Measure over your undergarments</li>
                      <li>• Keep the tape measure snug but not tight</li>
                      <li>• Ask someone to help you for accurate measurements</li>
                      <li>• All measurements are in inches</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Shop Measurement Info */}
              {formData.measurementType === 'shop' && (
                <div className="bg-green-50 p-4 rounded-2xl">
                  <h4 className="font-medium text-green-800 mb-2">Measurement at Shop</h4>
                  <p className="text-sm text-green-700 mb-2">
                    Our expert tailors will take your measurements during your appointment.
                  </p>
                  <div className="text-sm text-green-600">
                    <p>📍 Visit our store at your scheduled appointment time</p>
                    <p>⏱️ Measurement process takes about 15-20 minutes</p>
                    <p>👗 Bring reference images if you have specific style preferences</p>
                  </div>
                </div>
              )}
            </fieldset>
          )}

          {/* Error Display */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors min-h-[48px]"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={currentStep === 1 && (!formData.serviceId || !formData.appointmentDate)}
                className="flex items-center px-6 py-2 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Booking'
                )}
              </button>
            )}
          </div>
        </form>
        </>
        )}
      </div>
    </div>
  );
};

export default BookingPage;