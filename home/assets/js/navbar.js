export async function loadMainNav() {
	const response = await fetch('./assets/js/data/navbar.json');
	const data = await response.json();

	const navList = document.querySelector('.nav-list');

	const currentPath = window.location.pathname;

	navList.innerHTML = data.items
		.map((item) => {
			const isActive = currentPath.endsWith(item.link);

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
