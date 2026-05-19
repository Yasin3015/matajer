Here is a quick, high-level developer documentation guide on how to interact with this API on the frontend.

The API uses a multi-tenant structure split into three main contexts: **Platform** (Super Admin), **System/Vendor Dashboard** (Store Managers), and **Store** (Public Front-End eCommerce).

---

## 1. Global Setup & Headers

Most requests require a few standard headers. Make sure your HTTP client (like Axios or Fetch) injects these dynamically:

* **`Accept: application/json`**: Required on all requests to ensure error/success payloads return as clean JSON.
* **`Content-Type: application/json`**: Used for post/put requests.
* **`Vendor: {{vendor_slug}}`**: **Crucial** for all vendor dashboard and public store requests so the backend knows which tenant database or store to scope data to.
* **`Authorization: Bearer {token}`**: Required for protected routes once a user/admin logs in.

---

## 2. Platform Module (Super Admin)

*Used for managing the entire multi-tenant SaaS application (plans, registering new vendors, overarching system admin management).*

### Authentication

* **Admin Login:** `POST {{base_url}}/platform/auth/login`
* *Payload:* `{ "identity": "...", "password": "...", "token": "fcm_token_here", "device": "..." }`
* *Action:* Save the returned bearer token to handle subsequent requests.


* **Admin Logout:** `POST {{base_url}}/platform/auth/logout`

### Core Entities

* **Admins:** `GET|POST|PUT|DELETE` to `/platform/admins` (Manage platform workers using ULID/string resource IDs).
* **Plans:** `GET|PUT` to `/platform/plans` (Define SaaS subscription limits like price, duration, `products_limit`, and `orders_limit`).
* **Vendors:** `GET|POST|PUT|DELETE` to `/platform/vendors` (Approve, modify, or shut down storefront tenants).

---

## 3. System / Vendor Dashboard Module

*Used when a business owner logs into their private portal to manage their specific store.*

### Authentication & Identification

* **Vendor Registration:** `POST {{base_url}}/vendor/register` (Public signup route for new shop owners).
* **Vendor Login:** `POST {{base_url}}/vendor/auth/login`
* *Headers required:* `Vendor: {{vendor_slug_or_id}}`


* **Vendor Logout:** `POST {{base_url}}/vendor/auth/logout`

### Dashboard Management (Scoped to Vendor)

Always pass the `Vendor` header and the specific vendor bearer token.

* **Sub-users/Staff:** `/vendor/users` (`GET`, `POST`, `PUT`, `DELETE` to manage shop workers).
* **Categories:** `/vendor/categories` (`GET`, `POST`, `PUT`, `DELETE` to manage product groups).
* **Products:** `/vendor/products` (`GET`, `POST`, `PUT`, `DELETE`).
* *Media Management:* To remove specific asset items, use `DELETE /vendor/product-media/{media-id}`.


* **Notifications:** `/notifications` (Fetch updates with pagination query params like `?page=2`, or mark them read using `/notifications/{id}/read`).

---

## 4. Front Store Module (Public Facing eCommerce)

*Used for building the customer-facing catalog website.*

### Product Browsing

* **Public Plans List:** `GET {{base_url}}/plans` (To show public landing page options).
* **Filter/Search Products:** `GET {{base_url}}/store/products`
* *Body / Query Params:* Supports filtering down results (e.g., `{ "min_price": 1000, "category_id": "...", "search": "query" }`).


* **Product Detail:** `GET {{base_url}}/store/products/{slug_or_id}` (Retrieves individual item details for product pages).
* **Category List:** `GET {{base_url}}/store/categories` (Fetch catalog navigation layout with support for search filters like `{ "search": "electronics" }`).

---

## Frontend Integration Tips

1. **Axios Interceptor Instance:** Create an instance of your request tool dedicated to client stores that injects the current tenant sub-domain/slug directly into the `Vendor` header dynamically.
2. **ID Strategy:** Take note that the IDs in the collection are string-based ULIDs/UUIDs (e.g., `01kqf40tac1hzctykakj14jtxs`). Make sure your routing setups expect alphanumeric strings rather than standard integers.
3. **Multipart Handling:** The admin update profiles use `multipart/form-data`. Ensure file payloads (like images/avatars) are mapped to a `FormData` object before hitting those endpoints. , Here is a quick, high-level developer documentation guide on how to interact with this API on the frontend.

The API uses a multi-tenant structure split into three main contexts: **Platform** (Super Admin), **System/Vendor Dashboard** (Store Managers), and **Store** (Public Front-End eCommerce).

---

## 1. Global Setup & Headers

