import { Request, Response } from 'express';
import { getOdooService } from '../services/odoo.service';

interface OdooProduct {
  id: number;
  name: string;
  default_code: string; // SKU
  barcode: string;
  categ_id: [number, string];
  list_price: number;
  uom_id: [number, string];
  qty_available: number;
  virtual_available: number;
  outgoing_qty: number;
  description: string;
  description_sale: string;
  type: string;
  active: boolean;
  image_1920?: string;
  // Custom fields for meat products
  x_temperature_min?: number;
  x_temperature_max?: number;
  x_grade?: string;
  x_shelf_life?: number;
  x_origin?: string;
}

/**
 * Get all products
 */
export async function getAllProducts(req: Request, res: Response) {
  try {
    const odoo = getOdooService();
    
    // Fetch products from Odoo
    const products = await odoo.searchRead<OdooProduct>(
      'product.product',
      [
        ['sale_ok', '=', true],
        ['active', '=', true],
        ['type', '=', 'product'], // Only stockable products
      ],
      [
        'name',
        'default_code',
        'barcode',
        'categ_id',
        'list_price',
        'uom_id',
        'qty_available',
        'virtual_available',
        'outgoing_qty',
        'description',
        'description_sale',
        'image_1920',
        'x_temperature_min',
        'x_temperature_max',
        'x_grade',
        'x_shelf_life',
        'x_origin',
      ],
      200 // Limit to 200 products
    );

    // Transform to frontend format
    const transformedProducts = products.map(p => ({
      id: p.id.toString(),
      odooId: p.id,
      name: p.name,
      description: p.description_sale || p.description,
      category: p.categ_id ? p.categ_id[1].split('/').pop() : 'Other',
      sku: p.default_code || '',
      barcode: p.barcode || '',
      price: p.list_price,
      unit: mapOdooUnit(p.uom_id ? p.uom_id[1] : 'kg'),
      currency: 'ZAR',
      stock: Math.round(p.qty_available),
      availableStock: Math.round(p.virtual_available),
      reservedStock: Math.round(p.outgoing_qty),
      lowStockThreshold: 10, // Default threshold
      temperature: getTemperatureLabel(p.x_temperature_min, p.x_temperature_max),
      temperatureMin: p.x_temperature_min,
      temperatureMax: p.x_temperature_max,
      grade: p.x_grade,
      shelfLife: p.x_shelf_life,
      origin: p.x_origin,
      image: p.image_1920 ? `data:image/png;base64,${p.image_1920}` : undefined,
      icon: getProductIcon(p.categ_id ? p.categ_id[1] : ''),
      status: p.virtual_available > 0 ? 'active' : 'out_of_stock',
      lastUpdated: new Date(),
    }));

    res.json({
      products: transformedProducts,
      lastUpdated: new Date(),
      source: 'odoo',
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message,
    });
  }
}

/**
 * Get product by ID
 */
export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const odoo = getOdooService();

    const products = await odoo.read<OdooProduct>(
      'product.product',
      [parseInt(id)],
      [
        'name',
        'default_code',
        'barcode',
        'categ_id',
        'list_price',
        'uom_id',
        'qty_available',
        'virtual_available',
        'outgoing_qty',
        'description',
        'description_sale',
        'image_1920',
        'x_temperature_min',
        'x_temperature_max',
        'x_grade',
        'x_shelf_life',
        'x_origin',
      ]
    );

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    const p = products[0];

    res.json({
      success: true,
      data: {
        id: p.id.toString(),
        odooId: p.id,
        name: p.name,
        description: p.description_sale || p.description,
        category: p.categ_id ? p.categ_id[1].split('/').pop() : 'Other',
        sku: p.default_code || '',
        barcode: p.barcode || '',
        price: p.list_price,
        unit: mapOdooUnit(p.uom_id ? p.uom_id[1] : 'kg'),
        currency: 'ZAR',
        stock: Math.round(p.qty_available),
        availableStock: Math.round(p.virtual_available),
        reservedStock: Math.round(p.outgoing_qty),
        lowStockThreshold: 10,
        temperature: getTemperatureLabel(p.x_temperature_min, p.x_temperature_max),
        temperatureMin: p.x_temperature_min,
        temperatureMax: p.x_temperature_max,
        grade: p.x_grade,
        shelfLife: p.x_shelf_life,
        origin: p.x_origin,
        image: p.image_1920 ? `data:image/png;base64,${p.image_1920}` : undefined,
        icon: getProductIcon(p.categ_id ? p.categ_id[1] : ''),
        status: p.virtual_available > 0 ? 'active' : 'out_of_stock',
        lastUpdated: new Date(),
      },
    });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      message: error.message,
    });
  }
}

/**
 * Check stock for multiple products (real-time)
 */
export async function checkStock(req: Request, res: Response) {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Product IDs array is required',
      });
    }

    const odoo = getOdooService();

    // Convert string IDs to numbers
    const numericIds = productIds.map(id => parseInt(id));

    const products = await odoo.read<OdooProduct>(
      'product.product',
      numericIds,
      ['qty_available', 'virtual_available', 'outgoing_qty']
    );

    const stockData = products.map(p => ({
      productId: p.id.toString(),
      available: Math.round(p.virtual_available),
      reserved: Math.round(p.outgoing_qty),
      lastUpdated: new Date(),
    }));

    res.json({
      success: true,
      data: stockData,
    });
  } catch (error: any) {
    console.error('Error checking stock:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check stock',
      message: error.message,
    });
  }
}

// Helper functions

function mapOdooUnit(odooUnit: string): string {
  const unitMap: Record<string, string> = {
    'kg': 'kg',
    'Kilogram': 'kg',
    'g': 'g',
    'Gram': 'g',
    'lb': 'lbs',
    'Pound': 'lbs',
    'Unit': 'pieces',
    'Units': 'pieces',
    'Box': 'box',
    'Boxes': 'box',
  };

  return unitMap[odooUnit] || 'kg';
}

function getTemperatureLabel(min?: number, max?: number): string | undefined {
  if (min === undefined || max === undefined) return undefined;

  if (max <= -15) return 'Frozen (-18°C)';
  if (max <= 5) return 'Chilled (0-4°C)';
  return 'Room Temp';
}

function getProductIcon(category: string): string {
  const categoryIcons: Record<string, string> = {
    'Beef': '🥩',
    'Poultry': '🍗',
    'Pork': '🥓',
    'Lamb': '🐑',
    'Veal': '🍖',
    'Game': '🦌',
    'Processed': '🌭',
    'Seafood': '🦞',
  };

  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (category.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }

  return '🥩';
}
