export async function loadMainNav() {
	const response = await fetch('./assets/js/data/navbar.json');
	const data = await response.json();

	const navList = document.querySelector('.nav-list');

	const currentPath = window.location.pathname;

	function normalizePath(path) {
		return path.replace(/\/index\.html$/, '/').replace(/\/$/, '');
	}

	const normalizedCurrentPath = normalizePath(currentPath);

	navList.innerHTML = data.items
		.map((item) => {
			let isActive = false;

			if (item.link !== '#') {
				const itemUrl = new URL(item.link, window.location.href);
				const normalizedItemPath = normalizePath(itemUrl.pathname);
				isActive = normalizedCurrentPath === normalizedItemPath;
			}

			return `
				<li class="nav-item">
					<a
						href="${item.link}"
						class="nav-link align-center ${isActive ? 'active' : ''}">
						${item.label}
					</a>
				</li>
			`;
		})
		.join('');
}
