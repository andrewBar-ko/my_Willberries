'use strict';

// Slider
const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});



// Cart
const btnCart = document.querySelector('.button-cart'),
	modalCart = document.querySelector('#modal-cart');

const openModal = () => {
	modalCart.classList.add('show');
};

const closeModal = () => {
	modalCart.classList.remove('show');
};

// Scroll smooth function All
{
	const scrollLinks = document.querySelectorAll('a.scroll-link');
	for (const scrollLink of scrollLinks) {
		const sclink = e =>{
			e.preventDefault();
			const id = scrollLink.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		};
		scrollLink.addEventListener('click', sclink);
	}
}

const closeCart = e => {
	const target = e.target;
	// Проверка на наличие класса!
	if(target.classList.contains('overlay') || 
		target.classList.contains('modal-close')) {
			closeModal();
		}
};

// closing the Modal by Esc
document.addEventListener('keydown', e => {
	if (e.code === 'Escape') {
		closeModal();
	}
});

btnCart.addEventListener('click', openModal);
modalCart.addEventListener('click', closeCart);



// Working with goods
const viewAll = document.querySelectorAll('.view-all'),
	navLink = document.querySelectorAll('.navigation-link:not(.view-all)'),
	longGoodsList = document.querySelector('.long-goods-list'),
	showAcsess = document.querySelectorAll('.show-acsess'),
	showClosing = document.querySelectorAll('.show-closing');

// Получение товаров 
const getGoods = async () => {
	// Вместо db/db.json можно поставить любой адрес!
	const result = await fetch('db/db.json');	
	if(!result.ok) {
		throw 'Ошибочка вышла:' + result.status;
	}
	return await result.json();
};
// Добавление карточки товара
const createCart = ({ label, img, name, description, id, price}) => {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';

	card.innerHTML = `
		<div class="goods-card">
			${label ?
				`<span class="label">
					${label}
				</span>` :
				''}
			<img src="db/${img}" alt="${name}" class="goods-image">
			<h3 class="goods-title">
				${name}
			</h3>
			<p class="goods-description">
				${description}
			</p>
			<button class="button goods-card-btn add-to-cart" data-id="${id}">
				<span class="button-price">$${price}</span>
			</button>
		</div>
	`;
	return card;
};

// Показ карточки товара
const renderCards = data => {
	longGoodsList.textContent = '';
	const cards = data.map(createCart);
	longGoodsList.append(...cards);

	document.body.classList.add('show-goods');
};

// Показ всех карточек при клике на View All
const showAll = e => {
	e.preventDefault();
	getGoods().then(renderCards);
};

viewAll.forEach(elem => {
	elem.addEventListener('click', showAll);
});

// Показ карточек из категорий меню:
// Фильтр
const filterCards = (field, value) => {
	getGoods()
		.then(data => {
			const filtereGoods = data.filter(good => {
				return good[field] === value;
			});
			return filtereGoods;
		})
		.then(renderCards);
};
// Показ при клике
navLink.forEach(link => {
	link.addEventListener('click', e => {
		e.preventDefault();
		const field = link.dataset.field,
			value = link.textContent;
			filterCards(field, value);
	});
});

// Click по баннерам
showAcsess.forEach(item => {
	item.addEventListener('click', e => {
		e.preventDefault();
		filterCards('category', 'Accessories');
	});
});

showClosing.forEach(item => {
	item.addEventListener('click', e => {
		e.preventDefault();
		filterCards('category', 'Clothing');
	});
});