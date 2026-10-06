export async function loadWebsiteLinks() {
	const response = await fetch('./assets/js/data/website-links.json');
	const data = await response.json();

	const list = document.querySelector('#website-links-list');

	list.innerHTML = data.items
		.map(
			(item) => `
                <a
                    href="${item.link}"
                    class="banner-link">
                    <img
                        src="${item.image}"
                        alt="${item.name}" />
                </a>
            `,
		)
		.join('');
}
