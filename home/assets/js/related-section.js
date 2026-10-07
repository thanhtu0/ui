export async function loadRelatedSections() {
	const response = await fetch('./assets/js/data/related-section.json');
	const data = await response.json();

	const container = document.querySelector('#related-sections');

	container.innerHTML = data.sections
		.map((section, sectionIndex) => {
			const isReverse = sectionIndex % 2 !== 0;

			return `
				<section class="related-section">
					<div
						class="section-title"
						data-aos="${isReverse ? 'fade-left' : 'fade-right'}">

						<div class="section-title-content align-center">
							<span class="icon-title flex-center">
								<img
									src="${section.icon}"
									alt="" />
							</span>

							<h2 class="text-title">
								${section.title}
							</h2>
						</div>
					</div>

					<div class="related-section-list">
						${section.articles
							.map((article, articleIndex) => {
								const articleFromRight =
									sectionIndex % 2 === 0 ? articleIndex % 2 === 0 : articleIndex % 2 !== 0;

								return `
										<article
											class="related-article"
											data-aos="${articleFromRight ? 'fade-left' : 'fade-right'}">

											${
												article.image
													? `
														<img
															class="related-article-image"
															src="${article.image}"
															alt=""
														/>
													`
													: ''
											}

											<div class="related-article-list">
												<h3 class="text-subtitle line-clamp-3">
													<a href="${article.link}">
														${article.title}
													</a>
												</h3>

												<div class="date-meta align-center text-sm-desc">
													<img
														src="./assets/images/list-icon/schedule.png"
														alt=""
														/>

													<span>${article.date}</span>
												</div>

												${
													article.description
														? `
															<p class="text-desc line-clamp-3">
																${article.description}
															</p>
														`
														: ''
												}
											</div>
										</article>
									`;
							})
							.join('')}
					</div>
				</section>
			`;
		})
		.join('');

	AOS.refreshHard();
}
