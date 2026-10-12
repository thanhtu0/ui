let activitiesTimer = null;
let activitiesResetTimer = null;
let activitiesResizeTimer = null;
let activitiesData = null;
let currentCategory = null;

function getVisibleItemsCount() {
	if (window.matchMedia('(max-width: 500px)').matches) {
		return 1;
	}
	if (window.matchMedia('(max-width: 756px)').matches) {
		return 2;
	}
	return 3;
}

export async function loadActivities() {
	const nav = document.querySelector('#activities-nav');
	const list = document.querySelector('#activities-list');
	const menuToggle = document.querySelector('.activities-menu-toggle');
	const header = document.querySelector('.activities-header');

	if (!nav || !list || !header) {
		console.error('Không tìm thấy phần tử của activities.');
		return;
	}

	try {
		const response = await fetch('./assets/js/data/activities.json');
		if (!response.ok) {
			throw new Error('Không thể tải dữ liệu activities');
		}
		activitiesData = await response.json();
	} catch (error) {
		console.error('Lỗi khi fetch activities:', error);
		return;
	}

	const activeTab = activitiesData.tabs?.find((tab) => tab.active);
	currentCategory = activeTab?.id ?? activitiesData.tabs?.[0]?.id;

	if (!currentCategory) {
		console.error('Không tìm thấy danh mục hoạt động.');
		return;
	}

	function closeMenu() {
		header.classList.remove('menu-open');
		if (menuToggle) {
			menuToggle.setAttribute('aria-expanded', 'false');
			menuToggle.setAttribute('aria-label', 'Mở danh mục hoạt động');
		}
	}

	function renderTabs() {
		nav.innerHTML = (activitiesData.tabs || [])
			.map(
				(tab) => `
                    <a
                        href="#"
                        class="${tab.id === currentCategory ? 'active' : ''}"
                        data-category="${tab.id}"
                        ${tab.id === currentCategory ? 'aria-current="true"' : ''}>
                        ${tab.name}
                    </a>
                `,
			)
			.join('');
	}

	if (menuToggle) {
		menuToggle.addEventListener('click', () => {
			const isOpen = header.classList.toggle('menu-open');
			menuToggle.setAttribute('aria-expanded', String(isOpen));
			menuToggle.setAttribute('aria-label', isOpen ? 'Đóng danh mục hoạt động' : 'Mở danh mục hoạt động');
		});
	}

	nav.addEventListener('click', (event) => {
		const tab = event.target.closest('[data-category]');
		if (!tab) return;

		event.preventDefault();
		currentCategory = tab.dataset.category;

		closeMenu();
		renderTabs();
		renderActivities();
	});

	renderTabs();
	renderActivities();
}

function createActivityItem(activity) {
	return `
        <article class="activities-item">
            <a href="${activity.link || '#'}" class="activities-thumb">
                <img src="${activity.image}" alt="${activity.title || ''}" />
            </a>

            <h3 class="activities-item-title text-subtitle line-clamp-3">
                <a href="${activity.link || '#'}">${activity.title || ''}</a>
            </h3>

            <div class="date-meta align-center text-sm-desc">
                <img src="./assets/images/list-icon/schedule.png" alt="" />
                <span>${activity.date || ''}</span>
            </div>
        </article>
    `;
}

function renderActivities() {
	clearInterval(activitiesTimer);
	clearTimeout(activitiesResetTimer);

	activitiesTimer = null;
	activitiesResetTimer = null;

	const list = document.querySelector('#activities-list');
	if (!list || !activitiesData) return;

	const filteredActivities = (activitiesData.activities || []).filter(
		(activity) => activity.category === currentCategory,
	);

	if (filteredActivities.length === 0) {
		list.innerHTML = `
            <p class="empty-message text-desc">
                Chưa có hoạt động trong danh mục này.
            </p>
        `;
		return;
	}

	const items = filteredActivities.map(createActivityItem).join('');
	const visibleItems = getVisibleItemsCount();

	if (filteredActivities.length <= visibleItems) {
		list.innerHTML = `
            <div class="activities-track" id="activities-track">
                ${items}
            </div>
        `;
		return;
	}

	const clonedItems = filteredActivities.slice(0, visibleItems).map(createActivityItem).join('');

	list.innerHTML = `
        <div class="activities-track" id="activities-track">
            ${items}
            ${clonedItems}
        </div>
    `;

	startActivitiesSlider(filteredActivities.length, visibleItems);
}

function startActivitiesSlider(originalCount, visibleItems) {
	clearInterval(activitiesTimer);
	clearTimeout(activitiesResetTimer);

	const track = document.querySelector('#activities-track');
	if (!track) return;

	const items = track.querySelectorAll('.activities-item');
	if (items.length <= visibleItems) return;

	let currentIndex = 0;
	let isPaused = false;

	track.style.transition = 'none';
	track.style.transform = 'translateX(0)';

	requestAnimationFrame(() => {
		track.style.transition = 'transform 0.5s ease';
	});

	function getItemWidth() {
		const computedStyle = window.getComputedStyle(track);
		const gap = parseFloat(computedStyle.gap || computedStyle.columnGap) || 24;
		return items[0].getBoundingClientRect().width + gap;
	}

	function slideNext() {
		if (isPaused) return;

		currentIndex++;
		track.style.transform = `translateX(-${currentIndex * getItemWidth()}px)`;

		if (currentIndex === originalCount) {
			activitiesResetTimer = setTimeout(() => {
				track.style.transition = 'none';
				currentIndex = 0;
				track.style.transform = 'translateX(0)';

				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						track.style.transition = 'transform 0.5s ease';
					});
				});
			}, 500);
		}
	}

	function startTimer() {
		clearInterval(activitiesTimer);
		if (!isPaused) {
			activitiesTimer = setInterval(slideNext, 3000);
		}
	}

	function pauseSlider() {
		isPaused = true;
		clearInterval(activitiesTimer);
	}

	function resumeSlider() {
		isPaused = false;
		startTimer();
	}

	track.addEventListener('mouseenter', pauseSlider);
	track.addEventListener('mouseleave', resumeSlider);
	track.addEventListener('touchstart', pauseSlider, { passive: true });
	track.addEventListener('touchend', resumeSlider, { passive: true });

	startTimer();
}

window.addEventListener('resize', () => {
	clearTimeout(activitiesResizeTimer);
	activitiesResizeTimer = setTimeout(() => {
		if (activitiesData) {
			renderActivities();
		}
	}, 150);
});
