/**
 * Express global error middleware.
 * @param {Error & { status?: number }} err
 * @param {import("express").Request} _req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} _next
 * @returns {void}
 */
export function errorHandler(err, _req, res, _next) {
  void _next;
  const statusCode =
    typeof err?.status === "number" && err.status >= 400 && err.status < 600
      ? err.status
      : 500;

  res.status(statusCode).json({ message: err?.message || "Server error" });
}
