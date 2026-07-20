import rateLimit from "express-rate-limit";

/** General API rate limit — generous, protects against abusive polling. */
export const apiRateLimit = rateLimit({
  windowMs: 60_000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

/** Stricter limit for form submission endpoints, to slow down spam bots. */
export const formRateLimit = rateLimit({
  windowMs: 15 * 60_000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many submissions. Please try again later." },
});
