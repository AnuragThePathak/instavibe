import { createUser, loginUser, logoutUser } from "@/server/requests"
import { INewUser } from "@/types"
import { useMutation } from "@tanstack/react-query"

export const useCreateUserMutation = () => {
	return useMutation({
		mutationFn: (user: INewUser) => createUser(user)
	})
}

export const useLoginUserMutation = () => {
	return useMutation({
		mutationFn: (user: { email: string, password: string }) => loginUser(user)
	})
}

export const useLogoutUserMutation = () => {
	return useMutation({
		mutationFn: () => logoutUser()
	})
}