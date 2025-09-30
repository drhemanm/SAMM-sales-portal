'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  Plus,
  Minus,
  Trash2,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  User,
  Package,
  DollarSign,
  Send,
  X,
} from 'lucide-react';
import MobileLayout from '@/components/MobileLayout';
import CustomerCard from '@/components/CustomerCard';
import ProductCard from '@/components/ProductCard';
import DiscountSelector from '@/components/DiscountSelector';
import SignaturePad from '@/components/SignaturePad';
import { useCustomers } from '@/hooks/useCustomers';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import type { Customer, Product, Signature } from '@/types';

type Step = 'customer' | 'products' | 'review' | 'signatures';

export default function NewOrderPage() {
  const router = useRouter();
  const { filteredCustomers, loading: customersLoading } = useCustomers();
  const { filteredProducts, loading: productsLoading, checkStock } = useProducts();
  const {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    updateDiscount,
    clearCart,
    cartTotal,
    cartSubtotal,
    cartTotalDiscount,
    verifyStock,
  } = useCart();
  const { createOrder } = useOrders();

  const [currentStep, setCurrentStep] = useState<Step>('customer');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [salespersonSignature, setSalespersonSignature] = useState<string | null>(null);
  const [customerSignature, setCustomerSignature] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set default delivery date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setDeliveryDate(dateStr);
  }, []);

  // Filter customers by search
  const searchedCustomers = filteredCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  // Filter products by search
  const searchedProducts = filteredProducts.filter((product) =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Handle customer selection
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCurrentStep('products');
  };

  // Handle add product
  const handleAddProduct = (product: Product) => {
    addItem(product, 1);
  };

  // Handle proceed to review
  const handleProceedToReview = () => {
    if (cart.length === 0) {
      setError('Please add at least one product to the order');
      return;
    }
    setError(null);
    setCurrentStep('review');
  };

  // Handle proceed to signatures
  const handleProceedToSignatures = async () => {
    // Verify stock before signatures
    const stockCheck = await verifyStock();
    if (!stockCheck.success) {
      setError(stockCheck.message || 'Stock verification failed');
      return;
    }

    if (!deliveryDate) {
      setError('Please select a delivery date');
      return;
    }

    setError(null);
    setCurrentStep('signatures');
  };

  // Handle submit order
  const handleSubmitOrder = async () => {
    if (!salespersonSignature) {
      setError('Salesperson signature is required');
      return;
    }

    if (!customerSignature) {
      setError('Customer signature is required');
      return;
    }

    if (!selectedCustomer) {
      setError('Customer not selected');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Prepare order data
      const orderData = {
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        items: cart.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          sku: item.sku,
          quantity: item.quantity,
          unit: item.unit,
          unitPrice: item.unitPrice,
          discountPercent: item.discountPercent,
          discountAmount: item.discountAmount,
          subtotal: item.subtotal,
          total: item.total,
          temperature: item.temperature,
          grade: item.grade,
        })),
        deliveryDate: new Date(deliveryDate),
        specialInstructions,
        signatures: {
          salesperson: {
            imageData: salespersonSignature,
            name: 'Salesperson', // Will be filled from user profile
            timestamp: new Date(),
          },
          customer: {
            imageData: customerSignature,
            name: selectedCustomer.name,
            timestamp: new Date(),
          },
        },
      };

      // Submit order
      const response = await createOrder(orderData);

      // Clear cart
      clearCart();

      // Show success and redirect
      alert(`Order ${response.orderNumber} created successfully!`);
      router.push('/orders');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      setSubmitting(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentStep === 'products') {
      setCurrentStep('customer');
      setSelectedCustomer(null);
    } else if (currentStep === 'review') {
      setCurrentStep('products');
    } else if (currentStep === 'signatures') {
      setCurrentStep('review');
    } else {
      router.back();
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'customer':
        return (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-brown-light" />
              <input
                type="text"
                placeholder="Search customers..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-meat focus:border-meat-red focus:ring-2 focus:ring-meat-red focus:ring-opacity-20 transition-all"
              />
            </div>

            {/* Customer List */}
            {customersLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="spinner-lg"></div>
              </div>
            ) : searchedCustomers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <User className="w-full h-full" />
                </div>
                <h3 className="empty-state-title">No Customers Found</h3>
                <p className="empty-state-description">
                  {customerSearch
                    ? `No customers match "${customerSearch}"`
                    : 'No customers available'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {searchedCustomers.map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    onClick={handleSelectCustomer}
                    compact={true}
                    showDistance={false}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case 'products':
        return (
          <div className="space-y-4">
            {/* Selected Customer Info */}
            <div className="card bg-gradient-to-r from-meat-red to-meat-red-light text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Customer</p>
                  <h3 className="text-lg font-bold">{selectedCustomer?.name}</h3>
                  <p className="text-sm opacity-90 mt-1">
                    Credit: R{selectedCustomer?.creditAvailable.toLocaleString()} available
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep('customer')}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30"
                >
                  <User className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <div className="card bg-green-50 border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-700" />
                    <span className="font-semibold text-green-900">
                      {cart.length} items in cart
                    </span>
                  </div>
                  <span className="text-xl font-bold text-green-700">
                    R{cartTotal.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={handleProceedToReview}
                  className="btn-primary w-full"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Review Order</span>
                </button>
              </div>
            )}

            {/* Search Products */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-brown-light" />
              <input
                type="text"
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-meat focus:border-meat-red focus:ring-2 focus:ring-meat-red focus:ring-opacity-20 transition-all"
              />
            </div>

            {/* Product List */}
            {productsLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="spinner-lg"></div>
              </div>
            ) : searchedProducts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Package className="w-full h-full" />
                </div>
                <h3 className="empty-state-title">No Products Found</h3>
              </div>
            ) : (
              <div className="space-y-2">
                {searchedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddProduct}
                    compact={true}
                    showStock={true}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case 'review':
        return (
          <div className="space-y-4">
            {/* Customer Info */}
            <div className="card">
              <h3 className="font-bold text-neutral-brown mb-3 flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer
              </h3>
              <p className="text-lg font-semibold text-neutral-brown">
                {selectedCustomer?.name}
              </p>
              <p className="text-sm text-neutral-brown-light">
                {selectedCustomer?.type}
              </p>
            </div>

            {/* Cart Items */}
            <div className="card">
              <h3 className="font-bold text-neutral-brown mb-3 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items ({cart.length})
              </h3>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    {/* Item Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-brown">
                          {item.productName}
                        </h4>
                        <p className="text-xs text-neutral-brown-light">
                          SKU: {item.sku}
                        </p>
                        <p className="text-sm text-neutral-brown-light mt-1">
                          R{item.unitPrice}/{item.unit}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-2 hover:bg-red-50 rounded-meat transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm text-neutral-brown-light">Quantity:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-meat transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-mono font-bold text-lg w-16 text-center">
                          {item.quantity}{item.unit}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-meat transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Discount Selector */}
                    <DiscountSelector
                      value={item.discountPercent}
                      onChange={(discount) => updateDiscount(item.productId, discount)}
                      amount={item.subtotal}
                    />

                    {/* Item Total */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-brown-light">Subtotal:</span>
                        <span className="font-mono">R{item.subtotal.toLocaleString()}</span>
                      </div>
                      {item.discountAmount > 0 && (
                        <div className="flex items-center justify-between text-sm text-green-700">
                          <span>Discount ({item.discountPercent}%):</span>
                          <span className="font-mono">-R{item.discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between font-semibold text-meat-red mt-1">
                        <span>Total:</span>
                        <span className="font-mono text-lg">R{item.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Totals */}
            <div className="card bg-gradient-to-br from-meat-red to-meat-red-light text-white">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Order Summary
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="opacity-90">Subtotal:</span>
                  <span className="font-mono text-lg">R{cartSubtotal.toLocaleString()}</span>
                </div>
                {cartTotalDiscount > 0 && (
                  <div className="flex items-center justify-between text-green-300">
                    <span>Total Discount:</span>
                    <span className="font-mono text-lg">-R{cartTotalDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="h-px bg-white/30 my-3"></div>
                <div className="flex items-center justify-between text-2xl font-bold">
                  <span>TOTAL:</span>
                  <span className="font-mono">R{cartTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="card">
              <h3 className="font-bold text-neutral-brown mb-3 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Delivery Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-brown mb-2">
                    Delivery Date <span className="text-meat-red">*</span>
                  </label>
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-brown mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g., Deliver to back entrance, call on arrival..."
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="card bg-red-50 border-red-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep('products')}
                className="btn-secondary flex-1"
              >
                <Package className="h-5 w-5" />
                <span>Add More</span>
              </button>
              <button
                onClick={handleProceedToSignatures}
                className="btn-primary flex-1"
              >
                <FileText className="h-5 w-5" />
                <span>Sign Order</span>
              </button>
            </div>
          </div>
        );

      case 'signatures':
        return (
          <div className="space-y-4">
            {/* Order Summary Card */}
            <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
              <h3 className="font-bold mb-3">Ready to Submit</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{cart.length} items</p>
                  <p className="text-sm opacity-90">Delivery: {new Date(deliveryDate).toLocaleDateString()}</p>
                </div>
                <p className="text-3xl font-bold font-mono">R{cartTotal.toLocaleString()}</p>
              </div>
            </div>

            {/* Salesperson Signature */}
            <div className="card">
              <SignaturePad
                label="Salesperson Signature"
                required={true}
                onSave={(signature) => setSalespersonSignature(signature)}
                onClear={() => setSalespersonSignature(null)}
              />
              {salespersonSignature && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-meat">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-semibold">Signature captured</span>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Signature */}
            <div className="card">
              <SignaturePad
                label="Customer Signature"
                required={true}
                onSave={(signature) => setCustomerSignature(signature)}
                onClear={() => setCustomerSignature(null)}
              />
              {customerSignature && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-meat">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-semibold">Signature captured</span>
                  </div>
                </div>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="card bg-gray-50">
              <div className="space-y-2 text-sm text-neutral-brown-light">
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>I confirm that the order details are correct</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Stock will be depleted immediately upon submission</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Delivery date and instructions are confirmed</span>
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="card bg-red-50 border-red-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmitOrder}
              disabled={!salespersonSignature || !customerSignature || submitting}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="spinner"></div>
                  <span>Submitting Order...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Submit Order</span>
                </>
              )}
            </button>
          </div>
        );
    }
  };

  // Get step title
  const getStepTitle = () => {
    switch (currentStep) {
      case 'customer':
        return 'Select Customer';
      case 'products':
        return 'Add Products';
      case 'review':
        return 'Review Order';
      case 'signatures':
        return 'Signatures';
      default:
        return 'New Order';
    }
  };

  // Get step indicator
  const getStepNumber = () => {
    switch (currentStep) {
      case 'customer':
        return 1;
      case 'products':
        return 2;
      case 'review':
        return 3;
      case 'signatures':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 space-y-3">
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-meat transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-neutral-brown" />
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-xl font-bold text-neutral-brown">{getStepTitle()}</h1>
              <p className="text-xs text-neutral-brown-light">
                Step {getStepNumber()} of 4
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('Cancel order creation?')) {
                  clearCart();
                  router.back();
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-meat transition-colors"
            >
              <X className="h-5 w-5 text-neutral-brown" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full transition-all ${
                  step <= getStepNumber()
                    ? 'bg-meat-red'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          {renderStepContent()}
          {/* Bottom Padding */}
          <div className="h-4"></div>
        </div>
      </div>
    </MobileLayout>
  );
}
