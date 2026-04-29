# Database Layer

This folder contains MongoDB-specific code.

- `connect.js` opens the MongoDB connection.
- `models/Complaint.js` defines the complaint document schema and indexes.

The backend imports from this layer through repositories and startup code, so route handlers and services do not need to know Mongoose details directly.
