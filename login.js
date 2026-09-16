const loginLink = document.querySelector('.login-link');

loginLink.addEventListener('click', (event) => {
	event.preventDefault();

	const overlay = document.createElement('div');
	overlay.className = 'login-overlay';
	overlay.innerHTML = `
		<form class="login-box">
			<h2>Login</h2>
			<label for="username">Username</label>
			<input id="username" name="username" type="text" required>
			<label for="password">Password</label>
			<div class="password-field">
				<input id="password" name="password" type="password" required>
				<button class="toggle-password" type="button">Lihat</button>
			</div>
			<button class="login-submit" type="submit">Login</button>
			<button class="close-login" type="button">Tutup</button>
		</form>
	`;

	document.body.appendChild(overlay);
	const password = overlay.querySelector('#password');
	const togglePassword = overlay.querySelector('.toggle-password');

	togglePassword.addEventListener('click', () => {
		const isPassword = password.type === 'password';
		password.type = isPassword ? 'text' : 'password';
		togglePassword.textContent = isPassword ? 'Sembunyikan' : 'Lihat';
	});

	overlay.querySelector('.close-login').addEventListener('click', () => {
		overlay.remove();
	});

	overlay.addEventListener('click', (clickEvent) => {
		if (clickEvent.target === overlay) {
			overlay.remove();
		}
	});

	overlay.querySelector('.login-box').addEventListener('submit', (submitEvent) => {
		submitEvent.preventDefault();
	});
});
