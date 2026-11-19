import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, APIError } from "better-auth/api";
import client from "./mongodb";


const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;


const PROTECTED_FIELDS = [
  "role",
  "isBlocked",
  "subscriptionPlan",
  "subscriptionExpiresAt",
];

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer" },
      businessName: { type: "string", required: false },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
    },
  },

  
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      const body = (ctx.body ?? {}) as Record<string, unknown>;

      
      if (ctx.path === "/sign-up/email") {
        if (body.role !== "vendor" && body.role !== "customer") {
          throw new APIError("BAD_REQUEST", {
            message: "Role must be vendor or customer",
          });
        }
        if (!PASSWORD_RULE.test(String(body.password ?? ""))) {
          throw new APIError("BAD_REQUEST", {
            message:
              "Password must be at least 6 characters with one uppercase and one lowercase letter",
          });
        }
      }

      if (ctx.path === "/update-user") {
        for (const field of PROTECTED_FIELDS) {
          if (field in body) {
            throw new APIError("BAD_REQUEST", {
              message: `${field} cannot be changed`,
            });
          }
        }
      }
    }),
  },

  
  plugins: [jwt(), nextCookies()],
});