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


# Tere Is Some New End Points Need To be Implemented

# Note Not all the comming endpoints need to be Implemented Becasue some of them are Implemted In The Project

# API Documentation

## Table of Contents
- [1. Platform Admin Module](#1-platform-admin-module)
  - [Auth](#auth)
  - [Admins](#admins)
  - [Subscription Plans](#subscription-plans)
  - [Vendors](#vendors)
- [2. System / Vendor Dashboard Module](#2-system--vendor-dashboard-module)
  - [Auth](#auth-1)
  - [Sub-Users / Staff](#sub-users--staff)
  - [Notifications](#notifications)
- [3. Store Management & Catalog Module](#3-store-management--catalog-module)
  - [Category Management](#category-management)
  - [Product & Media Management](#product--media-management)
- [4. Clients & CRM Management Module](#4-clients--crm-management-module)
- [5. Vendor Fulfillment Orders Module](#5-vendor-fulfillment-orders-module)
- [6. Front Store Module](#6-front-store-module)

## 1. Platform Admin Module

### Auth

#### POST Admin Logout
```http
POST {{base_url}}/platform/auth/logout
Authorization: Bearer {{token}}
Accept: application/json
```

### Admins

#### GET List Admins
```http
GET {{base_url}}/platform/admins
Authorization: Bearer {{token}}
Accept: application/json
```

#### GET Show Admin Details
```http
GET {{base_url}}/platform/admins/{admin_id}
Authorization: Bearer {{token}}
Accept: application/json
```
*Example:* `{{base_url}}/platform/admins/01kqf40tac1hzctykakj14jtxs`

#### POST Create Admin
```http
POST {{base_url}}/platform/admins
Authorization: Bearer {{token}}
Accept: application/json
```
**Body (JSON):**
```json
{
    "name": "malik",
    "email": "malik@system.com",
    "phone": "01234567892",
    "password": "password123",
    "password_confirmation": "password123"
}
```

#### PUT Update Admin Profile / Password
```http
PUT {{base_url}}/platform/admins/{admin_id}
Authorization: Bearer {{token}}
Content-Type: multipart/form-data  (If uploading profile assets)
Accept: application/json
```
**Body (JSON / Form Data):**
```json
{
    "password": "password123",
    "password_confirmation": "password123"
}
```

#### DELETE Delete Admin
```http
DELETE {{base_url}}/platform/admins/{admin_id}
Authorization: Bearer {{token}}
Accept: application/json
```

### Subscription Plans

#### GET List Subscription Plans (Platform Admin View)
```http
GET {{base_url}}/platform/plans
Authorization: Bearer {{token}}
Accept: application/json
```

#### GET Show Single Plan Details
```http
GET {{base_url}}/platform/plans/{plan_id}
Authorization: Bearer {{token}}
Accept: application/json
```

#### PUT Update Subscription Plan Settings
```http
PUT {{base_url}}/platform/plans/{plan_id}
Authorization: Bearer {{token}}
Accept: application/json
```
**Body (JSON):**
```json
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
```

### Vendors

#### GET List All Registered Vendors
```http
GET {{base_url}}/platform/vendors
Authorization: Bearer {{token}}
Accept: application/json
```

#### POST Create Vendor Instance
```http
POST {{base_url}}/platform/vendors
Authorization: Bearer {{token}}
Accept: application/json
```
**Body (JSON):**
```json
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
```

#### PUT Update Vendor Instance Details
```http
PUT {{base_url}}/platform/vendors/{vendor_id}
Authorization: Bearer {{token}}
Accept: application/json
```
**Body (JSON):**
```json
{
  "vendor_name": "Tech World Updated",
  "slug": "tech-world-updated",
  "custom_domain": "shop.techworld.com",
  "owner_name": "John Updated",
  "email": "newemail@example.com",
  "is_active": true
}
```

#### DELETE Delete Vendor
```http
DELETE {{base_url}}/platform/vendors/{vendor_id}
Authorization: Bearer {{token}}
Accept: application/json
```

## 2. System / Vendor Dashboard Module

> Used when an authenticated manager or user configures entities on a specific storefront portal.

### Auth

#### POST Public Vendor Registration (SaaS Landing Page Signup)
```http
POST {{base_url}}/vendor/register
Accept: application/json
```
**Body (JSON):**
```json
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
```

#### POST Vendor Dashboard Login
```http
POST {{base_url}}/vendor/auth/login
Content-Type: application/json
Accept: application/json
Vendor: {{vendor_slug}}  (Crucial to identify target store database context)
```
**Body (JSON):**
```json
{
    "identity": "admin@vendor.com",
    "password": "123456",
    "token": "fcm_token_example_78912",
    "device": "android_phone_vendor"
}
```
> Save this token separate from your superadmin token as `{{token_vendor}}`

#### POST Vendor Dashboard Logout
```http
POST {{base_url}}/vendor/auth/logout
Authorization: Bearer {{token_vendor}}
Accept: application/json
```

### Sub-Users / Staff

#### GET List Vendor Sub-Users / Staff members
```http
GET {{base_url}}/vendor/users
Authorization: Bearer {{token_vendor}}
Vendor: {{vendor_slug}}
Accept: application/json
```

#### POST Create Vendor Sub-User / Staff
```http
POST {{base_url}}/vendor/users
Authorization: Bearer {{token_vendor}}
Vendor: {{vendor_slug}}
Accept: application/json
```
**Body (JSON):**
```json
{
    "name": "John Vendor",
    "email": "john.vendor@example.com",
    "phone": "01012345678",
    "password": "123456",
    "is_active": true
}
```

#### PUT Update Vendor Sub-User / Staff
```http
PUT {{base_url}}/vendor/users
Authorization: Bearer {{token_vendor}}
Vendor: {{vendor_slug}}
Accept: application/json
```
**Body (JSON):** (Same attributes as Create)

#### DELETE Delete Vendor Sub-User
```http
DELETE {{base_url}}/vendor/users/{user_id}
Authorization: Bearer {{token_vendor}}
Vendor: {{vendor_slug}}
Accept: application/json
```

### Notifications

#### GET List System Notifications
```http
GET {{base_url}}/notifications?page=2
Authorization: Bearer {{token}}
Accept: application/json
```
*Query Parameters:* `?page=2` (Optional)

#### GET Mark Notification Read
```http
GET {{base_url}}/notifications/{notification_id}/read
Authorization: Bearer {{token}}
Accept: application/json
```

#### DELETE Delete Notification
```http
DELETE {{base_url}}/notifications/{notification_id}
Authorization: Bearer {{token}}
Accept: application/json
```

## 3. Store Management & Catalog Module (Vendor Scoped)

### Category Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `{{base_url}}/vendor/categories` | List Store Categories |
| POST | `{{base_url}}/vendor/categories` | Create Category |
| PUT | `{{base_url}}/vendor/categories/{category_id}` | Update Category |
| DELETE | `{{base_url}}/vendor/categories/{category_id}` | Delete Category |

**POST Create Category Body:**
```json
{
  "name": "Electronics",
  "slug": "electronics",
  "description": "الكترونيات وأجهزة ذكية"
}
```

**PUT Update Category Body:**
```json
{
  "name": "الكترونيات محدثة",
  "slug": "electronics",
  "description": "الكترونيات وأجهزة ذكية"
}
```

### Product & Media Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `{{base_url}}/vendor/products` | List Store Products |
| POST | `{{base_url}}/vendor/products` | Create Product |
| PUT | `{{base_url}}/vendor/products/{product_id}` | Update Product |
| DELETE | `{{base_url}}/vendor/products/{product_id}` | Delete Product |
| DELETE | `{{base_url}}/vendor/product-media/{media_id}` | Delete Specific Media Attachment |

**POST Create Product Body:**
```json
{
  "category_id": "01krw8hywet78v1h1eds5g6vw7",
  "name": "iPhone 15 Pro",
  "slug": "iphone-15-pro",
  "description": "Latest Apple smartphone",
  "price": 55000,
  "price_before": 62000,
  "stock": 10
}
```

**PUT Update Product Body:**
```json
{
  "category_id": "01krw8hywet78v1h1eds5g6vw7",
  "name": "iPhone 15 Pro",
  "slug": "iphone-15-pro",
  "description": "Latest Apple smartphone",
  "price": 55000,
  "price_before": 62000,
  "stock": 20
}
```

## 4. Clients & CRM Management Module

> Used inside the dashboard to view and track clients who purchased from the vendor store.

#### GET List Vendor Store Customers
```http
GET {{base_url}}/vendor/clients
Authorization: Bearer {{token_vendor}}
Vendor: {{vendor_slug}}
Accept: application/json
```

#### POST Log/Create Customer Entry Manually
```http
POST {{base_url}}/vendor/clients
Authorization: Bearer {{token_vendor}}
Vendor: {{vendor_slug}}
Accept: application/json
```
**Body (JSON):**
```json
{
    "name": "Ahmed Mohamed",
    "phone": "01012345678",
    "email": "ahmed@gmail.com",
    "city": "Cairo",
    "address": "Nasr City",
    "notes": "VIP customer"
}
```

#### PUT Update Customer Information Profile
```http
PUT {{base_url}}/vendor/clients/{client_id}
Authorization: Bearer {{token_vendor}}
Vendor: {{vendor_slug}}
Accept: application/json
```
**Body (JSON):**
```json
{
    "name": "Ahmed Updated",
    "city": "Giza"
}
```

#### DELETE Remove Customer Entry
```http
DELETE {{base_url}}/vendor/clients/{client_id}
Authorization: Bearer {{token_vendor}}
Vendor: {{vendor_slug}}
Accept: application/json
```

## 5. Vendor Fulfillment Orders Module

> Used on the internal dashboard interface to move or modify invoice records.

#### GET List Vendor Incoming Orders
```http
GET {{base_url}}/vendor/orders
Authorization: Bearer {{token_vendor}}
Vendor: {{vendor_slug}}
Accept: application/json
```

#### PUT Update Order Fulfillment Status & Fees
```http
PUT {{base_url}}/vendor/orders/{order_id}
Authorization: Bearer {{token_vendor}}
Vendor: {{vendor_slug}}
Accept: application/json
```
**Body (JSON):**
```json
{
    "status": "confirmed",
    "extra_fees": 75,
    "notes": "Customer confirmed by phone"
}
```
*Status values:* `pending`, `confirmed`, `shipped`, `cancelled`

#### DELETE Cancel / Terminate Order
```http
DELETE {{base_url}}/vendor/orders/{order_id}
Authorization: Bearer {{token_vendor}}
Vendor: {{vendor_slug}}
Accept: application/json
```

## 6. Front Store Module (Public eCommerce & Checkout Layouts)

> Used on the public-facing store app layouts where customers add items to bags and submit purchases anonymously.

#### GET View Public SaaS Pricing Tiers
```http
GET {{base_url}}/plans
Accept: application/json
```

#### GET View Single Public SaaS Plan Description
```http
GET {{base_url}}/plans/{id}
Accept: application/json
```

#### GET Query / Filter Public Catalog Products
```http
GET {{base_url}}/store/products
Vendor: {{vendor_slug}}
Accept: application/json
```
**Body / Query Parameter Option (JSON):**
```json
{
  "min_price": 1000
  // "category_id": "01HXYZABC123",  // Optional
  // "search": "iphone"              // Optional
}
```

#### GET View Individual Product Page Details
```http
GET {{base_url}}/store/products/{slug_or_id}
Vendor: {{vendor_slug}}
Accept: application/json
```
*Example:* `{{base_url}}/store/products/iphone-15-pro`

#### GET Fetch Public Layout Category Navigation Bar
```http
GET {{base_url}}/store/categories
Vendor: {{vendor_slug}}
Accept: application/json
```
**Body (JSON):**
```json
{
  "search": "el"
}
```

#### POST Submit Shopping Cart Checkout Order
```http
POST {{base_url}}/store/checkout
Vendor: {{vendor_slug}}
Content-Type: application/json
Accept: application/json
```
**Body (JSON):**
```json
{
    "name": "Ahmed Mohamed",
    "phone": "01012345678",
    "email": "ahmed@gmail.com",
    "city": "Cairo",
    "address": "Nasr City",
    "notes": "Call before delivery",
    "extra_fees": 50,
    "products": [
        {
            "product_id": "01krz4n2k9t19jpjfa3sbd3cwh",
            "quantity": 2
        },
        {
            "product_id": "01krz54jbeexvp0knrhx2d9k4b",
            "quantity": 1
        }
    ]
}
```