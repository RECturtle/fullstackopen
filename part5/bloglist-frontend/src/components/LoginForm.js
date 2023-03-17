const LoginForm = ({
	username,
	password,
	handleUsernameChange,
	handlePasswordChange,
	handleLogin,
}) => (
	<div>
		<h2>Login</h2>
		<form onSubmit={handleLogin}>
			<div>
				Username:
				<input
					type="text"
					name="Username"
					value={username}
					onChange={handleUsernameChange}
				/>
			</div>
			<div>
				Password:
				<input
					type="password"
					name="Password"
					value={password}
					onChange={handlePasswordChange}
				/>
			</div>
			<button type="submit">Login</button>
		</form>
	</div>
);

export default LoginForm;
