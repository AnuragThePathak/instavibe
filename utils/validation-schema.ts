import { z } from "zod"

export const signUpSchema = z.object({
	name: z.string().min(2),
	username: z.string().min(4),
	email: z.string().email(),
	password: z.string().min(8)
})
