import './scss/example.scss';

window.addEventListener('load', () => {
	window.robroy();
});

window.counter = 1;
const button = document.getElementById('dynamic-button');
if (button) {
	button.addEventListener('click', () => {
		const a = document.createElement('a');
		a.setAttribute('href', 'https://photography.jennybelanger.com/wp-content/uploads/2008/12/p7013595.jpg');
		a.setAttribute('data-robroy', true);
		document.getElementById('dynamic-container').appendChild(a);

		const img = document.createElement('img');
		img.setAttribute('alt', `Dynamically added image #${window.counter}`);
		img.setAttribute('src', 'https://photography.jennybelanger.com/wp-content/uploads/2008/12/p7013595-377x283.jpg');
		img.setAttribute('height', 141);
		img.setAttribute('width', 188);
		a.appendChild(img);

		window.robroy();

		window.counter += 1;
	});
}
