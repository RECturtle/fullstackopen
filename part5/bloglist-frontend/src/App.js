import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [formIsVisible, setFormVisible] = useState(false);

	const [user, setUser] = useState(null);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [notificationMessage, setNotificationMessage] = useState(null);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		const getBlogs = async () => {
			let allBlogs = await blogService.getAll();
			setBlogs(sortBlogs(allBlogs));
		};
		getBlogs();
	}, []);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
			blogService.setToken(user.token);
		}
	}, []);

	const notificationTimeout = () => {
		setTimeout(() => {
			setNotificationMessage(null);
		}, 5000);
	};

	const handleLogin = async (event) => {
		event.preventDefault();

		try {
			const user = await loginService.login({
				username,
				password,
			});

			window.localStorage.setItem(
				'loggedBlogappUser',
				JSON.stringify(user)
			);

			blogService.setToken(user.token);
			setUser(user);
			setIsError(false);
			setNotificationMessage('Logged in Successfully');
			notificationTimeout();
			setUsername('');
			setPassword('');
		} catch (exception) {
			setIsError(true);
			setNotificationMessage('Incorrect Username and/or Password');
			notificationTimeout();
		}
	};

	const sortBlogs = (blogs) => {
		return blogs.sort((a, b) => {
			return b.likes - a.likes;
		});
	};

	const addNewBlog = async (blog) => {
		try {
			const newBlog = await blogService.create(blog);
			setBlogs(sortBlogs(blogs.concat(newBlog)));
			switchBlogVisibility();
			setIsError(false);
			setNotificationMessage(`New Blog Posted: ${newBlog.title}`);
			notificationTimeout();
		} catch (exception) {
			setIsError(true);
			setNotificationMessage(
				'Unable to post - please check that it has all fields'
			);
			notificationTimeout();
		}
	};

	const updateBlog = async (id, newBlog) => {
		try {
			const updatedBlog = await blogService.update(id, newBlog);
			const newBlogs = blogs.map((blog) => {
				if (blog.id === updatedBlog.id) {
					return updatedBlog;
				}
				return blog;
			});
			setBlogs(sortBlogs(newBlogs));
		} catch (exception) {
			setIsError(true);
			setNotificationMessage('Unable to add like');
			notificationTimeout();
		}
	};

	const removeBlog = async (id, blogTitle) => {
		try {
			const confirmed = window.confirm(`Remove: ${blogTitle}?`);
			if (!confirmed) {
				return;
			}
			await blogService.remove(id);
			const filteredBlogs = blogs.filter((blog) => blog.id !== id);
			setBlogs(sortBlogs(filteredBlogs));
		} catch (exception) {
			setIsError(true);
			setNotificationMessage(
				"Unable to delete blog"
			);
			notificationTimeout();
		}
	};

	const handleLogout = () => {
		setIsError(false);
		setNotificationMessage('Logged Out');
		notificationTimeout();
		window.localStorage.clear();
		setUser(null);
	};

	const switchBlogVisibility = () => {
		setFormVisible(!formIsVisible);
	};

	return (
		<div>
			{!user && (
				<div>
					<Notification
						message={notificationMessage}
						isError={isError}
					/>
					<LoginForm
						username={username}
						password={password}
						handleUsernameChange={({ target }) =>
							setUsername(target.value)
						}
						handlePasswordChange={({ target }) =>
							setPassword(target.value)
						}
						handleLogin={handleLogin}
					/>
				</div>
			)}
			{user && (
				<div>
					<Notification
						message={notificationMessage}
						isError={isError}
					/>
					<div>
						<h1>Current Blogs</h1>
						<div className="blogBlock">
							{blogs.map((blog) => (
								<Blog
									key={blog.id}
									blog={blog}
									updateBlog={updateBlog}
									removeBlog={removeBlog}
									currentUsername={user.username}
								/>
							))}
						</div>
					</div>
					{!formIsVisible && (
						<div className="container">
							<button onClick={switchBlogVisibility} type="text">
								Add a New Blog
							</button>
						</div>
					)}
					{formIsVisible && (
						<div>
							<BlogForm
								addNewBlog={addNewBlog}
								switchBlogVisibility={switchBlogVisibility}
							/>
						</div>
					)}
					<div className="container">
						<p>Current User: {user.name}</p>
						<button onClick={handleLogout} type="text">
							Logout
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default App;
