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

const INITIAl_STATE = {
	user: INITIAL_USER,
	isPending: false,
	isAuthenticated: false,
	setUser: () => { },
	setIsAuthenticated: () => { },
	checkAuthUser: async () => false,
	logout: async () => { }
}

const UserContext = createContext<IContextType>(INITIAl_STATE)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState(INITIAL_USER)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isPending, setIsPending] = useState(false)
	const pathname = usePathname() // Get current page route

	const checkAuthUser = async () => {
		setIsPending(true)
		let success = false
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
				setIsAuthenticated(true)
				success = true
			}
		} catch (e) {
			console.error("Auth error:", e)
		} finally {
			setIsPending(false)
		}
		return success
	}

	const logout = async () => {
		await logoutUser()
		setUser(INITIAL_USER)
		setIsAuthenticated(false)
		redirect("/accounts/login")
	}

	useEffect(() => {
		const checkAuth = async () => {
			if (pathname !== "/accounts/signup") {
				if (!(await checkAuthUser())) {
					redirect("/accounts/login")
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
