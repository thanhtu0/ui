export async function loadActivities() {
	const response = await fetch('./assets/js/data/activities.json');
	const data = await response.json();

	const nav = document.querySelector('#activities-nav');
	const list = document.querySelector('#activities-list');

	let currentCategory = data.tabs.find((tab) => tab.active).id;

	function renderTabs() {
		nav.innerHTML = data.tabs
			.map(
				(tab) => `
					<a
						href="#"
						class="${tab.id === currentCategory ? 'active' : ''}"
						data-category="${tab.id}">
						${tab.name}
					</a>
				`,
			)
			.join('');
	}

	function renderActivities() {
		const filteredActivities = data.activities.filter((activity) => activity.category === currentCategory);

		if (filteredActivities.length === 0) {
			list.innerHTML = `
			<p class="empty-message text-desc">
				Chưa có hoạt động trong danh mục này.
			</p>
		`;

			return;
		}

		const items = filteredActivities
			.map(
				(activity) => `
				<article class="activities-item">
					<a
						href="${activity.link}"
						class="activities-thumb">

						<img
							src="${activity.image}"
							alt="${activity.title}" />
					</a>

					<h3
						class="activities-item-title text-subtitle line-clamp-3">
						<a href="${activity.link}">
							${activity.title}
						</a>
					</h3>

					<div
						class="date-meta align-center text-sm-desc">

						<img
							src="./assets/images/list-icon/schedule.png"
							alt="" />

						<span>${activity.date}</span>
					</div>
				</article>
			`,
			)
			.join('');

		if (filteredActivities.length <= 3) {
			list.innerHTML = `
			<div class="activities-track">
				${items}
			</div>
		`;

			return;
		}

		const clonedItems = filteredActivities
			.slice(0, 3)
			.map(
				(activity) => `
				<article class="activities-item">
					<a
						href="${activity.link}"
						class="activities-thumb">

						<img
							src="${activity.image}"
							alt="${activity.title}" />
					</a>

					<h3
						class="activities-item-title text-subtitle line-clamp-3">
						<a href="${activity.link}">
							${activity.title}
						</a>
					</h3>

					<div
						class="date-meta align-center text-sm-desc">

						<img
							src="./assets/images/list-icon/schedule.png"
							alt="" />

						<span>${activity.date}</span>
					</div>
				</article>
			`,
			)
			.join('');

		list.innerHTML = `
		<div class="activities-track" id="activities-track">
			${items}
			${clonedItems}
		</div>
	`;

		startActivitiesSlider();
	}

	nav.addEventListener('click', function (event) {
		const tab = event.target.closest('[data-category]');

		if (!tab) return;

		event.preventDefault();

		currentCategory = tab.dataset.category;

		renderTabs();

		renderActivities();
	});

	renderTabs();
	renderActivities();
}

let activitiesTimer;

function startActivitiesSlider() {
	clearInterval(activitiesTimer);

	const track = document.querySelector('#activities-track');
	const items = track.querySelectorAll('.activities-item');

	if (items.length <= 3) {
		return;
	}

	let currentIndex = 0;

	function slideNext() {
		currentIndex++;

		const itemWidth = items[0].offsetWidth + 24;

		track.style.transform = `
			translateX(-${currentIndex * itemWidth}px)
		`;

		if (currentIndex === items.length - 3) {
			setTimeout(() => {
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
		activitiesTimer = setInterval(slideNext, 3000);
	}

	startTimer();

	track.addEventListener('mouseenter', () => {
		clearInterval(activitiesTimer);
	});

	track.addEventListener('mouseleave', () => {
		startTimer();
	});
}
