function renderOfficeContact(contact) {
	const list = document.querySelector('#office-contact-list');

	list.innerHTML = `
		<div class="office-contact-item">
			<span class="office-contact-icon flex-center">
				<img
					src="./assets/images/list-icon/location_on_white.png"
					alt="" />
			</span>

			<div class="office-contact-detail">
				<h3 class="text-subtitle">Địa chỉ</h3>
				<p class="text-desc">
					${contact.address}
				</p>
			</div>
		</div>

		<div class="office-contact-item">
			<span class="office-contact-icon flex-center">
				<img
					src="./assets/images/list-icon/deskphone_white.png"
					alt="" />
			</span>

			<div class="office-contact-detail">
				<h3 class="text-subtitle">Số điện thoại</h3>
				<p class="text-desc">
					${contact.phone}
				</p>
			</div>
		</div>

		<div class="office-contact-item">
			<span class="office-contact-icon flex-center">
				<img
					src="./assets/images/list-icon/call_white.png"
					alt="" />
			</span>

			<div class="office-contact-detail">
				<h3 class="text-subtitle">Di động</h3>
				<p class="text-desc">
					${contact.mobile}
				</p>
			</div>
		</div>
	`;
}

function renderContactInfo(contact) {
	const container = document.querySelector('#contact-info');

	container.innerHTML = `
		<h4 class="title">
			Mọi thông tin xin liên hệ
		</h4>

		<div class="contact-item">
			<span class="contact-icon">
				<img
					src="./assets/images/list-icon/location_on.png"
					alt="" />
			</span>

			<p class="text-sm-desc">
				${contact.address}
			</p>
		</div>

		<div class="contact-item">
			<span class="contact-icon">
				<img
					src="./assets/images/list-icon/deskphone.png"
					alt="" />
			</span>

			<p class="text-sm-desc">
				${contact.phone}
			</p>
		</div>

		<div class="contact-item">
			<span class="contact-icon">
				<img
					src="./assets/images/list-icon/call.png"
					alt="" />
			</span>

			<p class="text-sm-desc">
				${contact.mobile}
			</p>
		</div>
	`;
}

function renderFooterContact(contact) {
	const container = document.querySelector('#footer-contact');

	container.innerHTML = `
		<h2 class="text-title">
			${contact.name}
		</h2>

		<p class="info-item text-desc">
			Địa chỉ: ${contact.address}
		</p>

		<p class="info-item text-desc">
			Số điện thoại: ${contact.phone}
			&nbsp;&nbsp;&nbsp;&nbsp;
			Di động: ${contact.mobile}
		</p>

		<p class="info-item text-desc">
			Số tài khoản:
			<strong>371301060855</strong>
			tại Kho bạc Nhà nước tỉnh Thừa Thiên Huế
		</p>
	`;
}

export async function loadContact() {
	const response = await fetch('./assets/js/data/contact.json');
	const data = await response.json();

	const contact = data.contact;

	renderOfficeContact(contact);
	renderContactInfo(contact);
	renderFooterContact(contact);
}
