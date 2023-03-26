const Blog = ({ blog: { title, author } }) => (
	<div className="blog">
		<p><b>Blog Title:</b> {title}</p>
		<p><b>Author:</b> {author}</p>
	</div>
);

export default Blog;
