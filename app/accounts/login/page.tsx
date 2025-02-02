"use client"

import Loader from "@/components/loaders/spinner"
import { Button } from "@/components/ui/button"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signUpSchema } from "@/utils/validation-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"

export default function Page() {
	const isLoading = false

	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			username: "",
			email: "",
			password: ""
		},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof signUpSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values)
	}

	return (
		<div className="sm:w-420 flex-center flex-col">
			<h1>Login Page</h1>
			<Image src="/images/logo.svg"
				alt="logo"
				height="220"
				width="220"
				className="object-cover" />
			<h1 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h1>
			<p className="text-light-3 small-medium md:base-regular mt-2">
				To use InstaVibe enter your details</p>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-5 w-full mt-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input type="text" {...field} className="shad-input" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input type="text" {...field} className="shad-input" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" {...field} className="shad-input" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" {...field} className="shad-input" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="shad-button_primary">
						{
							isLoading ?
								<div className="flex-center gap-2">
									<Loader /> Loading...
								</div>
								: "Sign Up"
						}
					</Button>

					<p className="text-small-regular text-light-2 text-center mt-2">
				Already have an account?
				<Link href="/accounts/login"
					className="text-primary-500 text-small-semibold ml-1">
					Log in
				</Link>
			</p>
				</form>
			</Form>

			
		</div>
	)
}