Most requests require a few standard headers. Make sure your HTTP client (like Axios or Fetch) injects these dynamically:

* **`Accept: application/json`**: Required on all requests to ensure error/success payloads return as clean JSON.
* **`Content-Type: application/json`**: Used for post/put requests.
* **`Vendor: {{vendor_slug}}`**: **Crucial** for all vendor dashboard and public store requests so the backend knows which tenant database or store to scope data to.
* **`Authorization: Bearer {token}`**: Required for protected routes once a user/admin logs in.

---

## 2. Platform Module (Super Admin)

*Used for managing the entire multi-tenant SaaS application (plans, registering new vendors, overarching system admin management).*

### Authentication

* **Admin Login:** `POST {{base_url}}/platform/auth/login`
* *Payload:* `{ "identity": "...", "password": "...", "token": "fcm_token_here", "device": "..." }`
* *Action:* Save the returned bearer token to handle subsequent requests.


* **Admin Logout:** `POST {{base_url}}/platform/auth/logout`

### Core Entities

* **Admins:** `GET|POST|PUT|DELETE` to `/platform/admins` (Manage platform workers using ULID/string resource IDs).
* **Plans:** `GET|PUT` to `/platform/plans` (Define SaaS subscription limits like price, duration, `products_limit`, and `orders_limit`).
* **Vendors:** `GET|POST|PUT|DELETE` to `/platform/vendors` (Approve, modify, or shut down storefront tenants).

---

## 3. System / Vendor Dashboard Module

*Used when a business owner logs into their private portal to manage their specific store.*

### Authentication & Identification

* **Vendor Registration:** `POST {{base_url}}/vendor/register` (Public signup route for new shop owners).
* **Vendor Login:** `POST {{base_url}}/vendor/auth/login`
* *Headers required:* `Vendor: {{vendor_slug_or_id}}`


* **Vendor Logout:** `POST {{base_url}}/vendor/auth/logout`

### Dashboard Management (Scoped to Vendor)

Always pass the `Vendor` header and the specific vendor bearer token.

* **Sub-users/Staff:** `/vendor/users` (`GET`, `POST`, `PUT`, `DELETE` to manage shop workers).
* **Categories:** `/vendor/categories` (`GET`, `POST`, `PUT`, `DELETE` to manage product groups).
* **Products:** `/vendor/products` (`GET`, `POST`, `PUT`, `DELETE`).
* *Media Management:* To remove specific asset items, use `DELETE /vendor/product-media/{media-id}`.


* **Notifications:** `/notifications` (Fetch updates with pagination query params like `?page=2`, or mark them read using `/notifications/{id}/read`).

---

## 4. Front Store Module (Public Facing eCommerce)

*Used for building the customer-facing catalog website.*

### Product Browsing

* **Public Plans List:** `GET {{base_url}}/plans` (To show public landing page options).
* **Filter/Search Products:** `GET {{base_url}}/store/products`
* *Body / Query Params:* Supports filtering down results (e.g., `{ "min_price": 1000, "category_id": "...", "search": "query" }`).


* **Product Detail:** `GET {{base_url}}/store/products/{slug_or_id}` (Retrieves individual item details for product pages).
* **Category List:** `GET {{base_url}}/store/categories` (Fetch catalog navigation layout with support for search filters like `{ "search": "electronics" }`).

---

## Frontend Integration Tips

1. **Axios Interceptor Instance:** Create an instance of your request tool dedicated to client stores that injects the current tenant sub-domain/slug directly into the `Vendor` header dynamically.
2. **ID Strategy:** Take note that the IDs in the collection are string-based ULIDs/UUIDs (e.g., `01kqf40tac1hzctykakj14jtxs`). Make sure your routing setups expect alphanumeric strings rather than standard integers.
3. **Multipart Handling:** The admin update profiles use `multipart/form-data`. Ensure file payloads (like images/avatars) are mapped to a `FormData` object before hitting those endpoints.
1. Platform Module (Super Admin)
POST Admin Login
URL: {{base_url}}/platform/auth/login

Headers:

Content-Type: application/json

Accept: application/json

Body (JSON):

JSON
{
    "identity": "admin@system.com",
    "password": "123456",
    "token": "fcm_token_example_123456", // Firebase cloud messaging token for push notifications
    "device": "android_phone_hassan"
}
POST Admin Logout
URL: {{base_url}}/platform/auth/logout

Headers:

Authorization: Bearer {{token}}

Content-Type: application/json

Accept: application/json

Body: None (Empty)

GET List Admins
URL: {{base_url}}/platform/admins

Headers:

Authorization: Bearer {{token}}

Accept: application/json

