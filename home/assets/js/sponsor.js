export async function loadSponsors() {
	const response = await fetch('./assets/js/data/sponsor.json');
	const data = await response.json();

	const list = document.querySelector('#sponsor-list');

	list.innerHTML = data.items
		.map(
			(item) => `
				<a
					href="${item.link}"
					class="sponsor-item align-center">

					<img
						src="${item.image}"
						alt="${item.name}" />

					<span class="text-subtitle">
						${item.name}
					</span>
				</a>
			`,
		)
		.join('');
}
