'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Percent, Tag } from 'lucide-react';
import { DISCOUNT_PERCENTAGES } from '@/types';

interface DiscountSelectorProps {
  value: number;
  onChange: (discount: number) => void;
  amount: number;
  disabled?: boolean;
  label?: string;
}

export default function DiscountSelector({
  value,
  onChange,
  amount,
  disabled = false,
  label = 'Discount',
}: DiscountSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate discount amount
  const discountAmount = (amount * value) / 100;
  const totalAfterDiscount = amount - discountAmount;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (discount: number) => {
    onChange(discount);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-neutral-brown mb-2">
          {label}
        </label>
      )}

      {/* Selector Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-3 bg-white border-2 rounded-meat transition-all ${
          disabled
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
            : isOpen
            ? 'border-meat-red ring-2 ring-meat-red ring-opacity-20'
            : 'border-gray-300 hover:border-meat-red'
        }`}
      >
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-meat-red" />
          <span className="font-medium text-neutral-brown">
            {value === 0 ? 'No Discount' : `${value}% Off`}
          </span>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-neutral-brown-light transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Discount Calculation Display */}
      {value > 0 && (
        <div className="mt-2 px-4 py-2 bg-green-50 border border-green-200 rounded-meat">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-800">You save:</span>
            <span className="font-bold text-green-700">
              -R{discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-green-700">New total:</span>
            <span className="font-semibold text-green-800">
              R{totalAfterDiscount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-meat-red rounded-meat shadow-meat max-h-80 overflow-y-auto scrollbar-thin">
          {DISCOUNT_PERCENTAGES.map((discount) => {
            const isSelected = discount === value;
            const itemDiscountAmount = (amount * discount) / 100;
            const itemTotal = amount - itemDiscountAmount;

            return (
              <button
                key={discount}
                type="button"
                onClick={() => handleSelect(discount)}
                className={`w-full px-4 py-3 text-left transition-colors ${
                  isSelected
                    ? 'bg-meat-red text-white font-semibold'
                    : 'hover:bg-gray-50 active:bg-gray-100 text-neutral-brown'
                } border-b border-gray-100 last:border-b-0`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {discount === 0 ? (
                      <span className="text-sm font-medium">No Discount</span>
                    ) : (
                      <>
                        <Percent className="h-4 w-4" />
                        <span className="text-sm font-medium">{discount}% Off</span>
                      </>
                    )}
                  </div>

                  {isSelected && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>

                {/* Show calculation for non-zero discounts */}
                {discount > 0 && (
                  <div className={`mt-1 text-xs ${isSelected ? 'text-white opacity-90' : 'text-neutral-brown-light'}`}>
                    <div className="flex items-center justify-between">
                      <span>Save:</span>
                      <span className="font-mono">
                        -R{itemDiscountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span>New total:</span>
                      <span className="font-mono font-semibold">
                        R{itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