GET Show Admin Details
URL: {{base_url}}/platform/admins/{admin_id} (e.g., /platform/admins/01kqf40tac1hzctykakj14jtxs)

Headers:

Authorization: Bearer {{token}}

Accept: application/json

POST Create Admin
URL: {{base_url}}/platform/admins

Headers:

Authorization: Bearer {{token}}

Accept: application/json

Body (JSON):

JSON
{
    "name": "malik",
    "email": "malik@system.com",
    "phone": "01234567892",
    "password": "password123",
    "password_confirmation": "password123"
}
PUT Update Admin Profile / Password
URL: {{base_url}}/platform/admins/{admin_id}

Headers:

Authorization: Bearer {{token}}

Content-Type: multipart/form-data (Note: Send as form-data if uploading assets like profile pictures)

Accept: application/json

Body (JSON / Form Data):

JSON
{
    "password": "password123",
    "password_confirmation": "password123"
}
DELETE Delete Admin
URL: {{base_url}}/platform/admins/{admin_id}

Headers:

Authorization: Bearer {{token}}

Accept: application/json

GET List Subscription Plans (Platform View)
URL: {{base_url}}/platform/plans

Headers:

Authorization: Bearer {{token}}

Accept: application/json

GET Show Single Plan Details
URL: {{base_url}}/platform/plans/{plan_id}

Headers:

Authorization: Bearer {{token}}

Accept: application/json

PUT Update Subscription Plan Settings
URL: {{base_url}}/platform/plans/{plan_id}

Headers:

Authorization: Bearer {{token}}

Accept: application/json

Body (JSON):

JSON
{
    "name": "Basic Plan",
    "price": 20,
    "duration_days": 60,
    "features": {
        "products_limit": 50,
        "orders_limit": 100,
        "support": "Email Only",
        "custom_domain": false
    },
    "is_active": true
}
GET List Vendors
URL: {{base_url}}/platform/vendors

Headers:

Authorization: Bearer {{token}}

Accept: application/json

POST Create/Store Vendor Instance
URL: {{base_url}}/platform/vendors

Headers:

Authorization: Bearer {{token}}

Accept: application/json

Body (JSON):

JSON
{
  "owner_name": "John Doe",
  "email": "john@example.com",
  "phone": "201012345678",
  "password": "123456",
  "password_confirmation": "123456",
  "vendor_name": "Tech World Store",
  "slug": "tech-world-store",
  "custom_domain": "store.techworld.com"
}
PUT Update Vendor Details
URL: {{base_url}}/platform/vendors/{vendor_id}

Headers:

Authorization: Bearer {{token}}

Accept: application/json

Body (JSON):

JSON
{
  "vendor_name": "Tech World Updated",
  "slug": "tech-world-updated",
  "custom_domain": "shop.techworld.com",
  "owner_name": "John Updated",
  "email": "newemail@example.com",
  "is_active": true
}
DELETE Delete Vendor
URL: {{base_url}}/platform/vendors/{vendor_id}

Headers:

Authorization: Bearer {{token}}

Accept: application/json

2. System / Vendor Dashboard Module
POST Public Vendor Registration (SaaS Sign-up)
URL: {{base_url}}/vendor/register

Headers:

Accept: application/json

Body (JSON):

JSON
{
  "owner_name": "John Carter",
  "email": "john.carter@example.com",
  "phone": "201012345678",
  "password": "secret123",
  "password_confirmation": "secret123",
  "vendor_name": "Tech World Store",
  "slug": "tech-world-store",
  "custom_domain": "store.techworld.com"
}
POST Vendor Dashboard Login
URL: {{base_url}}/vendor/auth/login

Headers:

Content-Type: application/json

Accept: application/json

Vendor: {{vendor_slug}} (Tells the system which tenant portal is logging in)

Body (JSON):

JSON
{
    "identity": "admin@vendor.com",
    "password": "123456",
    "token": "fcm_token_example_78912",
    "device": "android_phone_vendor"
}
POST Vendor Dashboard Logout
URL: {{base_url}}/vendor/auth/logout

Headers:

Authorization: Bearer {{token_vendor}}

Content-Type: application/json

Accept: application/json

Body: None

GET List Vendor Sub-Users / Staff
URL: {{base_url}}/vendor/users

Headers:

Authorization: Bearer {{token_vendor}}

Accept: application/json

Vendor: {{vendor_slug}}

POST Create Vendor Sub-User / Staff
URL: {{base_url}}/vendor/users

Headers:

Authorization: Bearer {{token_vendor}}

Accept: application/json

Vendor: {{vendor_slug}}

Body (JSON):

