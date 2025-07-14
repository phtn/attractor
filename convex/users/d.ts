import { type Infer, v } from "convex/values";

const ContactSchema = v.object({
  name: v.string(),
  phone: v.string(),
  email: v.string(),
});
const BalanceSchema = v.object({
  currencyCode: v.string(),
  fractionalDigits: v.number(),
  amount: v.float64(),
});

export const MetadataSchema =
  v.optional(v.array(v.record(v.string(), v.any()))) || null;
export type Metadata = Infer<typeof MetadataSchema>;

export const UserMetadataSchema = v.optional(
  v.object({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    emailVerified: v.optional(v.boolean()),
    fullName: v.optional(v.string()),
    phoneVerified: v.optional(v.boolean()),
    phone: v.optional(v.string()),
    iss: v.optional(v.string()),
    sub: v.optional(v.string()),
    providerId: v.optional(v.string()),
    picture: v.optional(v.string()),
  }),
);
export type UserMetadata = Infer<typeof UserMetadataSchema>;

export const CreateUserSchema = v.object({
  uid: v.string(),
  accountId: v.string(),
  email: v.string(),
  phone: v.string(),
  photoUrl: v.string(),
  fullname: v.string(),
  emailVerified: v.boolean(), // Add emailVerified
  // userMetadata: v.optional(UserMetadataSchema),
  metadata: v.optional(MetadataSchema),
});

export const UserSchema = v.object({
  balance: BalanceSchema,
  contact: v.optional(ContactSchema),
  uid: v.string(),
  accountId: v.optional(v.string()),
  email: v.optional(v.string()),
  username: v.optional(v.string()),
  fullname: v.optional(v.string()),
  photoUrl: v.optional(v.string()),
  phone: v.optional(v.string()),
  emailVerified: v.boolean(),
  // userMetadata: UserMetadataSchema,
  metadata: v.optional(MetadataSchema),
  location: v.optional(v.string()),
  updated_at: v.float64(),
  created_at: v.float64(),
});
