import debounce from './debounce';

const Robroy = {
	activeElement: null,
	args: null,
	lang: null,
	currentIndex: null,
	isInited: false,
	numImages: 0,
	init: (args) => {
		args = args || {};
		args.selector = args.disableKeyPressListener || '[data-robroy]';
		args.bodyClass = args.bodyClass || 'robroy-open';
		args.id = args.id || 'robroy';
		args.disableKeyPressListener = args.disableKeyPressListener || false;
		args.disableResizeListener = args.disableResizeListener || false;
		args.resizeDebounceMilliseconds = args.resizeDebounceMilliseconds || 100;
		args.minScreenWidth = args.minScreenWidth || 400;
		args.disableImageClickListener = args.disableImageClickListener || false;
		args.imageClickListenerThreshold = args.imageClickListenerThreshold || 0.5;
		args.disableOverlayClickListener = args.disableOverlayClickListener || false;
		args.hideCloseButton = args.hideCloseButton || false;
		args.hideNavButtons = args.hideNavButtons || false;
		args.hideCaption = args.hideCaption || false;
		args.hideOverlay = args.hideOverlay || false;
		args.disableAltCaptions = args.disableAltCaptions || false;
		args.imgLoadIntervalMilliseconds = args.imgLoadIntervalMilliseconds || 250;
		Robroy.args = args;

		const lang = args.lang || {};
		lang.closeImage = lang.closeImage || 'Close Image';
		lang.previousImage = lang.previousImage || 'Previous Image';
		lang.nextImage = lang.nextImage || 'Next Image';
		Robroy.lang = lang;

		// Add thumbnail click listeners.
		const $thumbnails = document.querySelectorAll(args.selector);
		const num = $thumbnails.length;
		let i;
		for (i = 0; i < num; i += 1) {
			$thumbnails[i].addEventListener('click', Robroy.onClickThumbnail);
			$thumbnails[i].setAttribute('data-robroy-index', i);
			Robroy.numImages += 1;
		}

		if (Robroy.isInited || Robroy.numImages <= 0) {
			return;
		}

		// Add key press listener.
		if (!args.disableKeyPressListener) {
			document.addEventListener('keydown', (e) => {
				const $container = document.getElementById(Robroy.args.id);
				if (!$container) {
					return;
				}

				if (e.key === 'ArrowRight') {
					Robroy.next();
				} else if (e.key === 'ArrowLeft') {
					Robroy.previous();
				} else if (e.key === 'Escape') {
					Robroy.close();
				}
			}, false);
		}

		// Add window resize listener.
		if (!args.disableResizeListener) {
			if (args.resizeDebounceMilliseconds) {
				window.addEventListener('resize', debounce(Robroy.onResize, args.resizeDebounceMilliseconds));
			} else {
				window.addEventListener('resize', Robroy.onResize);
			}
		}

		Robroy.isInited = true;
	},
	onClickThumbnail: (e) => {
		// Ignore the click if alt/ctrl/option/shift key was being pressed at the same time.
		if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
			return;
		}

		// Disable lightbox on small screens.
		if (Robroy.args.minScreenWidth && window.innerWidth <= Robroy.args.minScreenWidth) {
			return;
		}

		// Open the lightbox.
		let $thumbnail = e.target;
		while (!$thumbnail.getAttribute('data-robroy-href') && !$thumbnail.getAttribute('href')) {
			$thumbnail = $thumbnail.parentNode;
		}
		Robroy.open($thumbnail);

		// Prevent the default click behavior on this element.
		e.preventDefault();
	},
	onClickImage: (e) => {
		const imageWidth = e.target.width;
		const threshold = imageWidth * Robroy.args.imageClickListenerThreshold;
		if (e.offsetX <= threshold) {
			Robroy.previous();
		} else if (e.offsetX >= (imageWidth - threshold)) {
			Robroy.next();
		}
	},
	onResize: () => {
		const $container = document.getElementById(Robroy.args.id);
		if (!$container) {
			return;
		}

		const $img = $container.querySelector('.robroy__img');
		const $figcaption = $container.querySelector('.robroy__caption');
		Robroy.setSize($img, $figcaption);
	},
	open: ($thumbnail) => {
		// Disallow multiple open lightboxes.
		if (document.getElementById(Robroy.args.id)) {
			return;
		}

		// Save the active element so we can return focus to it when the lightbox is closed.
		Robroy.activeElement = $thumbnail;

		// Add a class to the body to prevent scrolling while the lightbox is open.
		if (Robroy.args.bodyClass) {
			document.body.classList.add(Robroy.args.bodyClass);
		}

		const $container = document.createElement('div');
		$container.setAttribute('class', 'robroy');
		$container.setAttribute('id', Robroy.args.id);
		$container.setAttribute('tabindex', '-1');
		document.body.appendChild($container);

		const $figure = document.createElement('figure');
		$figure.setAttribute('class', 'robroy__figure robroy__figure--loading');
		$container.appendChild($figure);

		if (!Robroy.args.hideCloseButton) {
			const $closeButton = document.createElement('button');
			$closeButton.setAttribute('class', 'robroy__button robroy__button--close');
			$closeButton.setAttribute('title', Robroy.lang.closeImage);
			$closeButton.setAttribute('type', 'button');
			$closeButton.addEventListener('click', Robroy.close);
			$closeButton.innerText = Robroy.lang.closeImage;
			$figure.appendChild($closeButton);
		}

		if (!Robroy.args.hideNavButtons) {
			const $prevButton = document.createElement('button');
			$prevButton.setAttribute('class', 'robroy__button robroy__button--nav robroy__button--prev');
			$prevButton.setAttribute('title', Robroy.lang.previousImage);
			$prevButton.setAttribute('type', 'button');
			$prevButton.addEventListener('click', Robroy.previous);
			$prevButton.innerText = Robroy.lang.previousImage;
			$figure.appendChild($prevButton);

			const $nextButton = document.createElement('button');
			$nextButton.setAttribute('class', 'robroy__button robroy__button--nav robroy__button--next');
			$nextButton.setAttribute('title', Robroy.lang.nextImage);
			$nextButton.setAttribute('type', 'button');
			$nextButton.innerText = Robroy.lang.nextImage;
			$nextButton.addEventListener('click', Robroy.next);
			$figure.appendChild($nextButton);
			$nextButton.focus();
		}

		const $img = document.createElement('img');
		$img.setAttribute('class', 'robroy__img');
		if (!Robroy.args.disableImageClickListener) {
			$img.addEventListener('click', Robroy.onClickImage);
		}
		$figure.appendChild($img);

		if (!Robroy.args.hideCaption) {
			const $figcaption = document.createElement('figcaption');
			$figcaption.setAttribute('class', 'robroy__caption');
			$figure.appendChild($figcaption);
		}

		if (!Robroy.args.hideOverlay) {
			const $overlay = document.createElement('div');
			$overlay.setAttribute('class', 'overlay robroy__overlay');
			if (!Robroy.args.disableOverlayClickListener) {
				$overlay.addEventListener('click', Robroy.close);
			}
			$container.appendChild($overlay);
		}

		Robroy.setImage($thumbnail);
	},
	close: () => {
		if (Robroy.args.bodyClass) {
			document.body.classList.remove('robroy-open');
		}

		// Remove the lightbox.
		const $container = document.getElementById(Robroy.args.id);
		$container.remove();

		// Return focus to the previously focused element.
		Robroy.activeElement.focus();
		Robroy.activeElement = null;
	},
	next: () => {
		// Do not allow going past the last image.
		if (Robroy.currentIndex >= (Robroy.numImages - 1)) {
			return;
		}

		const $thumbnail = document.querySelector(`[data-robroy-index="${Robroy.currentIndex + 1}"]`);
		Robroy.setImage($thumbnail);
	},
	previous: () => {
		// Do not allow going past the first image.
		if (Robroy.currentIndex <= 0) {
			return;
		}

		const $thumbnail = document.querySelector(`[data-robroy-index="${Robroy.currentIndex - 1}"]`);
		Robroy.setImage($thumbnail);
	},
	getCaption: ($thumbnail) => {
		if ($thumbnail.getAttribute('data-robroy-caption')) {
			return $thumbnail.getAttribute('data-robroy-caption');
		}

		let $figcaption = $thumbnail.querySelector('figcaption');
		if ($figcaption) {
			return $figcaption.innerHTML;
		}

		$figcaption = $thumbnail.parentNode.querySelector('figcaption');
		if ($figcaption) {
			return $figcaption.innerHTML;
		}

		if (!Robroy.args.disableAltCaptions) {
			const $img = $thumbnail.querySelector('img');
			if ($img) {
				return $img.getAttribute('alt');
			}
		}

		return '';
	},
	setImage: ($thumbnail) => {
		// Show loading icon.
		const $container = document.getElementById(Robroy.args.id);
		$container.classList.add('robroy--loading');

		// Save current element index.
		Robroy.currentIndex = parseInt($thumbnail.getAttribute('data-robroy-index'), 10);

		// Show/hide navigation.
		if (!Robroy.args.hideNavButtons) {
			const $prevButton = $container.querySelector('.robroy__button--prev');
			const $nextButton = $container.querySelector('.robroy__button--next');
			if (Robroy.currentIndex <= 0) {
				$prevButton.style.display = 'none';
			} else {
				$prevButton.style.display = '';
			}
			if (Robroy.currentIndex >= (Robroy.numImages - 1)) {
				$nextButton.style.display = 'none';
			} else {
				$nextButton.style.display = '';
			}
		}

		// Set image.
		const $img = $container.querySelector('.robroy__img');
		let src = $thumbnail.getAttribute('data-robroy-href');
		if (!src) {
			src = $thumbnail.getAttribute('href');
		}
		$img.setAttribute('src', src);

		// Set image size.
		const height = $thumbnail.getAttribute('data-robroy-height');
		const width = $thumbnail.getAttribute('data-robroy-width');
		if (height && width) {
			const size = Robroy.getSize(height, width);
			$img.setAttribute('height', size.height);
			$img.setAttribute('width', size.width);
		}

		// Show/hide caption.
		const $figcaption = $container.querySelector('.robroy__caption');
		const caption = Robroy.getCaption($thumbnail);
		if (caption) {
			$figcaption.style.display = '';
			$figcaption.innerHTML = caption;
		} else {
			$figcaption.style.display = 'none';
			$figcaption.innerText = '';
		}

		const $figure = $container.querySelector('.robroy__figure');
		if ($img.complete) {
			Robroy.setSize($img, $figcaption);

			// Remove loading icon.
			$container.classList.remove('robroy--loading');
			$figure.classList.remove('robroy__figure--loading');
		} else {
			// Wait for image to load.
			let int = setInterval(() => {
				if ($img.complete) {
					clearInterval(int);
					int = null;

					Robroy.setSize($img, $figcaption);

					// Remove loading icon.
					$container.classList.remove('robroy--loading');
					$figure.classList.remove('robroy__figure--loading');
				}
			}, Robroy.args.imgLoadIntervalMilliseconds);
		}
	},
	getSize: (height, width) => {
		const margin = Robroy.getMargin();
		const maxHeight = window.innerHeight - margin;
		const maxWidth = window.innerWidth - margin;
		const whRatio = width / height;
		const hwRatio = height / width;

		if (height > maxHeight) {
			height = maxHeight;
			width = height * whRatio;
		}

		if (width > maxWidth) {
			width = maxWidth;
			height = width * hwRatio;
		}

		return { height, width };
	},
	setSize: ($img, $figcaption) => {
		// Reset sizes.
		$img.setAttribute('height', '');
		$img.setAttribute('width', '');
		$figcaption.style.width = '';
		$figcaption.style.height = '';

		// Set sizes.
		const size = Robroy.getSize($img.clientHeight, $img.clientWidth);
		$img.setAttribute('height', size.height);
		$img.setAttribute('width', size.width);
		$figcaption.style.width = `${size.width}px`;

		// Resize until the caption fits.
		if ($figcaption.innerHTML) {
			let captionBottom = $figcaption.offsetTop + $figcaption.clientHeight;
			let { height, width } = size;
			const whRatio = width / height;
			const margin = Robroy.getMargin();
			const maxLightboxHeight = window.innerHeight - margin;
			const minImageHeight = maxLightboxHeight / 2;

			while (captionBottom > maxLightboxHeight && height > minImageHeight) {
				height -= 1;
				width = height * whRatio;
				$img.setAttribute('height', height);
				$img.setAttribute('width', width);
				$figcaption.style.width = `${width}px`;
				captionBottom = $figcaption.offsetTop + $figcaption.clientHeight;
			}

			if (captionBottom > maxLightboxHeight) {
				$figcaption.style.height = `${minImageHeight}px`;
			} else {
				$figcaption.style.height = '';
			}
		}
	},
	getMargin: () => (
		Math.round(window.innerHeight * 0.1)
	),
};

window.robroy = (args) => {
	Robroy.init(args);
};