JSON
{
    "name": "John Vendor",
    "email": "john.vendor@example.com",
    "phone": "01012345678",
    "password": "123456",
    "is_active": true
}
PUT Update Vendor Sub-User / Staff
URL: {{base_url}}/vendor/users

Headers:

Authorization: Bearer {{token_vendor}}

Accept: application/json

Vendor: {{vendor_slug}}

Body (JSON): (Same properties as Create)

DELETE Delete Vendor Sub-User
URL: {{base_url}}/vendor/users/{user_id}

Headers:

Authorization: Bearer {{token_vendor}}

Accept: application/json

Vendor: {{vendor_slug}}

GET List Notifications
URL: {{base_url}}/notifications

Query Parameters: ?page=2 (optional, for pagination pagination handling)

Headers:

Authorization: Bearer {{token}}

Accept: application/json

GET Mark Notification as Read
URL: {{base_url}}/notifications/{notification_id}/read

Headers:

Authorization: Bearer {{token}}

Accept: application/json

DELETE Delete Notification
URL: {{base_url}}/notifications/{notification_id}

Headers:

Authorization: Bearer {{token}}

Accept: application/json

3. Store Management & Catalog Module
GET List Vendor Categories
URL: {{base_url}}/vendor/categories

Headers:

Authorization: Bearer {{token_vendor}}

Accept: application/json

Vendor: {{vendor_slug}}

POST Create Category
URL: {{base_url}}/vendor/categories

Headers:

Authorization: Bearer {{token_vendor}}

Accept: application/json

Vendor: {{vendor_slug}}

Body (JSON):

JSON
{
  "name": "Electronics",
  "slug": "electronics",
  "description": "الكترونيات وأجهزة ذكية"
}
PUT Update Category
URL: {{base_url}}/vendor/categories/{category_id}

Headers:

Authorization: Bearer {{token_vendor}}

Accept: application/json

Vendor: {{vendor_slug}}

Body (JSON):

JSON
{
  "name": "الكترونيات محدثة",
  "slug": "electronics",
  "description": "الكترونيات وأجهزة ذكية"
}
DELETE Delete Category
URL: {{base_url}}/vendor/categories/{category_id}

Headers:

Authorization: Bearer {{token_vendor}}

Accept: application/json

Vendor: {{vendor_slug}}

GET List Vendor Products
URL: {{base_url}}/vendor/products

Headers:

Authorization: Bearer {{token_vendor}}

Accept: application/json

Vendor: {{vendor_slug}}

POST Create Product
URL: {{base_url}}/vendor/products

Headers:

Authorization: Bearer {{token_vendor}}

Accept: application/json

Vendor: {{vendor_slug}}

Body (JSON):

JSON
{
  "category_id": "01krw8hywet78v1h1eds5g6vw7",
  "name": "iPhone 15 Pro",
  "slug": "iphone-15-pro",
  "description": "Latest Apple smartphone",
  "price": 55000,
  "price_before": 62000,
  "stock": 10
}
PUT Update Product
URL: {{base_url}}/vendor/products/{product_id}

Headers:

Authorization: Bearer {{token_vendor}}

Accept: application/json

Vendor: {{vendor_slug}}

Body (JSON): (Modify attributes as needed using the structure from Create Product)

DELETE Delete Product
URL: {{base_url}}/vendor/products/{product_id}

Headers:

Authorization: Bearer {{token_vendor}}

Accept: application/json

Vendor: {{vendor_slug}}

DELETE Delete Specific Product Media File
URL: {{base_url}}/vendor/product-media/{media_id}

Headers:

Authorization: Bearer {{token_vendor}}

Accept: application/json

Vendor: {{vendor_slug}}

4. Front Store Module (Public Facing eCommerce Layouts)
GET View Public SaaS Plans
URL: {{base_url}}/plans

Headers:

Accept: application/json

GET Show Single Public SaaS Plan
URL: {{base_url}}/plans/{id}

Headers:

Accept: application/json

GET Query/Filter Public Products Catalog
URL: {{base_url}}/store/products

Headers:

Accept: application/json

Vendor: {{vendor_slug}}

Body (JSON payload for advanced client-side search filtering):

JSON
{
  "category_id": "01HXYZABC123", // Optional
  "search": "iphone",            // Optional
  "min_price": 1000             // Optional
}
GET View Individual Product Page Details
URL: {{base_url}}/store/products/{slug_or_id}

Headers:

Accept: application/json

Vendor: {{vendor_slug}}

GET List Public Categories (With Text Matching Filter)
URL: {{base_url}}/store/categories

Headers:

Accept: application/json

Vendor: {{vendor_slug}}

Body (JSON):

JSON
{
  "search": "el"
}