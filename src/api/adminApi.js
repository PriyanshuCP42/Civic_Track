export const adminApi = {
  async createEmployee(payload) {
    let response;
    try {
      response = await fetch("http://localhost:8787/api/v1/admin/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": "admin@gmail.com",
          "x-admin-password": "Ashmit",
        },
        body: JSON.stringify(payload),
      });
    } catch {
      const err = new Error("Cannot reach API at http://localhost:8787 — is npm run dev:api running?");
      err.code = "NETWORK";
      throw err;
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const err = new Error(
        data?.message ||
          (response.status === 409
            ? "This email is already registered in Clerk. Use another email or delete the user in Clerk Dashboard."
            : "Unable to create employee"),
      );
      err.status = response.status;
      throw err;
    }
    return data;
  },
};

