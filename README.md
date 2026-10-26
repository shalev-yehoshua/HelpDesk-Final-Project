# Help Desk - Full Stack TypeScript

## Project Description

This project is a full stack Help Desk system for opening and managing support tickets. A customer can submit a ticket without creating an account. An administrator can log in to a protected area, view dashboard statistics, search and filter tickets, view full ticket details, update status and priority, delete tickets, and export the ticket list to CSV.

## Starting Point

The project is based on the final user-management project from the TypeScript course. The existing Vite, React, TypeScript, TailwindCSS, Radix UI, Express, MongoDB Native Driver, typed API response, loading, error, service, validation, and database-layer patterns are reused and adapted to the Help Desk data model.

## Technologies

- Vite
- React
- TypeScript with `strict: true`
- React Router
- TailwindCSS
- Radix UI
- Node.js
- Express
- MongoDB Native Driver
- CORS

## Pages

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Submit a new support ticket |
| `/confirmation/:id` | Public | Confirm that a ticket was created successfully |
| `/admin/login` | Public | Administrator login |
| `/admin/dashboard` | Admin | Display ticket statistics |
| `/admin/tickets` | Admin | Search, filter, view, update, delete, and export tickets |

## Main Components

- `Navigation` - public and admin navigation with logout support.
- `TicketForm` - controlled form with client-side validation.
- `TicketList` and `TicketCard` - display the current ticket collection.
- `TicketDetailsDialog` - loads and displays one ticket by its ID.
- `UpdateTicketDialog` - updates only ticket status and priority.
- `DeleteTicketDialog` - confirms deletion using Radix AlertDialog.
- `TicketFilters` - combines text search with status, priority, and category filters.
- `DashboardCards` - displays ticket statistics calculated from the loaded tickets.
- `ProtectedRoute` - redirects unauthenticated users to the login page.
- `Loading` and `ErrorMessage` - reusable request-state components.

## Project Structure

```text
HelpDesk_Final_Project/
  client/
    src/
      components/
      pages/
      services/
      types/
      App.tsx
      main.tsx
  server/
    server/
    db/
    type/
    auth/
```

React pages and components manage the UI and typed state. Client services contain all `fetch` requests. Express routes validate external input and select the correct response status. Database actions contain all MongoDB operations. MongoDB code is not placed directly inside React components or Express routes.

## Data Model

### Ticket

A ticket stores the customer name, email, phone, title, description, category, priority, status, creation date, and last update date. Category is limited to `Hardware`, `Software`, `Network`, `Account`, or `Other`. Priority is limited to `Low`, `Medium`, or `High`. Status is limited to `Open`, `In Progress`, or `Resolved`.

The server sets new tickets to `Open` and creates both date fields. The administrator may update only status and priority, and the server updates `updatedAt` automatically.

### Admin

An admin stores a unique username, password hash, and password salt. A plain-text password is never stored in MongoDB or returned to the client.

### Collections

- `tickets` - typed ticket documents.
- `admins` - typed administrator documents.

## API

All responses use the shared `ApiResponse<T>` success/error structure.

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/tickets` | Public | Validate and create a ticket |
| `POST` | `/admin/login` | Public | Authenticate an administrator |
| `POST` | `/admin/logout` | Admin | Invalidate the current login token |
| `GET` | `/tickets` | Admin | Return all tickets |
| `GET` | `/tickets/export/csv` | Admin | Download all tickets as CSV |
| `GET` | `/tickets/:id` | Admin | Return one ticket by ID |
| `PATCH` | `/tickets/:id` | Admin | Update status and/or priority |
| `DELETE` | `/tickets/:id` | Admin | Delete one ticket |

## Authentication

The admin password is hashed before it is stored. A successful login creates a server-side authentication token. The client sends the token in the `Authorization` header for protected requests. Express authentication middleware rejects missing or invalid tokens. Logging out removes the token on both the client and server.

## Environment Variables

Client:

- `VITE_API_URL`

Server:

- `MONGODB_URI`
- `PORT`
- `CLIENT_ORIGIN`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

Real values belong only in local `.env` files. The repository contains `.env.example` files without secrets.

## Installation

Install the client and server dependencies separately:

```bash
cd client
npm install
```

```bash
cd server
npm install
```

Copy each `.env.example` file to `.env`:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

For a local MongoDB installation, the server configuration can use:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
PORT=3000
CLIENT_ORIGIN=http://127.0.0.1:3005
ADMIN_USERNAME=admin
ADMIN_PASSWORD=choose_a_private_password
```

The server selects the `help_desk` database and automatically creates the first
administrator with a hashed password when it starts for the first time.

## Run

Run the server:

```bash
cd server
npm run dev
```

Run the client in another terminal:

```bash
cd client
npm run dev
```
