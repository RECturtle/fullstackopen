import { useState } from 'react';

const Blog = ({ blog: { title, author, url, likes, id }, updateBlog }) => {
	const [detailsVisible, setDetailsVisible] = useState(false);

	const toggleDetailVisibility = () => {
		setDetailsVisible(!detailsVisible);
	};

	const addLike = () => {
		likes += 1
		updateBlog(id, {title, author, url, likes});
	}

	return (
		<div className="blog">
			<p>
				<b>Blog Title:</b> {title}
			</p>
			<p>
				<b>Author:</b> {author}
			</p>
			{detailsVisible && (
				<div>
					<p>
						<b>URL:</b> {url}
					</p>
					<p>
						<b>Likes:</b> {likes}
					</p>
					<button type="text" onClick={toggleDetailVisibility}>
						Hide Details
					</button>
					<button type="text" onClick={addLike}>Like &#x1F44D;</button>
				</div>
			)}
			{!detailsVisible && (
				<button type="text" onClick={toggleDetailVisibility}>
					View Details
				</button>
			)}
		</div>
	);
};

export default Blog;
