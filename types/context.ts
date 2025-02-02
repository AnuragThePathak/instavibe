import { Dispatch, SetStateAction } from "react"
import { IUser } from "."

export type IContextType = {
	user: IUser,
	isPending: boolean,
	setUser: Dispatch<SetStateAction<IUser>>,
	isAuthenticated: boolean,
	setIsAuthenticated: Dispatch<SetStateAction<boolean>>,
	checkAuthUser: () => Promise<boolean>,
	logout: () => Promise<void>,
}