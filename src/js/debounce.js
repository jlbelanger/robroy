// https://davidwalsh.name/javascript-debounce-function
export default (func, wait, immediate) => {
	let timeout;
	return function (...args) { // eslint-disable-line func-names
		const context = this;
		const later = () => {
			timeout = null;
			if (!immediate) {
				func.apply(context, args);
			}
		};
		const callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) {
			func.apply(context, args);
		}
	};
};
