import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { FileWithPath, useDropzone } from "react-dropzone"
import { Button } from "../ui/button"
import { useGetImageQuery } from "@/react-query/queries"
import Loader from "../loaders/spinner"

type FileUploaderProps = {
	fieldChange: (files: FileWithPath[]) => void
	imageId: string
}
export default function FileUploader({ fieldChange, imageId }: FileUploaderProps) {
	const [fileUrl, setFileUrl] = useState("")
	const { data: imageBuffer, isPending: isLoadingImage } = useGetImageQuery(imageId)

	useEffect(() => {
		if (imageBuffer) {
			const blob = new Blob([imageBuffer], { type: "image/png" }) // Adjust MIME type if needed
			const blobUrl = URL.createObjectURL(blob)
			setFileUrl(blobUrl)

			return () => URL.revokeObjectURL(blobUrl) // Cleanup
		}
	}, [imageBuffer])

	const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
		fieldChange(acceptedFiles)
		setFileUrl(URL.createObjectURL(acceptedFiles[0]))
	}, [fieldChange])

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".png", ".jpeg", ".jpg"]
		}
	})

	return (
		<div {...getRootProps()}
			className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
		>
			<input {...getInputProps()}
				className="cursor-pointer" />
			{
				imageId && isLoadingImage ? <div className="h-80 w-full flex items-center justify-center">
								<Loader />
							</div>
					: fileUrl ?
						<>
							<div
								className="flex flex-1 justify-center w-full p-5 lg:p-10"
							>
								<Image
									src={fileUrl}
									height="400"
									width="300"
									objectFit="contain"
									alt="file-upload"
								/>
							</div>
							<p className="file_uploader-label">Click or drag photo to replace</p>
						</>
						: <div
							className="file_uploader-box">
							<Image
								src="icons/file-upload.svg"
								width="96"
								height="77"
								alt="file-upload"
							/>
							<h1 className="base-medium text-light-2 mb-2 mt-6">
								Drag Photos Here
							</h1>
							<p className="text-light-4 small-regular mb-6">
								PNG, JPG, JPEG
							</p>

							<Button className="shad-button_dark_4 ">
								Choose File
							</Button>
						</div>
			}
		</div>
	)
}