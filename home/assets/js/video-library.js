let videoTimer;

export async function loadVideoLibrary() {
	const response = await fetch('./assets/js/data/video-library.json');
	const data = await response.json();

	const heading = document.querySelector('#video-widget-heading');
	const list = document.querySelector('#video-list');

	function renderHeading() {
		heading.innerHTML = `
			<span class="icon-title flex-center">
				<img
					src="${data.icon}"
					alt="" />
			</span>

			<h3 class="text-title">
				${data.title}
			</h3>
		`;
	}

	function renderVideos() {
		if (data.items.length === 0) {
			list.innerHTML = `
				<p class="empty-message text-desc">
					Chưa có video.
				</p>
			`;

			return;
		}

		list.innerHTML = data.items
			.map(
				(video, index) => `
					<a
						href="${video.link}"
						class="video-item ${index === 0 ? 'active' : ''}">

						<div class="video-thumbnail">
							<img
								src="${video.thumbnail}"
								alt="${video.alt}" />

							<span class="play-button flex-center">
								<img
									src="./assets/images/list-icon/play_arrow.png"
									alt="" />
							</span>
						</div>

						<h4 class="text-subtitle">
							${video.title}
						</h4>
					</a>
				`,
			)
			.join('');

		startVideoSlider();
	}

	renderHeading();
	renderVideos();
}

function startVideoSlider() {
	clearInterval(videoTimer);

	const items = document.querySelectorAll('#video-list .video-item');

	const dotsContainer = document.querySelector('#video-dots');

	if (items.length <= 1) {
		return;
	}

	let currentIndex = 0;

	dotsContainer.innerHTML = Array.from(items)
		.map(
			(_, index) => `
				<button
					type="button"
					class="video-dot ${index === 0 ? 'active' : ''}"
					data-index="${index}"
					aria-label="Xem video ${index + 1}">
				</button>
			`,
		)
		.join('');

	const dots = dotsContainer.querySelectorAll('.video-dot');

	function showVideo(index) {
		items.forEach((item) => {
			item.classList.remove('active');
		});

		dots.forEach((dot) => {
			dot.classList.remove('active');
		});

		items[index].classList.add('active');
		dots[index].classList.add('active');

		currentIndex = index;
	}

	function showNextVideo() {
		currentIndex++;

		if (currentIndex >= items.length) {
			currentIndex = 0;
		}

		showVideo(currentIndex);
	}

	dots.forEach((dot) => {
		dot.addEventListener('click', () => {
			const index = Number(dot.dataset.index);

			showVideo(index);

			startTimer();
		});
	});

	function startTimer() {
		clearInterval(videoTimer);

		videoTimer = setInterval(showNextVideo, 3000);
	}

	showVideo(0);
	startTimer();
}
