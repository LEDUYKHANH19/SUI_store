# SUI E-Commerce Platform

A production-ready e-commerce platform built with Next.js 15, Prisma, and SUI Blockchain Testnet.

## Features

- **Next.js 15 App Router**: Server and Client components.
- **Tailwind v4 & ShadCN UI**: Premium dark-mode ready design.
- **Prisma & PostgreSQL**: Robust database schema.
- **JWT Authentication**: Secure login and registration.
- **SUI Blockchain Integration**: Real Testnet payments using `@mysten/dapp-kit`.
- **Global State**: Zustand for shopping cart management.

## Prerequisites

- Node.js 18+
- Docker (for local PostgreSQL)
- SUI Wallet Extension (e.g., Sui Wallet, Suiet)

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Database**
   ```bash
   docker-compose up -d
   ```

3. **Configure Environment**
   Rename `.env.example` to `.env`. It contains default values that work with the local docker database.
   Make sure to replace `NEXT_PUBLIC_MERCHANT_SUI_ADDRESS` with your actual SUI Testnet address.

4. **Initialize Database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Payment Flow Demo

1. Register an account and login.
2. Go to Products and add items to your cart.
3. Proceed to Checkout.
4. Ensure your SUI wallet is set to **Testnet** and has SUI tokens (use the faucet inside the wallet).
5. Fill in the shipping address and click **Pay with SUI**.
6. Approve the transaction in your wallet popup.
7. The backend will verify the transaction hash and mark the order as PAID.
8. View your order history in your Profile.
