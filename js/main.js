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
	for (let i = 0; i < scrollLinks.length; i++) {
		const sclink = e =>{
			e.preventDefault();
			const id = scrollLinks[i].getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		};
		scrollLinks[i].addEventListener('click', sclink);
	}
}

const closeCart = e => {
	const target = e.target;
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