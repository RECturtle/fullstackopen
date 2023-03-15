import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import blogService from "./services/blogs";

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null);

	useEffect(() => {
		blogService.getAll().then((blogs) => setBlogs(blogs));
	}, []);

	return (
		<div>
			{!user && (
				<LoginForm
					username={username}
					password={password}
					handleUsernameChange={({ target }) =>
						setUsername(target.value)
					}
					handlePasswordChange={({ target }) =>
						setPassword(target.value)
					}
				/>
			)}
			{!user && (
				<div>
					<h2>blogs</h2>
					{blogs.map((blog) => (
						<Blog key={blog.id} blog={blog} />
					))}
				</div>
			)}
		</div>
	);
};

export default App;
