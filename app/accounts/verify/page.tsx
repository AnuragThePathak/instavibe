"use client"

import { AUTH_STATUS, useUserContext } from "@/context/authcontext"
import toast from "react-hot-toast"
import { useVerifyEmailMutation } from "@/react-query/mutations-queries"
import { redirect, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function Page() {
	const searchParams = useSearchParams()
	const { checkAuthUser } = useUserContext()
	const { mutate: verifyEmail, isPending, isError } = useVerifyEmailMutation()
	
	useEffect(() => {
		const userId = searchParams.get('userId')
		const secret = searchParams.get('secret')
		if (userId && secret) {
			verifyEmail({ userId, secret })
		}

		setTimeout(async () => {
			const isUserLoggedIn = await checkAuthUser()
			if (isUserLoggedIn === AUTH_STATUS.EMAIL_VERIFIED) {
				redirect("/")
			} else {
				toast.error(
					"Email not yet verified. Please try again later.",
				)
			}
		}, 10000)
	}, [searchParams, verifyEmail, checkAuthUser])

	return (
		<div>
			{isPending ? "Verifying..." : isError ? "Verification failed" : "Verified. You'll be redirected to home page..."}
		</div>
	)
}