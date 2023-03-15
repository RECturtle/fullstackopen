const LoginForm = ({
	username,
	password,
	handleUsernameChange,
	handlePasswordChange,
}) => (
	<div>
		<h2>Login</h2>
		<form>
			<div>
				Username:{" "}
				<input
					type="text"
					name="Username"
					value={username}
					onChange={handleUsernameChange}
				/>
			</div>
			<div>
				Password:{" "}
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
