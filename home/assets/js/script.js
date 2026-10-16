import { loadWebsiteLinks } from './website-links.js';
import { loadSponsors } from './sponsor.js';
import { loadCtaCards } from './cta-cards.js';
import { loadContact } from './contact.js';
import { loadSearchPeople } from './missing-relatives.js';
import { loadArticles } from './articles.js';
import { loadActivities } from './activities.js';
import { loadRelatedSections } from './related-section.js';
import { loadMainNav } from './navbar.js';
import { loadImageLibrary } from './image-library.js';
import { loadVideoLibrary } from './video-library.js';

loadWebsiteLinks();
loadSponsors();
loadCtaCards();
loadContact();
loadSearchPeople();
loadArticles();
loadActivities();
loadRelatedSections();
loadMainNav();
loadImageLibrary();
loadVideoLibrary();

const scrollTopButton = document.querySelector('#scrollTop');

const SCROLL_THRESHOLD = 300;

let ticking = false;

function updateScrollProgress() {
	const scrollTop = window.scrollY || document.documentElement.scrollTop;

	const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

	const progress = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0;

	scrollTopButton.style.setProperty('--progress', `${progress}%`);

	const isVisible = scrollTop > SCROLL_THRESHOLD;

	scrollTopButton.classList.toggle('is-visible', isVisible);
	scrollTopButton.setAttribute('aria-hidden', String(!isVisible));
	scrollTopButton.tabIndex = isVisible ? 0 : -1;

	ticking = false;
}

window.addEventListener(
	'scroll',
	() => {
		if (!ticking) {
			window.requestAnimationFrame(updateScrollProgress);
			ticking = true;
		}
	},
	{ passive: true },
);

window.addEventListener('resize', updateScrollProgress, {
	passive: true,
});

scrollTopButton.addEventListener('click', () => {
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	window.scrollTo({
		top: 0,
		behavior: prefersReducedMotion ? 'instant' : 'smooth',
	});
});

updateScrollProgress();

const sidebar = document.querySelector('#site-sidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const sidebarClose = document.querySelector('.sidebar-close');
const sidebarOverlay = document.querySelector('.sidebar-overlay');

if (sidebar && sidebarToggle && sidebarClose && sidebarOverlay) {
	const setSidebarState = (isOpen) => {
		document.body.classList.toggle('sidebar-open', isOpen);

		sidebarToggle.setAttribute('aria-expanded', String(isOpen));
		sidebarToggle.setAttribute('aria-label', isOpen ? 'Đóng thanh tiện ích' : 'Mở thanh tiện ích');

		document.body.style.overflow = isOpen ? 'hidden' : '';

		if (isOpen) {
			sidebarClose.focus();
		} else {
			sidebarToggle.focus();
		}
	};

	sidebarToggle.addEventListener('click', () => {
		setSidebarState(true);
	});

	sidebarClose.addEventListener('click', () => {
		setSidebarState(false);
	});

	sidebarOverlay.addEventListener('click', () => {
		setSidebarState(false);
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && document.body.classList.contains('sidebar-open')) {
			setSidebarState(false);
		}
	});
}
