const BlogForm = ({
	title,
	author,
	url,
	handleTitleChange,
	handleAuthorChange,
	handleUrlChange,
	handleBlogSubmit,
}) => {
	return (
		<div>
			<form onSubmit={handleBlogSubmit}>
				<div>
					Title:
					<input type="text" name="title" value={title} onChange={handleTitleChange} />
				</div>
				<div>
					Author:
					<input type="text" name="author" value={author} onChange={handleAuthorChange} />
				</div>
				<div>
					URL:
					<input type="text" name="url" value={url} onChange={handleUrlChange} />
				</div>
				<button type="submit">Post Blog</button>
			</form>
		</div>
	);
};

export default BlogForm;
