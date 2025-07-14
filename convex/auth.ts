import { convexAuth } from "@convex-dev/auth/server";
import GitHub from "@auth/core/providers/github";
import { type MutationCtx } from "@@/server";
import { findUserByEmail } from "./users/create";
import { generateId } from "ai";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [GitHub],
  callbacks: {
    // `args.type` is one of "oauth" | "email" | "phone" | "credentials" | "verification"
    // `args.provider` is the currently used provider config
    async createOrUpdateUser(ctx: MutationCtx, args) {
      if (args.existingUserId) {
        // Optionally merge updated fields into the existing user object here
        await ctx.db.patch(args.existingUserId, { updated_at: Date.now() });
        return args.existingUserId;
      }

      // Implement your own account linking logic:
      const existingUser = await findUserByEmail(ctx.db, args.profile.email);
      if (existingUser) return existingUser._id;
      const identity = await ctx.auth.getUserIdentity();

      // Implement your own user creation:
      return ctx.db.insert("users", {
        uid: generateId() as string,
        accountId: identity?.tokenIdentifier as string,
        username: identity?.preferredUsername as string,
        email: identity?.email as string,
        phone: identity?.phone as string,
        photoUrl: identity?.pictureUrl as string,
        emailVerified: identity?.emailVerified ?? false,
        created_at: Date.now(),
        updated_at: Date.now(),
        balance: {
          currencyCode: "PHP",
          fractionalDigits: 2,
          amount: 0.0,
        },
        fullname: identity?.name as string,
        location: identity?.language,
      });
    },
  },
});
