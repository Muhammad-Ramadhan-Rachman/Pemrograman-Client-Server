const loginLink = document.querySelector('.login-link');

loginLink?.addEventListener('click', (event) => {
	event.preventDefault();

	const overlay = document.createElement('div');
	overlay.className = 'login-overlay';
	overlay.innerHTML = `
		<form class="login-box">
			<h2>Login</h2>
			<p class="database-status" role="status">Memeriksa koneksi database...</p>
			<label for="username">Username</label>
			<input id="username" name="username" type="text" required>
			<label for="password">Password</label>
			<div class="password-field">
				<input id="password" name="password" type="password" required>
				<button class="toggle-password" type="button">Lihat</button>
			</div>
			<p class="login-message" role="status" aria-live="polite"></p>
			<button class="login-submit" type="submit">Login</button>
			<button class="close-login" type="button">Tutup</button>
		</form>
	`;

	document.body.appendChild(overlay);
	const databaseStatus = overlay.querySelector('.database-status');
	const password = overlay.querySelector('#password');
	const togglePassword = overlay.querySelector('.toggle-password');
	fetch('Koneksi/check_koneksi.php')
		.then((response) => response.text())
		.then((message) => {
			databaseStatus.textContent = message;
		})
		.catch(() => {
			databaseStatus.textContent = 'Database tidak terhubung';
		});

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

	overlay.querySelector('.login-box').addEventListener('submit', async (submitEvent) => {
		submitEvent.preventDefault();
		const form = submitEvent.currentTarget;
		const submitButton = form.querySelector('.login-submit');
		const message = form.querySelector('.login-message');
		submitButton.disabled = true;
		message.textContent = 'Memeriksa akun...';

		try {
			const response = await fetch('Koneksi/login.php', {
				method: 'POST',
				body: new FormData(form)
			});
			const result = await response.json();

			if (result.success) {
				window.location.href = loginLink.href;
				return;
			}

			message.textContent = result.message || 'Login gagal. Periksa kembali nama dan password.';
		} catch {
			message.textContent = 'Tidak dapat menghubungi server. Buka program melalui XAMPP.';
		} finally {
			submitButton.disabled = false;
		}
	});
});
