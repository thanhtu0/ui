export async function loadImageLibrary() {
	const response = await fetch('./assets/js/data/image-library.json');

	const data = await response.json();

	const container = document.querySelector('#image-library');

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
			${data.items
				.map(
					(item) => `
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
					`,
				)
				.join('')}
		</div>
	`;
}
