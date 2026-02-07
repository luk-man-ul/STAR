import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PricingTier {
  type: string;
  price: number;
  description: string;
}

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  pricing: PricingTier[];
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  name,
  description,
  pricing
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-card shadow-sm border border-primary-100 overflow-hidden">
      {/* Service Header */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-2">{name}</h3>
        <p className="text-text-secondary mb-4">{description}</p>
        
        {/* View Price Button */}
        <button
          onClick={toggleAccordion}
          className="flex items-center justify-between w-full bg-primary-50 hover:bg-primary-100 text-primary-600 px-4 py-3 rounded-lg min-h-touch transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-expanded={isExpanded}
          aria-controls={`pricing-${id}`}
          aria-label={`${isExpanded ? 'Hide' : 'Show'} pricing for ${name}`}
        >
          <span className="font-medium">View Price</span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Pricing Accordion */}
      <div
        id={`pricing-${id}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!isExpanded}
      >
        <div className="px-6 pb-6 border-t border-primary-100">
          <div className="pt-4 space-y-3">
            {pricing.map((tier, index) => (
              <div key={index} className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-text-primary">{tier.type}</h4>
                  <p className="text-sm text-text-secondary">{tier.description}</p>
                </div>
                <div className="text-right ml-4">
                  <span className="text-lg font-semibold text-primary-600" aria-label={`Price: ${tier.price} rupees`}>
                    ₹{tier.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;