import { useState } from 'react';

const Blog = ({
	blog: { title, author, url, likes, id, user: {username} },
	updateBlog,
	removeBlog,
	currentUsername,
}) => {
	const [detailsVisible, setDetailsVisible] = useState(false);

	const toggleDetailVisibility = () => {
		setDetailsVisible(!detailsVisible);
	};

	const addLike = () => {
		likes += 1;
		updateBlog(id, { title, author, url, likes });
	};

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
						<b>Posted By:</b> {username}
					</p>
					<p>
						<b>Likes:</b> {likes}
					</p>
					<div className="blog-buttons">
						<button
							className="blog-button general-button"
							type="text"
							onClick={toggleDetailVisibility}
						>
							Hide Details
						</button>
						<button
							className="blog-button general-button"
							type="text"
							onClick={addLike}
						>
							Like
						</button>
						{currentUsername === username && 
							<button
								className="blog-button delete-button"
								type="text"
								onClick={() => removeBlog(id, title)}
							>
								Delete
							</button>
						}
					</div>
				</div>
			)}
			{!detailsVisible && (
				<button className="blog-button general-button" type="text" onClick={toggleDetailVisibility}>
					View Details
				</button>
			)}
		</div>
	);
};

export default Blog;
