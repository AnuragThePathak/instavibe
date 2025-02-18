"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import FileUploader from "./fileuploader"
import { postSchema } from "@/utils/validation-schema"
import { Models } from "node-appwrite"
import { useToast } from "@/hooks/use-toast"
import { useUserContext } from "@/context/authcontext"
import { useCreatePostMutation } from "@/react-query/mutations-queries"
import { redirect } from "next/navigation"
import Loader from "../loaders/spinner"

type PostFormProps = {
	post: Models.Document
}


export default function PostForm({ post }: PostFormProps) {
	const { toast } = useToast()
	const { user } = useUserContext()
	const { mutateAsync: createPost, isPending: isCreating } = useCreatePostMutation()

	const form = useForm<z.infer<typeof postSchema>>({
		resolver: zodResolver(postSchema),
		defaultValues: {
			caption: post?.caption || "",
			file: [],
			location: post?.location || "",
			tags: post?.tags.join(',') || "",
		},
	})

	async function onSubmit(values: z.infer<typeof postSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		const newPost = await createPost({
			...values,
			userId: user.id,
		})

		if (!newPost) {
			toast({
				title: "Failed to create the post, try again.",
			})
		} else {
			redirect("/")
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-9 w-full max-w-5xl">
				<FormField
					control={form.control}
					name="caption"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Caption</FormLabel>
							<FormControl>
								<Textarea
									className="shad-textarea custom-scrollbar"
									{...field} />
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="file"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Add Photos</FormLabel>
							<FormControl>
								<FileUploader
									fieldChange={field.onChange}
									mediaUrl={post?.imageUrl}
								/>
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="location"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Add Location</FormLabel>
							<FormControl>
								<Input type="text" className="shad-input" {...field} />
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="tags"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Add Tags (separated by comma &#34; , &#34;)</FormLabel>
							<FormControl>
								<Input type="text" className="shad-input"
									placeholder="Art, Expression, Learn" {...field} />
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>
				<div className="flex gap-4 items-center justify-end">
					<Button type="button"
						className="shad-button_dark_4"
						onClick={() => redirect("/")}>
						Cancel
					</Button>
					<Button type="submit"
						className="shad-button_primary whitespace-nowrap"
						disabled={isCreating}>
						{isCreating && <Loader />}
						Submit
					</Button>
				</div>
			</form>
		</Form>
	)
}