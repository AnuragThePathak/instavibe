"use server";
import { Account, Client, Databases, Storage, Avatars } from "node-appwrite";
import { cookies } from "next/headers";

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_URL!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_SECRET_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatars() {
      return new Avatars(client);
    },
  };
}

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_URL!)
    .setProject(process.env.APPWRITE_PROJECT_ID!);

  // Get session ID from the secure cookie
  const session = (await cookies()).get("my-custom-session");
  if (!session || !session.value) {
    throw new Error("No session found. User is not authenticated.");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}
