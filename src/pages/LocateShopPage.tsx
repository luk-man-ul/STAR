import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, Copy, MessageCircle } from 'lucide-react';

const LocateShopPage: React.FC = () => {
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Shop information - Loaded from environment variables
  const shopInfo = {
    name: import.meta.env.VITE_SHOP_NAME || 'Star Tailors',
    address: import.meta.env.VITE_SHOP_ADDRESS || '123 Fashion Street, MG Road, Bangalore, Karnataka 560001',
    phone: import.meta.env.VITE_SHOP_PHONE || '+91 98765 43210',
    whatsapp: import.meta.env.VITE_SHOP_WHATSAPP || '919876543210',
    email: import.meta.env.VITE_SHOP_EMAIL || 'contact@startailors.com',
    mapUrl: import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.8267060175384!2d77.60063931482213!3d12.971598990856934!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin',
    googleMapsLink: import.meta.env.VITE_GOOGLE_MAPS_LINK || 'https://goo.gl/maps/example',
    hours: import.meta.env.VITE_BUSINESS_HOURS 
      ? JSON.parse(import.meta.env.VITE_BUSINESS_HOURS)
      : [
          { day: 'Monday - Friday', time: '10:00 AM - 8:00 PM' },
          { day: 'Saturday', time: '10:00 AM - 6:00 PM' },
          { day: 'Sunday', time: 'Closed' }
        ],
    landmarks: import.meta.env.VITE_SHOP_LANDMARKS || 'Near City Mall, Opposite HDFC Bank'
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(shopInfo.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleGetDirections = () => {
    window.open(shopInfo.googleMapsLink, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${shopInfo.phone}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${shopInfo.whatsapp}?text=Hi, I would like to inquire about your tailoring services.`, '_blank');
  };

  const handleEmail = () => {
    window.location.href = `mailto:${shopInfo.email}?subject=Tailoring Inquiry`;
  };

  return (
    <div className="min-h-screen bg-rose-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
        <div className="flex items-center">
          <MapPin className="w-6 h-6 text-rose-600 mr-3" />
          <div>
            <h1 className="text-xl font-bold text-slate-800">Locate Our Shop</h1>
            <p className="text-sm text-slate-600">Visit us for measurements & fittings</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Map Section */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="aspect-video w-full">
            <iframe
              src={shopInfo.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Shop Location Map"
            />
          </div>
          <div className="p-4">
            <button
              onClick={handleGetDirections}
              className="w-full bg-rose-600 text-white py-3 rounded-2xl font-medium hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
            >
              <Navigation className="w-5 h-5" />
              Get Directions
            </button>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-rose-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-800 mb-2">Shop Address</h2>
              <p className="text-slate-600 mb-3">{shopInfo.address}</p>
              <p className="text-sm text-slate-500 mb-3">
                <span className="font-medium">Landmark:</span> {shopInfo.landmarks}
              </p>
              <button
                onClick={handleCopyAddress}
                className="flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {copiedAddress ? 'Address Copied!' : 'Copy Address'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Business Hours</h2>
              <div className="space-y-3">
                {shopInfo.hours.map((schedule: { day: string; time: string }, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-slate-600">{schedule.day}</span>
                    <span className="font-medium text-slate-800">{schedule.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Us Section */}
        <div className="bg-white rounded-3xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Contact Us</h2>
          <div className="space-y-3">
            {/* Phone */}
            <button
              onClick={handleCall}
              className="w-full p-4 bg-white border-2 border-slate-200 hover:border-rose-500 hover:bg-rose-50 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-rose-600" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-slate-800">Phone Call</div>
                  <div className="text-sm text-slate-600">{shopInfo.phone}</div>
                </div>
              </div>
            </button>

            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="w-full p-4 bg-white border-2 border-slate-200 hover:border-green-500 hover:bg-green-50 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-slate-800">WhatsApp</div>
                  <div className="text-sm text-slate-600">Chat with us instantly</div>
                </div>
              </div>
            </button>

            {/* Email */}
            <button
              onClick={handleEmail}
              className="w-full p-4 bg-white border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-semibold text-slate-800">Email</div>
                  <div className="text-sm text-slate-600">{shopInfo.email}</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-6 border border-rose-100">
          <h3 className="font-semibold text-slate-800 mb-2">Visit Us Today!</h3>
          <p className="text-slate-600 text-sm mb-4">
            Come visit our shop for personalized consultations, precise measurements, and to explore our fabric collection. Our expert tailors are ready to help you create the perfect outfit.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700">
              Free Consultation
            </span>
            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700">
              Expert Tailors
            </span>
            <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700">
              Quality Fabrics
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocateShopPage;
