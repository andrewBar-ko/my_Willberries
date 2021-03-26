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
	modalCart = document.querySelector('#modal-cart'),
	viewAll = document.querySelectorAll('.view-all'),
	navLink = document.querySelectorAll('.navigation-link:not(.view-all)'),
	longGoodsList = document.querySelector('.long-goods-list'),
	showAcsess = document.querySelectorAll('.show-acsess'),
	showClosing = document.querySelectorAll('.show-closing'),
	cartTableGoods = document.querySelector('.cart-table__goods'),
	cardTableTotal = document.querySelector('.card-table__total'),
	cartCount = document.querySelector('.cart-count'),
	modalClear = document.querySelector('.modal-clear'),
	modalForm = document.querySelector('.modal-form');

// Получение товаров 
// Функция синхронизации с базой данных при первом запросе!
const checkGoods = () => {

	const data = [];
	return async () => {

		if (data.length) {return data;}
		// Вместо db/db.json можно поставить любой адрес!
		const result = await fetch('db/db.json');	
		if(!result.ok) {
			throw 'Ошибочка вышла:' + result.status;
		}
		data.push(...(await result.json()));
	
		return data;
	};
	
};
const getGoods = checkGoods();
// ---

// Обьект cart
const cart = {
	cartGoods: [],

	// Вывод количества товаров в корзине
	countQuant() {
		cartCount.textContent = this.cartGoods.reduce((sum, item) => {
			return sum + item.count;
		}, 0);
	},

	// Добавление карточки на страницу
	renderCart(){
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({id, name, price, count}) => {
			const trGood =document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;
			
			trGood.innerHTML = `
				<td>${name}</td>
				<td>${price}$</td>
				<td><button class="cart-btn-minus">-</button></td>
				<td>${count}</td>
				<td><button class="cart-btn-plus">+</button></td>
				<td>${price * count}$</td>
				<td><button class="cart-btn-delete">x</button></td>
			`;

			cartTableGoods.append(trGood);
		});

		const totalPrice = this.cartGoods.reduce((sum, item) => {
			return sum + item.price * item.count;
		}, 0);
		
		cardTableTotal.textContent = totalPrice + '$';
	},
	
	// Удаление товара из карзины
	delGood(id){
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		this.renderCart();
		this.countQuant();
	},
	// Выбор количества товара при клике "-"
	minusGood(id){
		for (const item of this.cartGoods) {
			if (item.id === id) {
				if (item.count <= 1) {
					this.delGood(id);
				} else {
					item.count--;
				}
				break;
			}
		}
		this.renderCart();
		this.countQuant();
	},
	// Выбор количества товара при клике "+"
	pluseGood(id){
		for (const item of this.cartGoods) {
			if (item.id === id) {
				item.count++;
				break;
			}
		}
		this.renderCart();
		this.countQuant();
	},
	// Добавление товара в карзину
	addCartGood(id){
		const goodItem = this.cartGoods.find(item => item.id === id);
		if(goodItem) {
			this.pluseGood(id);
		} else {
			getGoods()
				.then(data => data.find(item => item.id === id))
				.then(({ id, name, price }) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1
					});
					this.countQuant();
				});
		}
	},

	// Метод очищения корзины
	clearCart() {
		this.cartGoods.length = 0;
		this.countQuant();
		this.renderCart();
	},
}; 

// bind(cart) - явеная привязка контекста вызова к функции
modalClear.addEventListener('click', cart.clearCart.bind(cart));
cart.renderCart();

document.body.addEventListener('click', e => {
	const addToCart = e.target.closest('.add-to-cart');

	if (addToCart) {
		cart.addCartGood(addToCart.dataset.id);
	}
});

// Deleting a card when you click on a minus sign 
cartTableGoods.addEventListener('click', e => {

	const target = e.target;

	if (target.tagName === "BUTTON") {
		const id = target.closest('.cart-item').dataset.id;
		if (target.classList.contains('cart-btn-delete')) {
			cart.delGood(id);
		}
		if (target.classList.contains('cart-btn-minus')) {
			cart.minusGood(id);
		}
		if (target.classList.contains('cart-btn-plus')) {
			cart.pluseGood(id);
		}
	}
	
});


const openModal = () => {
	cart.renderCart();
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
		.then(data => data.filter(good => good[field] === value))
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

// Работа с сервером
const postData = dataUser => fetch('server.php', {
	method: 'POST',
	body: dataUser,
});

modalForm.addEventListener('submit', e => {
	e.preventDefault();

	const formData = new FormData(modalForm);
	formData.append('products', JSON.stringify(cart.cartGoods));

	postData(formData)
		.then(response => {
			if (!response.ok) {
				throw new Error(response.status);
			}
			alert('Заказ отправлен, ожидайте!');
			console.log(response.statusText);
		})
		.catch(err => {
			alert('Ошибка!');
			console.log(err);
		})
		.finally(() => {
			closeModal();
			modalForm.reset();
			cart.cartGoods.length = 0;
		});
});