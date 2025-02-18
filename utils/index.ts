export function checkIsLiked(likes: string[], userId: string) {
	return likes.includes(userId)
}