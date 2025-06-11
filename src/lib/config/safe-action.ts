import { getSession } from "@/lib/server/auth-utils";
import { createSafeActionClient } from "next-safe-action";

export class ActionError extends Error {}

function handleServerError(error: Error) {
  console.error(error.message);
  return {
    serverError: error instanceof ActionError ? error.message : "An error occurred"
  };
}

export const unprotectedAction = createSafeActionClient({ handleServerError });

export const protectedAction = createSafeActionClient({
  handleServerError
}).use(async ({ next }) => {
  const session = await getSession();

  if (!session) {
    throw new ActionError("Unauthorized");
  }

  return next({
    ctx: {
      session
    }
  });
});
