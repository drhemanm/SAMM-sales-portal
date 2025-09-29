# Odoo Integration Requirements

## Current Setup
- Backend: Firebase Cloud Functions (Node.js/Express)
- API Endpoint: `/backend/functions/src/index.ts`
- Odoo Connection: XML-RPC (current implementation)

## What We Need From Odoo

### 1. API Credentials
- Odoo URL
- Database name
- API User (dedicated integration user recommended)
- API Password
- Odoo version

### 2. Data Models We're Accessing

#### Customers (res.partner)
- Fields: name, email, phone, addresses, credit_limit, user_id (assigned salesperson)
- Domain: is_company=true, customer_rank>0

#### Orders (sale.order)
- Fields: name, partner_id, user_id, amount_total, state, date_order
- States: draft, sent, sale, done, cancel

#### Products (product.product)
- Fields: name, list_price, qty_available, categ_id
- Include: temperature requirements, weight units

#### Users (res.users)
- Fields: name, login, groups_id, partner_id
- For: Salesperson authentication and assignment

### 3. Current Integration Points

1. **GET /customers** - Fetch customers assigned to salesperson
2. **GET /orders** - Fetch orders by salesperson
3. **GET /analytics/dashboard** - Sales metrics and targets
4. **POST /orders** - Create new orders (not implemented)

### 4. Critical Business Rules

- Salespersons should only see their assigned customers
- Orders need approval workflow (credit limits)
- Cold chain temperature tracking required
- Multi-currency support (ZAR primary)

### 5. Questions for Odoo Team

1. Is XML-RPC preferred or do you have REST API module installed?
2. Any custom fields we should know about?
3. Existing API rate limits?
4. Webhook capabilities for real-time updates?
5. How are temperature/quality fields stored?
