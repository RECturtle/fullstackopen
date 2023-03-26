import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [url, setURL] = useState('');

	const [user, setUser] = useState(null);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [notificationMessage, setNotificationMessage] = useState(null);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		blogService.getAll().then((blogs) => setBlogs(blogs));
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

	const handleLogout = () => {
		setIsError(false);
		setNotificationMessage('Logged Out');
		notificationTimeout();
		window.localStorage.clear();
		setUser(null);
	};

	const handleBlogSubmit = async (event) => {
		event.preventDefault();

		try {
			const blog = {
				title,
				author,
				url,
			};

			const newBlog = await blogService.create(blog);
			console.log(newBlog);
			setBlogs(blogs.concat(newBlog));
			setIsError(false);
			setNotificationMessage(`New Blog Posted: ${newBlog.title}`);
			notificationTimeout();
			clearBlogForm();
		} catch (exception) {
			setIsError(true);
			setNotificationMessage('Unable to Post the blog');
			notificationTimeout();
		}
	};

	const clearBlogForm = () => {
		setAuthor('');
		setTitle('');
		setURL('');
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
								<Blog key={blog.id} blog={blog} />
							))}
						</div>
					</div>
					<div>
						<h1>Add a New Blog</h1>
						<BlogForm
							title={title}
							author={author}
							url={url}
							handleTitleChange={({ target }) =>
								setTitle(target.value)
							}
							handleAuthorChange={({ target }) =>
								setAuthor(target.value)
							}
							handleUrlChange={({ target }) =>
								setURL(target.value)
							}
							handleBlogSubmit={handleBlogSubmit}
						/>
					</div>
					<div className='container'>
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
