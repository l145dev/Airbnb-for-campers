# Organized API Routes

**Default URL (Development):** `localhost:3000`

## Authentication

### /login
- **POST /login**:
    - **Body:** `{ email, pwd }`
    - **Response:** `session cookie`, redirect to `prev page` (using React Router's `back`)
    - **Optional:**
        - **POST /auth/google**
        - **POST /auth/microsoft**

### /register
- **POST /register**:
    - **Body:** `{ fn, ln, email, pwd }`
    - **Response:** `session cookie`, redirect to `prev page` (using React Router's `back`)
    - **Optional:**
        - **POST /auth/google**
        - **POST /auth/microsoft**

### /logout
- **POST /logout**:
    - **Body:** `none` (user\_id from cookie)
    - **Response:** `{ success: boolean }`

## User Settings

### /settings
- **GET /settings**:
    - **Body:** `none` (authenticated with cookie)
    - **Response:** `{ fn, ln, email, phone, pfp, is_owner, registration_date }`
- **PATCH /settings/update**:
    - **Body:** `{ first_name, last_name, phone_number, profile_picture }`
    - **Response:** `{ first_name, last_name, phone_number, profile_picture }`
- **DELETE /settings/delete**:
    - **Body:** `none` (user\_id from cookie)
    - **Response:** `{ success: boolean }`

## Support

### /support
- **POST /support**:
    - **Body:** `{ message }`
    - **Response:** `none` (no redirect)

## Reset Password

### /resetpassword
- **POST /resetpassword/code**:
    - **Body:** `{ email }`
    - **Response:** Sends email with reset code
- **POST /resetpassword/email**:
    - **Body:** `{ email, code }`
    - **Response:** Indicates success and guides user to password change step
- **POST /resetpassword/change**:
    - **Body:** `{ pwd }`
    - **Response:** Sends email confirming password change, directs user to login

## Listings & Search

### /listings
- **GET /listings**:
    - **Body:** `propType?` (optional)
    - **Response:** Array of all listings (optionally filtered by `propType`)

### /autocomplete
- **GET /autocomplete/search**:
    - **Body:** `{ query }`
    - **Response:** Array of location results matching the `query`

### /listings/search
- **GET /listings/search**:
    - **Body:** `{ location, checkin date, checkout date, # guests }`
    - **Response:** Redirects to `/searchresults` with filters applied in the URL query

### /property
- **GET /property**:
    - **URL Query:** `property_id`
    - **Optional Body:** `{ checkin date?, checkout date?, guests? }` (used in SearchResults/PropertyListingDetails)
    - **Response:** Navigates to `PropertyListingDetails` and displays all property details

## Search Results

### /listings (within SearchResults context)
- **GET /listings**:
    - **Body:** `propType?` (optional)
    - **Response:** Array of all listings (optionally filtered by `propType`)

### /autocomplete (within SearchResults context)
- **GET /autocomplete/search**:
    - **Body:** `{ query }`
    - **Response:** Array of location results matching the `query`

### /listings/search (within SearchResults context)
- **GET /listings/search**:
    - **Body:** `{ location, checkin date, checkout date, # guests }`
    - **Response:** URL with filters applied in the query parameters

### /property (within SearchResults context)
- **GET /property**:
    - **URL Query:** `property_id`
    - **Optional Body:** `{ checkin date?, checkout date?, guests? }`
    - **Response:** Navigates to `PropertyListingDetails` and displays all property details

## Property Listing Details

### /property
- **GET /property**:
    - **URL Query:** `property_id`
    - **Optional Body:** `{ checkin date?, checkout date?, guests? }`
    - **Response:** All details of the specified property

### /property/save
- **POST /property/save**:
    - **Body:** `{ property_id }`
    - **Response:** `{ saved: boolean }`

### /property/unsave
- **POST /property/unsave**:
    - **Body:** `{ property_id }`
    - **Response:** `{ unsaved: boolean }`

## Book Property

### /booking
- **GET /booking**:
    - **Response:** `{ authenticated: boolean }` (indicates if user is logged in)
- **Payment (using Stripe, optional PayPal, Google Pay):**
    - **POST /booking/pay/card**:
        - **Body:** `{ check in date, check out date, property_id, card number, card expiration, cvv, street address, appartment number?, city, country, zip code }` (user\_id from session)
    - **(Optional) POST /booking/pay/paypal**:
        - **Body:** `{ check in date, check out date, property_id, card number, card expiration, cvv, street address, appartment number?, city, country, zip code }` (user\_id from session)
    - **(Optional) POST /booking/pay/googlepay**:
        - **Body:** `{ check in date, check out date, property_id, card number, card expiration, cvv, street address, appartment number?, city, country, zip code }` (user\_id from session)
- **Note:** Includes all login/register routes for user authentication if needed during booking.

## Trips Dashboard

### /trips
- **GET /trips**:
    - **Body:** `none` (user\_id from cookie)
    - **Response:** Object containing booking information for each trip: `{ property_id, property image, property owner, property rating, property reviews count, booking id, check in date, check out date, number of guests, total price, booking status }`

### /trips/review
- **POST /trips/review**:
    - **Body:** `{ property_id, rating, comment }` (user\_id from cookie)
    - **Response:** `{ success: boolean }`
- **GET /trips/review/:review_id**:
    - **Body:** `none`
    - **Response:** `{ review message, property name, review rating }`
- **PATCH /trips/review/:review_id**:
    - **Body:** `{ review message, review rating }`
    - **Response:** `{ success: boolean }`

### /trips/:booking_id
- **DELETE /trips/:booking_id**:
    - **Body:** `none`
    - **Response:** `{ success: boolean }`

## Notifications

### /notifications
- **GET /notifications**:
    - **Body:** `none` (user\_id from cookie)
    - **Response:** Array of notifications: `{ notification id, notification type, notification message, is_read, created at }`

### /notifications
- **DELETE /notifications**:
    - **Body:** `{ notification id }` (user\_id from cookie)
    - **Response:** `{ success: boolean }`

## Owner - List Property Intro

### /host
- **GET /host**:
    - **Optional Body:** `{ city?, nights?, propType? }`
    - **Response:** `{ user city (ip geolocation), average price per night in city, total price, properties object {property type, city, property name, rating, cover image only, price, guests} }` (for map display)

## Owner - Property Dashboard

### /hostdashboard
- **GET /hostdashboard**:
    - **Body:** `none` (user\_id from cookie)
    - **Response:** Object containing property summaries: `{ property_id, property name, property city, property country, property review count, property review id, property rating, next booking checkin/checkout?, sum property revenue, count property bookings, ADR, is_active }`

### /hostdashboard/:property_id
- **GET /hostdashboard/:property_id**:
    - **Body:** `none`
    - **Response:** Detailed property information: `{ name, description, street address, postcode, city, country, property type, checkin time, checkout time, price per night, guests, {has_parking: boolean, pet_friendly: boolean, ...}, note from owner }`

### /listings/:property_id/update
- **PATCH /listings/:property_id/update**:
    - **Body:** `{ name, description, street address, postcode, city, country, property type, checkin time, checkout time, price per night, guests, {has_parking: boolean, pet_friendly: boolean, ...}, note from owner }`
    - **Response:** Modified listing details

### /hostdashboard/:property_id/publish
- **PATCH /hostdashboard/:property_id/publish**:
    - **Body:** `{ is_active }`
    - **Response:** `{ toggled: boolean }`

### /listing/add
- **POST /listing/add**:
    - **Body:** `{ is_active (boolean), name, description, street address, postcode, city, country, property type, checkin time, checkout time, price per night, guests, {has_parking: boolean, pet_friendly: boolean, ...}, note_from_owner }`
    - **Response:** `{ is_active, success: boolean }`

## Owner - List Property Steps

- **Note:** Moved as a modal within the Owner Property Dashboard.