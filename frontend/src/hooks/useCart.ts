import { useState, useCallback, useEffect } from 'react';
import type { CartItem, Product, StockCheckResponse } from '@/types';
import { productService } from '@/lib/api';

interface UseCartReturn {
  cart: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateDiscount: (productId: string, discountPercent: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartSubtotal: number;
  cartTotalDiscount: number;
  cartItemsCount: number;
  verifyStock: () => Promise<{ success: boolean; message?: string }>;
  getItem: (productId: string) => CartItem | undefined;
}

const CART_STORAGE_KEY = 'meat_market_cart';

export function useCart(): UseCartReturn {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  // Add item to cart
  const addItem = useCallback((product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.id);
      
      if (existingItem) {
        // Update quantity
        return prevCart.map(item =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                subtotal: (item.quantity + quantity) * item.unitPrice,
                total: (item.quantity + quantity) * item.unitPrice * (1 - item.discountPercent / 100),
              }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `cart_${Date.now()}_${product.id}`,
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          quantity,
          unit: product.unit,
          unitPrice: product.price,
          discountPercent: 0,
          discountAmount: 0,
          subtotal: quantity * product.price,
          total: quantity * product.price,
          availableStock: product.availableStock,
          temperature: product.temperature,
          grade: product.grade,
        };
        
        return [...prevCart, newItem];
      }
    });
  }, []);

  // Remove item from cart
  const removeItem = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  }, []);

  // Update quantity
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.unitPrice,
              discountAmount: (quantity * item.unitPrice * item.discountPercent) / 100,
              total: quantity * item.unitPrice * (1 - item.discountPercent / 100),
            }
          : item
      )
    );
  }, [removeItem]);

  // Update discount
  const updateDiscount = useCallback((productId: string, discountPercent: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? {
              ...item,
              discountPercent,
              discountAmount: (item.subtotal * discountPercent) / 100,
              total: item.subtotal * (1 - discountPercent / 100),
            }
          : item
      )
    );
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Get specific item
  const getItem = useCallback((productId: string): CartItem | undefined => {
    return cart.find(item => item.productId === productId);
  }, [cart]);

  // Verify stock availability before checkout
  const verifyStock = useCallback(async (): Promise<{ success: boolean; message?: string }> => {
    try {
      const productIds = cart.map(item => item.productId);
      const stockData: StockCheckResponse[] = await productService.checkStock(productIds);

      // Check each item
      for (const item of cart) {
        const stock = stockData.find(s => s.productId === item.productId);
        
        if (!stock) {
          return {
            success: false,
            message: `Unable to verify stock for ${item.productName}`,
          };
        }

        if (stock.available < item.quantity) {
          return {
            success: false,
            message: `Insufficient stock for ${item.productName}. Available: ${stock.available}${item.unit}, Required: ${item.quantity}${item.unit}`,
          };
        }
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to verify stock availability',
      };
    }
  }, [cart]);

  // Calculate totals
  const cartSubtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const cartTotalDiscount = cart.reduce((sum, item) => sum + item.discountAmount, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    updateDiscount,
    clearCart,
    cartTotal,
    cartSubtotal,
    cartTotalDiscount,
    cartItemsCount,
    verifyStock,
    getItem,
  };
}
