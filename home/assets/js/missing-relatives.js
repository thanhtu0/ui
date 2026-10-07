export async function loadSearchPeople() {
	const response = await fetch('./assets/js/data/missing-relatives.json');

	const data = await response.json();

	const list = document.querySelector('#missing-relatives-list');

	if (!list) return;

	list.innerHTML = data.items
		.map(
			(item, index) => `
				<div
					class="mini-post"
					data-aos="fade-up"
					data-aos-delay="${index * 150}">
					
					<img
						src="${item.image}"
						alt="${item.name}"
						class="mini-thumb" />

					<div class="mini-content">
						<h4 class="text-subtitle">
							<a href="${item.link}">
								${item.name}
							</a>
						</h4>

						<p class="mini-desc text-sm-desc">
							${item.description}
						</p>
					</div>
				</div>
			`,
		)
		.join('');

	AOS.refreshHard();
}
