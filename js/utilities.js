export default class RobroyUtilities {
	static addAttributes(elemName, elem) {
		if (!window.ROBROY.args.attributes[elemName]) {
			return;
		}
		Object.keys(window.ROBROY.args.attributes[elemName]).forEach((property) => {
			elem.setAttribute(property, window.ROBROY.args.attributes[elemName][property]);
		});
	}

	static callback(name) {
		if (!window.ROBROY.args.callbacks[name]) {
			return;
		}
		window.ROBROY.args.callbacks[name]();
	}

	static debounce(func, wait, immediate, ...args) {
		var timeout;
		return function () {
			var context = this;
			var later = function () {
				timeout = null;
				if (!immediate) {
					func.apply(context, args);
				}
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) {
				func.apply(context, args);
			}
		};
	}

	static isLoggedIn() {
		return window.localStorage.getItem('authenticated');
	}

	static propertyExists(object, property) {
		return Object.prototype.hasOwnProperty.call(object, property);
	}
}
