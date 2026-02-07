import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { fc, testProp } from '@fast-check/jest';
import ServiceCard from './ServiceCard';
import { PricingTier } from '../types';

// Generators for property-based testing
const pricingTierArb = fc.record({
  type: fc.string({ minLength: 3, maxLength: 50 }).filter(s => s.trim().length > 2),
  price: fc.integer({ min: 100, max: 10000 }),
  description: fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length > 4)
});

const serviceCardPropsArb = fc.record({
  id: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length > 2 && /^[a-zA-Z0-9-_]+$/.test(s)),
  name: fc.string({ minLength: 5, maxLength: 50 }).filter(s => s.trim().length > 4),
  description: fc.string({ minLength: 10, maxLength: 200 }).filter(s => s.trim().length > 9),
  pricing: fc.array(pricingTierArb, { minLength: 1, maxLength: 3 })
}).filter(props => {
  // Ensure all text values are unique within the service card
  const allTexts = [
    props.name,
    props.description,
    ...props.pricing.map(p => p.type),
    ...props.pricing.map(p => p.description)
  ];
  const uniqueTexts = new Set(allTexts);
  return uniqueTexts.size === allTexts.length;
});

describe('ServiceCard Property Tests', () => {
  // Feature: dress-stitching-website, Property 5: Service card accordion toggle behavior
  testProp('Service card accordion toggle behavior', [serviceCardPropsArb], (props) => {
    // **Validates: Requirements 3.4, 3.5**
    
    // Clean up any previous renders to ensure isolation
    cleanup();
    
    // Render a single service card in isolation with a unique container
    const { container } = render(
      <ServiceCard
        id={props.id}
        name={props.name}
        description={props.description}
        pricing={props.pricing}
      />
    );

    // Find the "View Price" button within our specific container
    const viewPriceButton = screen.getByRole('button', { name: /view price/i });
    
    // Verify the button is within our container
    expect(container).toContainElement(viewPriceButton);
    
    // Initially, the accordion should be collapsed (aria-expanded should be false)
    expect(viewPriceButton).toHaveAttribute('aria-expanded', 'false');
    
    // The pricing content should not be visible initially
    const pricingContainerId = `pricing-${props.id}`;
    const pricingElement = document.getElementById(pricingContainerId);
    expect(pricingElement).toBeInTheDocument();
    expect(pricingElement).toHaveClass('max-h-0', 'opacity-0');

    // Click to expand the accordion
    fireEvent.click(viewPriceButton);
    
    // After clicking, the accordion should be expanded
    expect(viewPriceButton).toHaveAttribute('aria-expanded', 'true');
    
    // The pricing content should now be visible
    expect(pricingElement).toHaveClass('max-h-96', 'opacity-100');

    // Click again to collapse the accordion (round-trip property)
    fireEvent.click(viewPriceButton);
    
    // After second click, the accordion should be collapsed again
    expect(viewPriceButton).toHaveAttribute('aria-expanded', 'false');
    
    // The pricing content should be hidden again
    expect(pricingElement).toHaveClass('max-h-0', 'opacity-0');

    // Verify that all pricing tiers are rendered when expanded
    fireEvent.click(viewPriceButton); // Expand again
    
    // Use more specific queries to avoid ambiguity
    props.pricing.forEach((tier) => {
      // Find elements within the pricing container specifically
      const pricingContainer = document.getElementById(pricingContainerId);
      expect(pricingContainer).toBeInTheDocument();
      
      // Check that the tier type and description exist within the pricing container
      // Use contains checks to handle HTML rendering and whitespace issues
      expect(pricingContainer?.textContent).toContain(tier.type.trim());
      expect(pricingContainer?.textContent).toContain(tier.description.trim());
      expect(pricingContainer?.textContent).toContain(`₹${tier.price}`);
    });
    
    // Clean up after this test iteration
    cleanup();
  });
});