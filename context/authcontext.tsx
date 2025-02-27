"use client"

import { getCurrentUser, logoutUser } from "@/server/user-requests"
import { IContextType } from "@/types/context"
import { redirect, usePathname } from "next/navigation"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"

const INITIAL_USER = {
	id: "",
	name: "",
	username: "",
	email: "",
	imageUrl: "",
	bio: ""
}

export enum AUTH_STATUS {
	UNAUTHORIZED,
	AUTHORIZED,
	EMAIL_VERIFIED
}

const INITIAl_STATE = {
	user: INITIAL_USER,
	isPending: false,
	isAuthenticated: AUTH_STATUS.UNAUTHORIZED,
	setUser: () => { },
	setIsAuthenticated: () => { },
	checkAuthUser: async () => AUTH_STATUS.UNAUTHORIZED,
	logout: async () => { }
}

const UserContext = createContext<IContextType>(INITIAl_STATE)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState(INITIAL_USER)
	const [isAuthenticated, setIsAuthenticated] = useState<AUTH_STATUS>(AUTH_STATUS.UNAUTHORIZED)
	const [isPending, setIsPending] = useState(false)
	const pathname = usePathname() // Get current page route

	const checkAuthUser = async () => {
		setIsPending(true)
		let status = AUTH_STATUS.UNAUTHORIZED
		try {
			const currentUser = await getCurrentUser()
			if (currentUser) {
				setUser({
					id: currentUser.$id,
					name: currentUser.name,
					username: currentUser.username,
					email: currentUser.email,
					imageUrl: currentUser.imageUrl,
					bio: currentUser.bio
				})

				setIsAuthenticated(AUTH_STATUS.AUTHORIZED)
				status = AUTH_STATUS.AUTHORIZED

				if (currentUser.emailVerified) {
					setIsAuthenticated(AUTH_STATUS.EMAIL_VERIFIED)
					status = AUTH_STATUS.EMAIL_VERIFIED
				}
			}
		} catch (e) {
			console.error("Auth error:", e)
		} finally {
			setIsPending(false)
		}
		return status
	}

	const logout = async () => {
		await logoutUser()
		setUser(INITIAL_USER)
		setIsAuthenticated(AUTH_STATUS.UNAUTHORIZED)
		redirect("/accounts/login")
	}

	useEffect(() => {
		const checkAuth = async () => {
			if (pathname !== "/accounts/signup" && pathname !== "accounts/verify") {
				const authStatus = await checkAuthUser()
				if (authStatus === AUTH_STATUS.UNAUTHORIZED) {
					redirect("/accounts/login")
				}
				if (authStatus === AUTH_STATUS.AUTHORIZED) {
					redirect("/accounts/verification")
				}
			}
		}
		checkAuth()
	}, [pathname])

	const value = {
		user,
		setUser,
		isPending,
		isAuthenticated,
		setIsAuthenticated,
		checkAuthUser,
		logout
	}

	return (
		<UserContext.Provider value={value}>
			{children}
		</UserContext.Provider>
	)
}

export const useUserContext = () => useContext(UserContext)
