const dummy = (blogs) => {
	console.log(blogs)
	return 1
}

const totalLikes = (blogs) => {
	const likeReducer = (totalLikes, currLikes) => {
		return totalLikes + currLikes.likes
	}

	return blogs.reduce(likeReducer, 0)
}

module.exports = { dummy, totalLikes }
