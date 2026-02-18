# Backend Aplikasi Kasir (POS System)

Backend API untuk aplikasi kasir menggunakan TypeScript, Prisma ORM, dan PostgreSQL dengan arsitektur yang rapi dan terstruktur.

## 🚀 Fitur Utama

- ✅ Authentication dengan JWT (Role: Admin & Cashier)
- ✅ Product Management (CRUD dengan pagination & search)
- ✅ Category Management
- ✅ Transaction/Sales dengan auto stock reduction
- ✅ Statistics & Reporting (Dashboard, Sales Report, Revenue Analysis)
- ✅ Swagger/OpenAPI Documentation
- ✅ Repository Pattern untuk clean architecture
- ✅ Input Validation dengan Zod
- ✅ Error Handling yang terstruktur

## 📋 Prerequisites

- Node.js (v18 atau lebih baru)
- PostgreSQL (v14 atau lebih baru)
- npm atau yarn

## 🛠️ Setup & Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Buat database PostgreSQL baru, lalu copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Edit file `.env` dan sesuaikan DATABASE_URL dengan konfigurasi PostgreSQL Anda:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/kasir_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3000
```

### 3. Run Migrations

```bash
npm run prisma:migrate
```

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

### 5. Seed Database (Optional)

Untuk mengisi database dengan data sample:

```bash
npm run prisma:seed
```

Data sample yang akan dibuat:

- 2 users (admin & cashier)
- 3 categories
- 6 products
- 1 sample transaction

**Login Credentials:**

- Admin: `admin@kasir.com` / `admin123`
- Cashier: `cashier@kasir.com` / `cashier123`

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## 📚 API Documentation

Setelah server berjalan, akses Swagger documentation di:

```
http://localhost:3000/api-docs
```

## 🗂️ Project Structure

```
kasir-BE/
├── src/
│   ├── config/          # Configuration (database, swagger)
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Express middlewares
│   ├── prisma/          # Prisma schema & migrations
│   ├── repositories/    # Database operations
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   ├── utils/           # Helper functions
│   ├── validators/      # Zod validation schemas
│   ├── app.ts           # Express app setup
│   └── index.ts         # Entry point
├── package.json
├── tsconfig.json
└── .env
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register user (Admin only)
- `GET /api/auth/me` - Get current user

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Products

- `GET /api/products` - Get all products (with pagination & search)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Transactions

- `GET /api/transactions` - Get all transactions (with filters)
- `GET /api/transactions/:id` - Get transaction detail
- `POST /api/transactions` - Create transaction

### Statistics

- `GET /api/statistics/dashboard` - Dashboard stats (today, week, month)
- `GET /api/statistics/sales` - Sales report
- `GET /api/statistics/products` - Best selling products
- `GET /api/statistics/revenue` - Revenue analysis

## 🛠️ Other Useful Commands

```bash
# View database in Prisma Studio
npm run prisma:studio

# Create a new migration
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset --schema=./src/prisma/schema.prisma
```

## 🔒 Environment Variables

| Variable       | Description                          | Default     |
| -------------- | ------------------------------------ | ----------- |
| DATABASE_URL   | PostgreSQL connection string         | -           |
| PORT           | Server port                          | 3000        |
| NODE_ENV       | Environment (development/production) | development |
| JWT_SECRET     | Secret key for JWT                   | -           |
| JWT_EXPIRES_IN | JWT expiration time                  | 7d          |
| CORS_ORIGIN    | Allowed CORS origin                  | \*          |

## 📝 License

ISC
