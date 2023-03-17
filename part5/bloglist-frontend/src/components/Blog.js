const Blog = ({ blog: { title, author } }) => (
	<div>
		<p><b>Blog Title:</b> {title}</p>
		<p><b>Author:</b> {author}</p>
		<br />
	</div>
);

export default Blog;
