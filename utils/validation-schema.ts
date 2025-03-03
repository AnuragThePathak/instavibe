import { z } from "zod"

export const signUpSchema = z.object({
	name: z.string().min(2),
	username: z.string().min(4),
	email: z.string().email(),
	password: z.string().min(8)
})

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
})

export const postSchema = z.object({
	caption: z.string().min(2).max(2200),
	file: z.custom<File[]>(),
	location: z.string().min(2).max(100),
	tags: z.string().min(2)
})

export const ProfileValidation = z.object({
	file: z.custom<File[]>(),
	name: z.string().min(2, { message: "Name must be at least 2 characters." }),
	username: z.string().min(2, { message: "Name must be at least 2 characters." }),
	email: z.string().email(),
	bio: z.string(),
})