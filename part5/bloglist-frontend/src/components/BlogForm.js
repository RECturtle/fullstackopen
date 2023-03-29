import { useState } from "react";

const BlogForm = ({
	addNewBlog,
	switchBlogVisibility
}) => {
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [url, setURL] = useState('');

	const createBlog = async (event) => {
		event.preventDefault();
		addNewBlog({title, author, url});
		clearBlogForm();
	}

	const clearBlogForm = () => {
		setAuthor('');
		setTitle('');
		setURL('');
	};

	return (
		<div>
			<h1>Add a New Blog</h1>
			<div className="form-container">
				<form onSubmit={createBlog}>
					<div>
						Title:
						<input
							type="text"
							name="title"
							value={title}
							onChange={({ target }) => setTitle(target.value)}
						/>
					</div>
					<div>
						Author:
						<input
							type="text"
							name="author"
							value={author}
							onChange={({ target }) => setAuthor(target.value)}
						/>
					</div>
					<div>
						URL:
						<input
							type="text"
							name="url"
							value={url}
							onChange={({ target }) => setURL(target.value)}
						/>
					</div>
					<button type="submit">Post Blog</button>
					<button type="button" onClick={switchBlogVisibility}>Cancel</button>
				</form>
			</div>
		</div>
	);
};

export default BlogForm;
