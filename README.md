# Airbnb for Campers

Available Online: https://www.l145.be/airbnb-camping/

A full-stack web application inspired by Airbnb, tailored for campers and hosts to list, discover, and book unique camping properties. The platform supports both regular users (guests) and property owners (hosts), providing a seamless experience for booking, hosting, and managing camping stays.

> [!IMPORTANT]  
> Not related to Airbnb, Inc., only made for educational purposes with inspiration from [Airbnb](https://airbnb.com/).

![Demo Screenshot](https://github.com/l145dev/Airbnb-for-campers/blob/main/homeAirbnbCamping.png)

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#local-installation)
- [Usage](#usage)
- [API Overview](#api-overview)
- [Database](#database)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

### For Campers (Users)
- Browse and search for camping properties by type, location, date, and guest count
- View detailed property information, amenities, reviews, and ratings
- Book properties with secure payment (Stripe, PayPal, Google Pay)
- Manage trips and booking history
- Leave reviews for properties after stays
- Receive notifications (booking confirmations, reminders, etc.)
- Support and password reset functionality

### For Hosts (Owners)
- Become a host and list new camping properties
- Manage property details, availability, and amenities
- View and manage bookings, revenue, and property performance
- Respond to reviews and manage notifications

### General
- Modern, responsive UI/UX (Figma-designed)
- Session-based authentication (secure cookies)
- Rate limiting and security best practices
- Email notifications (support, password reset)
- Autocomplete for city/country using GeoDB API
- Groq AI usage in support message subject line creation for more comprehensive support handling.

---

## Tech Stack

**Frontend:**
- React 19, TypeScript, Vite
- Tailwind CSS, shadcn/ui, Radix UI
- React Router, TanStack React Query
- Leaflet (interactive maps)
- Axios

**Backend:**
- Node.js, Express.js
- PostgreSQL (via Prisma ORM)
- Session management (express-session, connect-pg-simple)
- Authentication (cookie/session-based, with optional OAuth via Google/Microsoft)
- Stripe for payments
- Nodemailer for emails
- Rate limiting, CORS, dotenv

**Deployment:**
- **Backend:**
    * Render
- **Frontend:**
    * Combell Webhost
- **Database:**
    * Supabase
- **SMTP:**
    * Combell Webmail

**Other:**
- Figma (design)
- Photopea (logo)
- Postman (API testing)

---

## Access Online
https://www.l145.be/airbnb-camping

## Local Installation 

### Prerequisites
- Node.js (v18+ recommended)
- npm
- PostgreSQL

### Clone & Branch
1. Clone the repository
   ```bash
   git clone "https://github.com/l145dev/Airbnb-for-campers.git"
   cd Airbnb-for-campers
   ```
2. Navigate to development branch (local only)
   ```bash
   git checkout development
   ```

### Backend Setup

1. Navigate to `/backend`:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in `/backend` with the following structure:
   ```env
   NODE_ENV="development"

   # Session management
   SESSION_SECRET="iuasgfyu672rbejw"

   # Autocomplete locations
   GEODB_API_KEY="API_KEY"
   FALLBACK_GEODB_API_KEY="API_KEY"

   # Mailing
   COMBELL_SMTP_HOST="smtp-auth.mailprotect.be"
   COMBELL_SMTP_PORT="465"
   COMBELL_SMTP_USER_SUPPORT="support@l145.be"
   COMBELL_SMTP_USER_NOREPLY="noreply@l145.be"
   COMBELL_SMTP_PASSWORD="PASSWORD"

   # Groq AI
   GROQ_API_KEY="API_KEY"

   # Payments
   STRIPE_TEST_KEY="TEST_API_KEY"

   # Supabase Bucket
   SUPABASE_URL="BUCKET_URL"
   SUPABASE_KEY="KEY"

   # Database
   # If local:
   # DATABASE_URL="postgresql://username:password@localhost:5432/airbnbdb"

   # If using Supabase:
   DATABASE_URL="postgresql://postgres.username:password@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.username:password@aws-0-us-east-2.pooler.supabase.com:5432/postgres"
   ```

3. Set up the database:
   - Create the database (e.g., `airbnbdb` if local).
   - Import schema from `airbnb_for_campers.sql`.
   - (Optional) Import dummy data from `airbnb_for_campers_dummy_data.sql`.

4. Prisma setup:
   ```bash
   npx prisma generate
   npx prisma db pull
   ```

5. Start the backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```

### Frontend Setup
1. Navigate to `/frontend`:
   ```bash
   cd frontend
   npm install
   ```
2. Start the frontend development server:
   ```bash
   npm run dev
   ```
3. The app will be available at `http://localhost:5173` (or as specified by Vite).

---

## Usage
- Register as a user or host
- Search and book camping properties
- Manage your bookings and reviews
- Hosts can add/manage properties and view bookings

---

## API Overview

The backend exposes a RESTful API. Key endpoints include:

- **Authentication:** `/login`, `/register`, `/logout`
- **User Settings:** `/settings` (GET, PATCH, DELETE)
- **Listings & Search:** `/listings`, `/autocomplete/search`, `/listings/search`, `/property`
- **Booking:** `/booking`, `/booking/pay/card`, `/booking/pay/paypal`, `/booking/pay/googlepay`
- **Trips:** `/trips`, `/trips/review`, `/trips/:booking_id`
- **Notifications:** `/notifications`
- **Host Management:** `/host`, `/hostdashboard`, `/listing/add`, `/listings/:property_id/update`
- **Support:** `/support`
- **Password Reset:** `/resetpassword/code`, `/resetpassword/email`, `/resetpassword/change`

See [`api_structure.md`](./api_structure.md) for a full list and details.

---

## Database
- PostgreSQL database schema defined in `backend/prisma/schema.prisma`
- See `airbnb_for_campers.sql` for schema and `airbnb_for_campers_dummy_data.sql` for sample data
- Managed via Prisma ORM
- [Prisma Setup Guide](./prisma_setup.md)

---

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please follow best practices and write clear commit messages.

---

## License

This project is for educational purposes. For licensing or commercial use, please contact the author.

---

## Contact

- **Author:** Aryan Shah
- **Email:** [aryan.shah@l145.be](mailto:aryan.shah@l145.be)
- **GitHub:** [l145dev](https://github.com/l145dev/)
- **LinkedIn:** [Aryan Shah](https://www.linkedin.com/in/aryan-shah-l145/)

---

## Acknowledgements
- Inspired by [Airbnb](https://airbnb.com)
- Design: [Figma file](https://www.figma.com/design/qVHicDrQJj22ktJG8Av48w/Airbnb-for-campers?node-id=0-1&t=A8fgqenPBBauZoPE-1)
- Logo: [Photopea](https://www.photopea.com/)
