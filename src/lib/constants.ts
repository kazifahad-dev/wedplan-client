export const CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const POPULAR_LOCATIONS = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Cox's Bazar",
];

export const FREE_SERVICE_LIMIT = 3;

export const PREMIUM_PRICE = 19.99; 