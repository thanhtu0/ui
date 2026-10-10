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

const navigation = document.querySelector('.navigation');
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('#nav-list');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-btn');
const mobileSearchQuery = window.matchMedia('(max-width: 600px)');

if (navigation && navToggle && navList) {
	const closeMenu = () => {
		navigation.classList.remove('is-open');
		navToggle.setAttribute('aria-expanded', 'false');
	};

	navToggle.addEventListener('click', () => {
		const isOpen = navigation.classList.toggle('is-open');
		navToggle.setAttribute('aria-expanded', String(isOpen));
	});

	navList.addEventListener('click', (event) => {
		if (event.target.closest('.nav-link')) closeMenu();
	});

	document.addEventListener('keydown', (event) => {
		if (event.key !== 'Escape') return;

		closeMenu();
		if (searchForm?.classList.contains('is-search-open')) {
			searchForm.classList.remove('is-search-open');
			searchButton?.focus();
		} else {
			navToggle.focus();
		}
	});

	const desktopQuery = window.matchMedia('(min-width: 1101px)');
	desktopQuery.addEventListener('change', (event) => {
		if (event.matches) closeMenu();
	});
}

if (searchForm && searchInput && searchButton) {
	searchButton.addEventListener('click', (event) => {
		if (mobileSearchQuery.matches && !searchForm.classList.contains('is-search-open')) {
			event.preventDefault();
			searchForm.classList.add('is-search-open');
			searchInput.focus();
		}
	});

	mobileSearchQuery.addEventListener('change', () => {
		searchForm.classList.remove('is-search-open');
	});
}
