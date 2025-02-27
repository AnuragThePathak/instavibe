"use server"
import { INewUser } from "@/types"
import { createAdminClient, createSessionClient } from "./appwrite"
import { ID, Models, Query } from "node-appwrite"
import { cookies } from "next/headers"

export async function createUser(user: INewUser) {
	const { account, databases } = await createAdminClient()
	const newAccount = await account.create(ID.unique(), user.email, user.password, user.name)

	const newUser = await databases.createDocument(
		process.env.APPWRITE_DATABASE_ID!,
		process.env.APPWRITE_USER_COLLECTION_ID!,
		ID.unique(),
		{
			accountId: newAccount.$id,
			name: newAccount.name,
			email: newAccount.email,
			username: user.username,
		}
	)

	return newUser
}

export async function loginUser({ email, password }: { email: string; password: string }) {
	const { account } = await createAdminClient()
	const session = await account.createEmailPasswordSession(email, password);

	// Store session ID in a secure, HTTP-only cookie
	(await cookies()).set("my-custom-session", session.secret, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		sameSite: "strict",
	})

	return session
}

export async function getCurrentUser() {
	const { account } = await createSessionClient()
	const user = await account.get()

	const { databases } = await createAdminClient()

	const userDoc = await databases.listDocuments(
		process.env.APPWRITE_DATABASE_ID!,
		process.env.APPWRITE_USER_COLLECTION_ID!,
		[Query.equal("accountId", user.$id)]
	)

	return {...userDoc.documents[0], emailVerified: user.emailVerification} as Models.Document
}

export async function logoutUser() {
	const { account } = await createSessionClient()

	await account.deleteSession("current");

	// Remove the session cookie
	(await cookies()).set("my-custom-session", "", {
		expires: new Date(0), // Expire immediately
		path: "/",
	})

	return { success: true }
}

export async function getAvatar(email: string) {
	const { avatars } = await createAdminClient()
	return await avatars.getInitials(email)
}

export async function getUserById(userId: string) {
	const { databases } = await createAdminClient()
	const user = await databases.getDocument(
		process.env.APPWRITE_DATABASE_ID!,
		process.env.APPWRITE_USER_COLLECTION_ID!,
		userId
	)
	return user
}

export async function getAllUsers({ pageParam }: { pageParam: number }) {
	const { databases } = await createAdminClient()
	const queries = [Query.limit(20)]
	if (pageParam) {
		queries.push(Query.cursorAfter(pageParam.toString()))
	}
	
	const users = await databases.listDocuments(
		process.env.APPWRITE_DATABASE_ID!,
		process.env.APPWRITE_USER_COLLECTION_ID!,
		queries
	)
	return users
}

export async function verifyEmail(userId: string, secret: string) {
	const { account } = await createSessionClient()
	return await account.updateVerification(userId, secret)
}

export async function sendVerificationEmail() {
	const { account } = await createSessionClient()
	return await account.createVerification(`${process.env.SITE_URL!}/accounts/verify`)
}
