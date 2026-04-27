import { createClerkClient } from "@clerk/backend";

let _clerkClient;
let _initialized = false;

function init() {
  if (!_initialized) {
    _initialized = true;
    const key = process.env.CLERK_SECRET_KEY;
    _clerkClient = key ? createClerkClient({ secretKey: key }) : null;
  }
}

export function getClerkClient() {
  init();
  return _clerkClient;
}

export function getClerkSecretKey() {
  return process.env.CLERK_SECRET_KEY;
}
