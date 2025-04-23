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

1. Use airbnb_for_campers.sql code as context for Gemini to generate dummy data
2. Insert dummy data in DB (dummy data in airbnb_for_campers_dummy_data.sql)

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

### Design backend structure

Go through each page in Figma and note down routes needed for each page.

#### Organized routes
This section is messy because I wrote this quickly while designing it, to view a better documented version (summarized by Gemini) go here: [api_structure](./api_structure.md) <br><br>
default URL in dev: localhost:3000

**Login**:
- POST /login → (body: email, pwd) → (return: session cookie, prev page with react router (back))
- (optional) POST /auth/google
- (optional) POST /auth/microsoft

**Register**:
- POST /register → (body: fn, ln, email, pwd) → (return: session cookie, prev page with react router (back))
- (optional) POST /auth/google
- (optional) POST /auth/microsoft

**Settings**:
- GET /settings → (body: none, auth with cookie) → (return: fn, ln, email, phone, pfp, is_owner, registration_date)
- PATCH /settings/update → (body: first_name, last_name, phone_number, profile_picture) → (return: first_name, last_name, phone_number, profile_picture)
- DELETE /settings/delete → (body: none; user_id in cookie) → (return: success boolean)
- POST /logout → (body: none; user_id in cookie) → (return: success boolean)

**Support**:
- POST /support → (body: message) → (redirect: none)

**ResetPassword**:
- POST /resetpassword/code → (body: email) → (return: email with code)
- POST /resetpassword/email → (body: email, code) → (return: step 2 - change pwd)
- POST /resetpassword/change → (body: pwd) → (return: email confirming pwd change, go to login)

