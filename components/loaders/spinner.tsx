import Image from "next/image"

export default function Loader() {
	return (
		<div className="flex-center w-full">
			<Image
				src="/icons/loader.svg"
				alt="loader"
				width="24"
				height="24"
			/>
		</div>
	)
}