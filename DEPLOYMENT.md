# Deployment Guide - SA Meat Market Portal

## Prerequisites

1. **Node.js 18+** installed
2. **Firebase CLI** installed: `npm install -g firebase-tools`
3. **Firebase project** created (already done: `samm-611c3`)
4. **Odoo 18** instance accessible
5. **Vercel account** for frontend deployment

---

## Step 1: Configure Environment Variables

### Backend (Firebase Functions)

Create `backend/functions/.env`:

```bash
# Odoo Configuration
ODOO_URL=https://your-odoo-instance.com
ODOO_DB=your_database_name
ODOO_USERNAME=your_api_user
ODOO_PASSWORD=your_api_password
ODOO_API_VERSION=18.0

# Optional: Odoo API Key (if configured)
ODOO_API_KEY=

# Node Environment
NODE_ENV=production
```

### Frontend (Vercel)

Your `.env.local` is already configured correctly with Firebase credentials.

---

## Step 2: Install Dependencies

```bash
# Backend
cd backend/functions
npm install

# Frontend
cd ../../frontend
npm install
```

---

## Step 3: Build & Test Locally

### Test Backend Locally

```bash
cd backend/functions

# Build TypeScript
npm run build

# Start Firebase emulators
npm run serve

# Test in another terminal
curl http://localhost:5001/samm-611c3/us-central1/api/health
```

### Test Frontend Locally

```bash
cd frontend

# Development mode
npm run dev

# Visit http://localhost:3000
```

---

## Step 4: Deploy Backend to Firebase

```bash
cd backend/functions

# Login to Firebase
firebase login

# Set environment variables
firebase functions:config:set \
  odoo.url="https://your-odoo.com" \
  odoo.db="your_db" \
  odoo.username="your_user" \
  odoo.password="your_pass"

# Deploy functions
npm run deploy

# Or deploy entire Firebase project
cd ../..
firebase deploy
```

### Verify Backend Deployment

```bash
# Test production API
curl https://us-central1-samm-611c3.cloudfunctions.net/api/health
```

---

## Step 5: Deploy Frontend to Vercel

### Option A: Vercel CLI

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option B: Vercel Git Integration (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure project:
     - **Framework**: Next.js
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`

3. **Add Environment Variables** in Vercel dashboard:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
   NEXT_PUBLIC_ENV=production
   NEXT_PUBLIC_API_URL=https://us-central1-samm-611c3.cloudfunctions.net/api
   ```

4. **Deploy**: Vercel will automatically deploy on every push to `main`

---

## Step 6: Configure Odoo

### Required Modules

Ensure these modules are installed in Odoo 18:

1. **sale_management** - Core sales features
2. **stock** - Inventory management
3. **account** - Credit limits & invoicing
4. **base_api** - API key authentication (optional)

### API User Setup

1. Create dedicated API user in Odoo:
   - **Name**: API User
   - **Login**: `api_user`
   - **Access Rights**: Sales / User Own Documents Only

2. Assign to salesperson:
   ```python
   # In Odoo, link Firebase UID to Odoo user
   res.users:
   - x_firebase_uid: "firebase_user_id"
   ```

### Custom Fields (Optional)

Add these custom fields to `product.product`:

```python
x_temperature_min = fields.Float('Min Temperature (°C)')
x_temperature_max = fields.Float('Max Temperature (°C)')
x_grade = fields.Selection([
    ('grade_a', 'Grade A'),
    ('grade_b', 'Grade B'),
    ('premium', 'Premium'),
    ('standard', 'Standard'),
], string='Grade')
x_shelf_life = fields.Integer('Shelf Life (days)')
x_origin = fields.Char('Origin Country')
```

---

## Step 7: Setup Firestore

### Initialize Collections

```bash
# Create sample data in Firestore
firebase firestore:indexes-deploy firestore.indexes.json
```

### Create Test User

```javascript
// In Firebase Console > Firestore
// Collection: users

{
  id: "firebase_uid_here",
  email: "demo@sameatmarket.com",
  role: "salesperson",
  profile: {
    firstName: "Demo",
    lastName: "User",
    phone: "+27123456789",
    territory: "Gauteng",
    permissions: ["view_customers", "create_orders"],
    odooUserId: 123 // Link to Odoo user ID
  },
  settings: {
    notifications: { email: true, sms: true, push: true },
    preferences: { theme: "light", language: "en", currency: "ZAR" }
  },
  status: "active",
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now()
}
```

---

## Step 8: Security Rules

### Firestore Security Rules

Already configured in `firestore.rules`. Deploy:

```bash
firebase deploy --only firestore:rules
```

### Firebase Storage Rules

Create `storage.rules`:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /signatures/{userId}/{orderId}/{fileName} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /products/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.token.role in ['admin', 'sales_manager'];
    }
  }
}
```

Deploy:

```bash
firebase deploy --only storage
```

---

## Step 9: Testing

### Test Checklist

- [ ] Backend health endpoint responds
- [ ] Frontend loads and displays UI
- [ ] Login works (test with demo credentials)
- [ ] Products load from Odoo
- [ ] Customers load from Odoo
- [ ] Can create a draft order
- [ ] Offline mode works
- [ ] Order syncs when back online

### Load Testing

```bash
# Install artillery
npm install -g artillery

