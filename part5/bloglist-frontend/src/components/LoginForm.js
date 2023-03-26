const LoginForm = ({
	username,
	password,
	handleUsernameChange,
	handlePasswordChange,
	handleLogin,
}) => (
	<div>
		<h2>Login</h2>
		<div className="form-container">
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
	</div>
);

export default LoginForm;
