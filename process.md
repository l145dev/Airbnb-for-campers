# Airbnb for campers
Here, I will document the entire process of me creating Airbnb for campers.

## Research

### Pages

- Brainstorm essential pages with inspiration from [Airbnb](https://airbnb.com) 
- Create user and owner pages. Owner will have access to all user pages. 
- Additional pages for people with properties on airbnb (owners).
- **User:** Home, Login, Register, ForgotPassword, SearchListings, SearchResults, PropertyListingDetails, BookProperty, TripsDashboard, (Extra) Notifiications
- **Owner:** PropertyDashboard, ListPropertyInfo, ListPropertySteps

## Database

### Create Database

1. Prompt Gemini with all necessities from the research phase, this gives initial SQL file.
2. Review SQL file and make changes to tables, columns and column details where needed.
3. Copy and paste SQL code in PostgreSQL query (pgAdmin 4) in new database called "airbnbdb".

### Add (dummy) values

- to do

## Frontend (Wireframing & Design)

### Design in Figma

[Link to Figma](https://www.figma.com/design/qVHicDrQJj22ktJG8Av48w/Airbnb-for-campers?node-id=0-1&t=A8fgqenPBBauZoPE-1)

### Design theme

- Create logo variations in [Photopea](https://www.photopea.com/)
- Create design theme in Figma (for consistency)

### UI/UX - Creating Pages

- Design Navbar
- Design home page
- Design login page
- Design register page
- Design settings page
- Design support page
- Design forgot password page(s)
- Design searchlistings page
- Design searchresults page
- Design propertydetails page
- Design bookproperty page
- Design tripsdashboard page
- Design notifications page
- Design owner_listpropertyinfo page
- Design owner_propertydashboard page
- Design owner_listproperty page

## Backend

### Create backend (NodeJS - ExpressJS)

- Set up backend with NodeJS (ExpressJS).
```bash
cd backend
```
```bash
express
```
```bash
npm install
```
- Remove views (backend as API only)
- Update ES5 code to ES6+

### Prisma setup

1. Install prisma as devDependency
``` bash
npm install prisma --save-dev
```

2. Install prisma client
``` bash
npm install @prisma/client
```

3. initialize prisma in folder 
``` bash
npx prisma init
```

3. Make .env file with database url in prisma folder
``` env
DATABASE_URL="postgresql://username:password@localhost:5432/airbnbdb"
```

4. import the database from mysql server (will add db structure in schema.prisma)
``` bash
npx prisma db pull
```

5. If error, make sure DATABASE_URL is correct in .env

6. Generate prisma client
``` bash
npx prisma generate
```

7. now u can use prisma in your routes like this 
``` js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
```

### Test backend API & DB connection

- API is NOT functioning.
- Prisma DB connection is NOT functioning.

> [!NOTE]
> A whole lot of debugging later...

- API is functioning.
- Prisma DB connection is functioning.

### Test API twith dummy data from DB

1. Use airbnb_for_campers.sql code as context for Gemini to generate dummy data
2. Insert dummy data in DB (dummy data in airbnb_for_campers_dummy_data.sql)

Fetching data works.

### Login

1. Request email and password from frontend in body
2. check if username and password exists, if not throw error
3. check if user exists with the email, if not throw error
4. check if password matches (compare with bcrypt), if no match, throw error
5. log in if all steps successful

#### Added features

- Rate limitation to prevent brute force attacks
- Try catch to handle unexpected errors