# Create test-load.yml
config:
  target: 'https://us-central1-samm-611c3.cloudfunctions.net/api'
  phases:
    - duration: 60
      arrivalRate: 5

scenarios:
  - flow:
      - get:
          url: "/health"
      - get:
          url: "/products"

# Run test
artillery run test-load.yml
```

---

## Step 10: Monitoring

### Firebase Console

Monitor:
- **Functions**: Executions, errors, duration
- **Firestore**: Reads/writes, storage
- **Authentication**: Active users

### Vercel Analytics

Enable in Vercel dashboard for:
- Page views
- Performance metrics
- Error tracking

### Custom Logging

Already implemented with Winston in backend:

```typescript
import { logger } from 'firebase-functions';

logger.info('Order created', { orderId, customerId });
logger.error('Odoo sync failed', { error: err.message });
```

---

## Troubleshooting

### Backend Issues

**"Odoo authentication failed"**
- Check `ODOO_URL`, `ODOO_DB`, credentials
- Test with `node test-odoo18-connection.js`

**"CORS errors"**
- Ensure `cors({ origin: true })` in Express
- Check Vercel domain is allowed

### Frontend Issues

**"API not found"**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check Firebase Functions deployment

**"Offline mode not working"**
- Check Service Worker registration
- Verify localStorage is not full

---

## Post-Deployment

### 1. Create Production Users

In Firebase Authentication console, add users:
- Salespersons
- Sales managers  
- Admins

### 2. Link Users to Odoo

In Firestore, ensure each user has `profile.odooUserId`

### 3. Configure Firebase App Check (Recommended)

Protect against abuse:

```bash
firebase appcheck:enable --project samm-611c3
```

### 4. Setup Backup Strategy

- **Firestore**: Auto-backups in Firebase console
- **Functions Code**: Git repository
- **Odoo**: Follow Odoo backup best practices

---

## Maintenance

### Update Dependencies

```bash
# Backend
cd backend/functions
npm update

# Frontend
cd frontend
npm update
```

### Monitor Costs

- Firebase Functions: ~$0.40 per million invocations
- Firestore: Free tier sufficient for MVP
- Vercel: Free for hobby projects

---

## URLs

- **Frontend**: https://your-vercel-app.vercel.app
- **Backend API**: https://us-central1-samm-611c3.cloudfunctions.net/api
- **Firebase Console**: https://console.firebase.google.com/project/samm-611c3

---

## Support

For issues:
1. Check logs in Firebase/Vercel consoles
2. Review error messages
3. Test Odoo connection separately
4. Verify environment variables

**Your app is ready for deployment! 🚀**
