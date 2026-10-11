# বাজার দর / BazarDor

**BazarDor** is a Bangla-language market price guide for everyday products in Bangladesh. Browse current prices, compare market changes, and find product information in one place.

## Features

1. **Daily price overview** — Browse everyday product prices and percentage changes.
2. **Price movement highlights** — Quickly see products with rising or falling prices.
3. **Category browsing** — Explore products by category and sort the available results.
4. **Product details** — Review price history and market price ranges where available.
5. **Account access** — Create an account or sign in with email and password or Google OAuth.

## Technologies

- [Next.js](https://nextjs.org/) 16 with the App Router
- [React](https://react.dev/) 19 and [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4 and [DaisyUI](https://daisyui.com/)
- [Better Auth](https://www.better-auth.com/) for authentication
- [MongoDB](https://www.mongodb.com/) with the Better Auth MongoDB adapter
- External REST APIs for product and market price data

## Getting Started

### Requirements

- Node.js
- npm
- MongoDB connection string

### Setup

1. Install dependencies:

	```bash
	npm install
	```

2. Create a `.env` file in the project root and configure the required values:

	```dotenv
	BAZARDOR_API_URL=https://api.api-store.workers.dev/api/bazardor
	BETTER_AUTH_SECRET=replace-with-a-long-random-secret
	BETTER_AUTH_URL=http://localhost:3000
	MONGODB_URL=your-mongodb-connection-string
	GOOGLE_CLIENT_ID=your-google-oauth-client-id
	GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
	```

	Google sign-in requires an OAuth client configured with this authorized redirect URI:

	```text
	http://localhost:3000/api/auth/callback/google
	```

3. Start the development server:

	```bash
	npm run dev
	```

4. Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the production application |
| `npm run start` | Run the production server |
| `npm run lint` | Run ESLint |
