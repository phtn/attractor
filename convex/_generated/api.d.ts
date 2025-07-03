/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as categories_create from "../categories/create.js";
import type * as categories_d from "../categories/d.js";
import type * as categories_get from "../categories/get.js";
import type * as cats_create from "../cats/create.js";
import type * as cats_d from "../cats/d.js";
import type * as cats_get from "../cats/get.js";
import type * as users_create from "../users/create.js";
import type * as users_d from "../users/d.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "categories/create": typeof categories_create;
  "categories/d": typeof categories_d;
  "categories/get": typeof categories_get;
  "cats/create": typeof cats_create;
  "cats/d": typeof cats_d;
  "cats/get": typeof cats_get;
  "users/create": typeof users_create;
  "users/d": typeof users_d;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
