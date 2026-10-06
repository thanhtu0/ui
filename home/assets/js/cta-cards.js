export async function loadCtaCards() {
	const response = await fetch('./assets/js/data/cta-cards.json');
	const data = await response.json();

	const list = document.querySelector('#banner-list');

	list.innerHTML = data.items
		.map(
			(item) => `
				<a
					href="${item.link}"
					class="cta-card align-center ${item.theme}">

					<span class="cta-icon flex-center">
						<img
							src="${item.icon}"
							alt="" />
					</span>

					<span
						class="cta-text"
						${item.textColor ? `style="color: ${item.textColor}"` : ''}>
						${item.title}
					</span>
				</a>
			`,
		)
		.join('');
}
