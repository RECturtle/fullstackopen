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

const favoriteBlog = (blogs) => {
	const maxLikes = Math.max.apply(
		Math,
		blogs.map((blog) => {
			return blog.likes
		})
	)
	return blogs.find((blog) => {
		return blog.likes === maxLikes
	})
}

const mostBlogs = (blogs) => {
	const authorsCount = {}
	let maxAuthor = { author: "", blogs: 0 }
	blogs.forEach((blog) => {
		authorsCount[blog.author]
			? (authorsCount[blog.author] += 1)
			: (authorsCount[blog.author] = 1)

		if (maxAuthor.blogs < authorsCount[blog.author]) {
			maxAuthor = {
				author: blog.author,
				blogs: authorsCount[blog.author],
			}
		}
	})

	return maxAuthor
}

const mostLikes = (blogs) => {
	const authorLikeCount = {}
	let maxAuthor = { author: "", likes: 0 }

	blogs.forEach((blog) => {
		authorLikeCount[blog.author]
			? (authorLikeCount[blog.author] += blog.likes)
			: (authorLikeCount[blog.author] = blog.likes)

		if (maxAuthor.likes < authorLikeCount[blog.author]) {
			maxAuthor = {
				author: blog.author,
				likes: authorLikeCount[blog.author],
			}
		}
	})
	return maxAuthor
}

module.exports = { dummy, totalLikes, favoriteBlog }
