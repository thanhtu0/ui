export async function loadArticles() {
	const response = await fetch('./assets/js/data/articles.json');
	const data = await response.json();

	const articleList = document.querySelector('#article-list');

	articleList.innerHTML = `
		<div class="section-title" 
		data-aos="fade-right" 
		data-aos-duration="1000"    
		data-aos-once="true">
			<div class="section-title-content has-accent align-center">
				<span class="icon-title flex-center">
					<img
						src="${data.icon}"
						alt="${data.title}" />
				</span>

				<h2 class="text-title">${data.title}</h2>
			</div>
		</div>

		${data.articles
			.map(
				(article) => `
					<article class="article-item ${article.featured ? 'featured' : ''}"
					data-aos="${article.featured ? 'fade-right' : 'fade-left'}" 
					data-aos-duration="1000"
					data-aos-once="true">
						<a
							href="${article.link || '#'}"
							class="thumb-link">
							<img
								src="${article.image}"
								alt="${article.title}"
								class="thumb-img" />
						</a>

						<div class="article-info">
							<h3 class="article-title text-subtitle line-clamp">
								<a href="${article.link || '#'}">
									${article.title}
								</a>
							</h3>

							<div class="date-meta align-center text-sm-desc">
								<img
									src="${data.dateIcon}"
									alt="" />
								<span>${article.date}</span>
							</div>

							<p class="article-desc text-desc line-clamp-3">
								${article.description}
							</p>
						</div>
					</article>
				`,
			)
			.join('')}
	`;
}
