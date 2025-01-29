import React, { useState, useMemo } from 'react';
import { Clock, Truck, Shield, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import './ShippingRates.css';

const ShippingRates = ({
  rates,
  selectedRate,
  onSelectRate,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sort rates by amount
  const sortedRates = useMemo(() => {
    return [...rates].sort((a, b) => a.amount - b.amount);
  }, [rates]);

  const goToPrevious = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? sortedRates.length - 1 : prevIndex - 1
    );
  };

  const goToNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prevIndex) => 
      prevIndex === sortedRates.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!sortedRates.length) return null;

  const currentRate = sortedRates[currentIndex];

  return (
    <div className="shipping-rates">
      <h3 className="text-lg font-semibold mb-4">Select Shipping Method</h3>
      <div className="shipping-carousel">
        <button 
          onClick={goToPrevious}
          type="button" // Explicitly set button type
          className="carousel-arrow left"
          aria-label="Previous shipping option"
        >
          <ChevronLeft size={24} />
        </button>

        <div
          className={`shipping-rate-card ${
            selectedRate?.serviceType === currentRate.serviceType ? 'selected' : ''
          }`}
          onClick={() => onSelectRate(currentRate)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="text-emerald-600" size={20} />
                <h4 className="font-semibold">{currentRate.serviceType}</h4>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Clock size={16} />
                <span>{currentRate.transitTime}</span>
              </div>
              <div className="text-sm text-gray-600">
                Estimated delivery: {currentRate.deliveryDate}
              </div>
              {currentRate.guarantees && currentRate.guarantees.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {currentRate.guarantees.map((guarantee, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield size={14} className="text-emerald-600" />
                      {guarantee}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">${currentRate.amount.toFixed(2)}</div>
              {selectedRate?.serviceType === currentRate.serviceType && (
                <div className="flex items-center justify-end gap-1 text-sm text-emerald-600 mt-1">
                  <Check size={16} />
                  Selected
                </div>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={goToNext}
          type="button" // Explicitly set button type
          className="carousel-arrow right"
          aria-label="Next shipping option"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="shipping-pagination">
        {sortedRates.map((_, index) => (
          <button
            key={index}
            className={`pagination-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to shipping option ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ShippingRates;