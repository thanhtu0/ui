let imageLibraryTimer = null;
let imageLibraryResizeTimer = null;
let imageLibraryResetTimer = null;

function getImageLibraryVisibleItems() {
	if (window.matchMedia('(max-width: 340px)').matches) {
		return 1;
	}
	if (window.matchMedia('(max-width: 500px)').matches) {
		return 2;
	}

	if (window.matchMedia('(max-width: 756px)').matches) {
		return 3;
	}

	return 4;
}

export async function loadImageLibrary() {
	const container = document.querySelector('#image-library');
	if (!container) return;

	try {
		const response = await fetch('./assets/js/data/image-library.json');
		if (!response.ok) {
			throw new Error('Không thể tải dữ liệu image-library');
		}

		const data = await response.json();

		const renderItem = (item) => `
            <article class="image-library-item">
                <a
                    href="${item.link || '#'}"
                    class="image-library-thumb">
                    <img
                        src="${item.image}"
                        alt="${item.title || ''}" />
                </a>

                <h3 class="image-library-item-title text-subtitle line-clamp">
                    <a href="${item.link || '#'}">
                        ${item.title || ''}
                    </a>
                </h3>
            </article>
        `;

		const itemsHTML = (data.items || []).map(renderItem).join('');

		container.innerHTML = `
            <div class="section-title">
                <div class="section-title-content has-accent align-center">
                    <span class="icon-title flex-center">
                        <img
                            src="${data.icon || ''}"
                            alt="" />
                    </span>

                    <h2 class="text-title">
                        ${data.title || ''}
                    </h2>
                </div>
            </div>

            <div class="image-library-list">
                <div class="image-library-track" id="image-library-track">
                    ${itemsHTML}
                </div>
            </div>
        `;

		startImageLibrarySlider();
	} catch (error) {
		console.error('Lỗi tải image-library:', error);
	}
}

function startImageLibrarySlider() {
	clearInterval(imageLibraryTimer);
	clearTimeout(imageLibraryResetTimer);

	const container = document.querySelector('#image-library .image-library-list');
	const track = document.querySelector('#image-library-track');
	if (!container || !track) return;

	track.querySelectorAll('.is-clone').forEach((clone) => clone.remove());

	const originalItems = Array.from(track.children);
	const originalCount = originalItems.length;
	if (originalCount === 0) return;

	const visibleItems = getImageLibraryVisibleItems();

	if (originalCount <= visibleItems) {
		track.style.transform = 'translateX(0)';
		return;
	}

	let currentIndex = 0;
	track.style.transition = 'none';
	track.style.transform = 'translateX(0)';

	originalItems.slice(0, visibleItems).forEach((item) => {
		const clone = item.cloneNode(true);
		clone.classList.add('is-clone');
		track.appendChild(clone);
	});

	const allItems = track.querySelectorAll('.image-library-item');

	requestAnimationFrame(() => {
		track.style.transition = 'transform 0.5s ease';
	});

	function getItemWidth() {
		const computedStyle = window.getComputedStyle(track);
		const gap = parseFloat(computedStyle.gap || computedStyle.columnGap) || 24;
		return allItems[0].getBoundingClientRect().width + gap;
	}

	function slideNext() {
		currentIndex++;
		track.style.transform = `translateX(-${currentIndex * getItemWidth()}px)`;

		if (currentIndex === originalCount) {
			imageLibraryResetTimer = setTimeout(() => {
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
		clearInterval(imageLibraryTimer);
		imageLibraryTimer = setInterval(slideNext, 3000);
	}

	startTimer();

	track.addEventListener('mouseenter', () => clearInterval(imageLibraryTimer));
	track.addEventListener('mouseleave', startTimer);
	track.addEventListener('touchstart', () => clearInterval(imageLibraryTimer), { passive: true });
	track.addEventListener('touchend', startTimer);
}

window.addEventListener('resize', () => {
	clearTimeout(imageLibraryResizeTimer);
	imageLibraryResizeTimer = setTimeout(() => {
		startImageLibrarySlider();
	}, 150);
});
