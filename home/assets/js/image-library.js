export async function loadImageLibrary() {
	const response = await fetch('./assets/js/data/image-library.json');

	const data = await response.json();

	const container = document.querySelector('#image-library');

	const renderItem = (item) => `
		<article class="image-library-item">
			<a
				href="${item.link}"
				class="image-library-thumb">
				<img
					src="${item.image}"
					alt="${item.title}" />
			</a>

			<h3 class="image-library-item-title text-subtitle line-clamp">
				<a href="${item.link}">
					${item.title}
				</a>
			</h3>
		</article>
	`;

	const items = data.items.map(renderItem).join('');

	container.innerHTML = `
		<div class="section-title">
			<div class="section-title-content has-accent align-center">
				<span class="icon-title flex-center">
					<img
						src="${data.icon}"
						alt="" />
				</span>

				<h2 class="text-title">
					${data.title}
				</h2>
			</div>
		</div>

		<div class="image-library-list">
			${items}
		</div>
	`;

	if (data.items.length > 4) {
		const clonedItems = data.items.slice(0, 4).map(renderItem).join('');

		const list = container.querySelector('.image-library-list');

		list.innerHTML = `
			<div
				class="image-library-track"
				id="image-library-track">

				${items}
				${clonedItems}

			</div>
		`;

		startImageLibrarySlider();
	}
}

let imageLibraryTimer;

function startImageLibrarySlider() {
	clearInterval(imageLibraryTimer);

	const track = document.querySelector('#image-library-track');

	if (!track) return;

	const items = track.querySelectorAll('.image-library-item');

	if (items.length <= 4) {
		return;
	}

	let currentIndex = 0;

	function slideNext() {
		currentIndex++;

		const itemWidth = items[0].offsetWidth + 24;

		track.style.transform = `
			translateX(-${currentIndex * itemWidth}px)
		`;

		if (currentIndex === items.length - 4) {
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
		imageLibraryTimer = setInterval(slideNext, 3000);
	}

	startTimer();

	track.addEventListener('mouseenter', () => {
		clearInterval(imageLibraryTimer);
	});

	track.addEventListener('mouseleave', () => {
		startTimer();
	});
}
