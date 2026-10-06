export async function loadActivities() {
	const response = await fetch('./assets/js/data/activities.json');
	const data = await response.json();

	const nav = document.querySelector('#activities-nav');
	const list = document.querySelector('#activities-list');

	// Lấy tab đang active lúc trang vừa load
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
				<p class="empty-message text-subtitle">
					Chưa có hoạt động trong danh mục này.
				</p>
			`;

			return;
		}

		list.innerHTML = filteredActivities
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
	}

	nav.addEventListener('click', function (event) {
		const tab = event.target.closest('[data-category]');

		if (!tab) return;

		event.preventDefault();

		// Đổi category hiện tại
		currentCategory = tab.dataset.category;

		// Render lại tab
		renderTabs();

		// Render lại danh sách
		renderActivities();
	});

	renderTabs();
	renderActivities();
}
