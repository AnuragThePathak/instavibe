import { Dispatch, SetStateAction } from "react"
import { IUser } from "."

export type IContextType = {
	user: IUser,
	isPending: boolean,
	setUser: Dispatch<SetStateAction<IUser>>,
	isAuthenticated: number,
	setIsAuthenticated: Dispatch<SetStateAction<number>>,
	checkAuthUser: () => Promise<number>,
	logout: () => Promise<void>,
}