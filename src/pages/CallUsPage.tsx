import React from 'react';
import { Phone, MapPin, Clock, Mail, MessageCircle } from 'lucide-react';

const CallUsPage: React.FC = () => {
  const contactInfo = {
    phone: '+91 98765 43210',
    email: 'info@stitchingcenter.com',
    address: '123 Fashion Street, Textile District, Mumbai 400001',
    hours: {
      weekdays: '9:00 AM - 7:00 PM',
      saturday: '9:00 AM - 5:00 PM',
      sunday: 'Closed'
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Get in Touch</h1>
          <p className="text-slate-600">
            We're here to help with all your stitching needs
          </p>
        </div>

        {/* Contact Cards */}
        <div className="space-y-4 mb-8">
          {/* Phone */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-rose-100 p-3 rounded-full mr-4">
                <Phone className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Call Us</h3>
                <p className="text-slate-600 text-sm">Speak directly with our team</p>
              </div>
            </div>
            <a
              href={`tel:${contactInfo.phone}`}
              className="block w-full text-center bg-rose-600 text-white py-3 rounded-2xl font-medium hover:bg-rose-700 transition-colors min-h-[48px] flex items-center justify-center"
            >
              <Phone className="w-4 h-4 mr-2" />
              {contactInfo.phone}
            </a>
          </div>

          {/* WhatsApp */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">WhatsApp</h3>
                <p className="text-slate-600 text-sm">Quick messages and updates</p>
              </div>
            </div>
            <a
              href={`https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center bg-green-600 text-white py-3 rounded-2xl font-medium hover:bg-green-700 transition-colors min-h-[48px] flex items-center justify-center"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message on WhatsApp
            </a>
          </div>

          {/* Email */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Email Us</h3>
                <p className="text-slate-600 text-sm">For detailed inquiries</p>
              </div>
            </div>
            <a
              href={`mailto:${contactInfo.email}`}
              className="block w-full text-center bg-blue-600 text-white py-3 rounded-2xl font-medium hover:bg-blue-700 transition-colors min-h-[48px] flex items-center justify-center"
            >
              <Mail className="w-4 h-4 mr-2" />
              {contactInfo.email}
            </a>
          </div>
        </div>

        {/* Location & Hours */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-8">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
            <MapPin className="w-5 h-5 text-rose-600 mr-2" />
            Visit Our Store
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-slate-700 mb-1">Address</h4>
              <p className="text-slate-600">{contactInfo.address}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-slate-700 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Business Hours
              </h4>
              <div className="space-y-1 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>{contactInfo.hours.weekdays}</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span>{contactInfo.hours.saturday}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="text-red-600">{contactInfo.hours.sunday}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6">
          <h3 className="font-semibold text-amber-800 mb-2">Urgent Orders?</h3>
          <p className="text-amber-700 text-sm mb-3">
            For rush orders or urgent alterations, call us directly. We offer same-day and next-day services for emergency situations.
          </p>
          <a
            href={`tel:${contactInfo.phone}`}
            className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-full text-sm font-medium hover:bg-amber-700 transition-colors"
          >
            <Phone className="w-4 h-4 mr-1" />
            Call for Rush Orders
          </a>
        </div>
      </div>
    </div>
  );
};

export default CallUsPage;