**SearchListings**:
- GET /listings → (body: propType?) → (return: all listings (with type))
- GET /autocomplete/search → (body: query) autocomplete when typing location (return: location results)
- GET /listings/search → (body: location, checkin date, checkout date, # guests) → (return: url with filters applied in url query, sent to searchresults)
- GET /property → (url query: property_id) → (return: go to PropertyListingDetails and display ALL property details)

**SearchResults**:
- GET /listings → (body: propType?) → (return: all listings (with type))
- GET /autocomplete/search → (body: query) autocomplete when typing location (return: location results)
- GET /listings/search → (body: location, checkin date, checkout date, # guests) → (return: url with filters applied in url query)
- GET /property → (url query: property_id; body: checkin date?, checkout date?, guests?) → (return: go to PropertyListingDetails and display ALL property details)

**PropertyListingDetails**:
- GET /property → (url query: property_id; body: checkin date?, checkout date?, guests?) → (return: ALL property details)
- POST /property/save → (body: property_id) → (return: saved boolean (success flag))
- POST /property/unsave → (body: property_id) → (return: unsaved boolean (success flag))

**BookProperty**:
- GET /booking → (return: authenticated boolean)
- All login/register routes in case need to log in/register
- NOTE FOR PAYMENT: use STRIPE for POST /booking/pay/card (optional: embed) 
- POST /booking/pay/card → (body: check in date, check out date, property_id; user_id in session, card number, card expiration, cvv, street address, appartment number?, city, country, zip code)
- (optional) POST /booking/pay/paypal → (body: check in date, check out date, property_id; user_id in session, card number, card expiration, cvv, street address, appartment number?, city, country, zip code)
- (optional) POST /booking/pay/googlepay → (body: check in date, check out date, property_id; user_id in session, card number, card expiration, cvv, street address, appartment number?, city, country, zip code)

**TripsDashboard**:
- GET /trips → (body: user_id in cookie) → (return: object of objects with: property_id, property image, property owner, property rating, property reviews count, booking id, check in date, check out date, number of guests, total price, booking status)
- POST /trips/review → (body: property_id, rating, comment; user_id in cookie) → (return: success boolean)
- GET /trips/review → (body: none; review_id in params) → (return: review message, property name, review rating)
- PATCH /trips/review/:review_id → (body: review_id in params, review message, review rating) → (return: success boolean)
- DELETE /trips/:booking_id → (body: none, booking_id in params) → (return: success boolean)

**Notifications**:
- GET /notifications → (body: user_id in cookie) → (return: notification id, notification type, notification message, is_read, created at)
- DELETE /notifications → (body: notification id; user_id in cookie) → (return: success boolean)

**Owner_ListPropertyIntro**:
- GET /host → (body: city?, nights?, propType?) → (return: user city (ip geolocation), average price per night in city, total price, properties object {property type, city, property name, rating, cover image only, price, guests} (to display on map))

**Owner_PropertyDashboard**:
- GET /hostdashboard → (body: user_id in cookie) → (return: object of objects: property_id, property name, property city, property country, property review count, property review id, property rating, next booking checkin/checkout?, sum property revenue, count property bookings, ADR, is_active)
- GET /hostdashboard/:property_id → (body: none; property id in params) → (return: name, description, street address, postcode, city, country, property type, checkin time, checkout time, price  per night, guests,  {has_parking: false, pet_friendly: false, etc}, note from owner)
- PATCH /listings/:property_id/update → (body: name, description, street address, postcode, city, country, property type, checkin time, checkout time, price  per night, guests,  {has_parking: false, pet_friendly: false, etc}, note from owner) → (return: modified listing details)
- PATCH /hostdashboard/:property_id/publish → (body: is_active; property_id in params) → (return: toggled boolean)
- POST /listing/add → (body: is_active (bool to check if instant publish or save for later), name, description, street address, postcode, city, country, property type, checkin time, checkout time, price per night, guests, {has_parking: false, pet_friendly: false, etc}, note_from_owner) → (return: is_active, success boolean)

**Owner_ListPropertySteps**:
- Moved as modal in owner_propertydashboard

### Postman

To test the endpoints, i will use Postman's handy collection feature in which i can save endpoints and continuously test them to make sure every endpoint keeps working as intended when adding code to identify any bugs created in the process.

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
- Remove views (backend as API (server) only)
- Update ES5 code to ES6+

### Prisma setup

> [!CAUTION]
> Using Prisma for this project is overkill, most SQL statements aren't complicated enough for Prisma to have any benefits, would just create additional server load in this case, using it for learning purposes (and extra points) only.

Prisma setup in this markdown file:
[Prisma Setup](prisma_setup.md)

### Test backend API & DB connection

- API is NOT functioning.
- Prisma DB connection is NOT functioning.

> [!NOTE]
> A whole lot of debugging later...

- API is functioning.
- Prisma DB connection is functioning.

### Test API twith dummy data from DB

- Fetching data works.

### Login

1. Request email and password from frontend in the request body.
2. Check if email and password exist (not empty from frontend). If not, return a 400 error with a descriptive message.
3. Check if a user exists in the database with the provided email. If not, return a 401 error indicating invalid credentials.
4. Check if the provided password matches the hashed password stored in the database using bcrypt. If no match, return a 401 error indicating invalid credentials.
5. If all steps are successful, establish a session for the user. This typically involves setting a session cookie in the user's browser. Return a 200 success message, potentially with basic user information (excluding sensitive details like the password hash).

#### Added features

- Rate limitation to prevent brute force attacks.
- Try-catch block to handle unexpected errors and return a 500 error with a generic message.
- Session cookie-based authentication to allow users to stay logged in across requests without sending tokens.

### Register

1. Request firstname, lastname, email, and password from frontend in the request body.
2. Check if firstname, lastname, email, and password exist (not empty from frontend). If not, return a 400 error with a descriptive message.
3. Validate the format of the email and password (e.g., using regular expressions or validation libraries). Return a 400 error if the format is invalid.
4. Check if a user with the provided email already exists in the database. If so, return a 400 error indicating that the email is already registered (potentially suggesting a login).
5. Hash the provided password using bcrypt with a suitable salt.
6. Create a new user record in the database with the received firstname, lastname, email, and the hashed password.
7. If registration is successful, automatically establish a session for the newly registered user (similar to the login process). Return a 201 Created status with a success message and potentially basic user information.

#### Added features

- Try-catch block to handle unexpected errors and return a 500 error with a generic message.
- Email and password format validation.
- Automatically log in the user upon successful registration by creating a session.
- Session cookie-based authentication for maintaining user sessions.

### Settings

**Get details**:
1. Check if a valid session exists for the user making the request. If not, return a 401 Unauthorized error.
2. Retrieve the user details from the database using the `user_id` stored in the session.
3. Return a JSON response containing the requested user details.

**Update details**:
1. Check if a valid session exists for the user making the request. If not, return a 401 Unauthorized error.
2. Retrieve the `user_id` from the session.
3. Get the new values for user details from the request body.
4. Compare the new values with the existing user details fetched from the database. Update only the fields that have changed in the database.
5. After a successful update, fetch the updated user details from the database and return them in a JSON response.

#### Added features

- Session-based authentication to protect access to user details and the update functionality.
- Check if a value has changed before attempting to update it in the database for efficiency.

### Listings

1. get query
2. fix propType for filter usage
3. add filters to where clause
4. reinforce checkin and checkout to prevent unwanted behavior (i regret not using typescript, why did my 5's turn into 8's just because i didn't parse it into an int 😭 (bug hunting was killing me))
5. get all properties with where clause filters applied and select necessary fields
6. create promise which maps every object in the listings object to have owners
7. also add to the promise, checkin checkout filters, nullify if not available
8. resolve promises and filter out null values from the promise.

#### Added features

- a ton of logic (rewrote the code more times than ronaldo's total goals in his career -> i lied)
- a ton of bugs (probably many more that i have yet to discover)
- i hate working with dates
- option to directly enter filters details through url query to get all properties available

> [!NOTE]
> Transitioned from JWT authentication flow to session-based authentication flow (using cookies and postgresql session store), enhancing security and taking away 6 hours of my life because change doesn't come without absolutely random bugs (AI was useless and i have no idea how it works now)! 👍

### Autocomplete

**Owner - listing property (country selection)**:
1. Get unfinished country query (is sent every 3 letters typed).
2. Use [GeoDB API](http://geodb-cities-api.wirefreethought.com/) to fetch results, max 5, sorted by country name, with axios.
3. Post process data into object of country codes and country names.

**Owner - listing property (city selection - before/after country selected)**:
1. Get unfinished city query (is sent every 3 letters typed).
2. Conditionally modify API URL, if country is selected, use country code to narrow down city search result, if not, don't modify API URL.
3. Use [GeoDB API](http://geodb-cities-api.wirefreethought.com/) to fetch results, max 5, sorted by descending city population, with axios.
4. Post process data into array of cities.

**User - main search**:
1. Get unfinished query (is sent every 3 letters typed).
2. Use [GeoDB API](http://geodb-cities-api.wirefreethought.com/) to fetch COUNTRY results, max 2, sorted by country name, with axios.
3. Post process country data into array of necessary data only. (country)
4. Use [GeoDB API](http://geodb-cities-api.wirefreethought.com/) to fetch CITY results, max 3, sorted by descending city population, with axios.
5. Post process city data into array of necessary data only. (city, country)
6. Combine country and city results into 1 object {countries: [], cities: []}.

#### Added features

- Uses Axios for increased code readability. (was using https fetching, which was faster but a lot more code, went from ~250 lines of code with https to ~110 lines with axios)
- Streamlined city and country selections to 1 data source for consistency.
- Main search uses a 2-3 split, first 2 results are countries and last 3 are cities, totaling to 5 results.
- Rate limitation workaround by using 2 api keys for GeoDB, 1 for city search and 1 for country search, i'm too broke to afford a subscription. (previously had 1 second delay on fetch to avoid rate limitation, cut down fetch time from ~1.5s to ~0.5s with this new method)

### Support

1. Authenticate user
2. Check rate limit
3. Get message, check if available
4. Use Groq AI (llama-3.3-70b-versatile) to process message and make a subject line
5. If AI fails, use generic subject line
6. Create support record in DB.
7. Send mail to support email.
8. Send confirmation mail to user.

#### Added features

- User authentication (avoiding unauthorized support messages from randoms)
- Rate limitation (avoiding spam support messages)
- AI subject line creation, smart way to summarize hard to understand messages typed by people to make support more efficient.
- AI failsafe, if AI fails, generic subject line gets used.
- Sending mails through nodemailer and Combell SMTP.
- Save support details in database for history and reference. 
- Confirmation mail.

### Reset Password

1. Check if already authenticated
2. not authenticated, go to normal process -> reset code || already authenticated, directly change password (from step 17)
3. check if email exists
4. get user with email
5. get random integer (6 digit code)
6. create a database row with the code and user_id, set expity within 10 mins from now.
7. send code to user on noreply email
8. get email and code
9. check if email and code is provided
10. get user with email from db
11. find reset codes from db where user_id and code not used
12. check if any reset codes match criteria
13. check if code expired
14. check if code matches db code
15. authenticate user (log in with new session)
16. update all reset password table "used" values of that user to true (not reusable)
17. authenticate user
18. get new password
19. validate password
20. hash password
21. update user's password

#### Added features

- nothing special (nothing new at least)

### Property

**Getting property**:
1. get property_id and other filters
2. validate checkin and checkout
3. check if dates are available
4. check if guest limit isnt being exceeded for the property capacity
5. collect all property information
6. get owner
7. make 1 big object to store all information retrieved


**Saving/unsaving property**:
1. get property_id
2. check if save exists in table
3. if it doesnt exist, add the save (save)
4. if it does exist, remove the save (unsave)

#### Added features

- moved availibility checking to util folder so that it can be used in listings.js and in property.js to check availability (reusable)
- option to directly enter filters details through url query to get propertydetails

> [!NOTE]
> I will stop docuumenting the process here because i'm running out of tiime 