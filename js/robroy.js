import debounce from './debounce';

const Robroy = {
	activeElement: null,
	args: null,
	lang: null,
	currentIndex: null,
	isInited: false,
	numImages: 0,
	swipeX: null,
	init: (args) => {
		args = args || {};
		args.selector = args.disableKeyPressListener || '[data-robroy]';
		args.bodyClass = args.bodyClass || 'robroy-open';
		args.id = args.id || 'robroy';
		args.disableKeyPressListener = args.disableKeyPressListener || false;
		args.disableMouseOutListener = args.disableMouseOutListener || false;
		args.disableResizeListener = args.disableResizeListener || false;
		args.resizeDebounceMilliseconds = args.resizeDebounceMilliseconds || 100;
		args.minScreenWidth = args.minScreenWidth || 400;
		args.disableImageClickListener = args.disableImageClickListener || true;
		args.imageClickListenerThreshold = args.imageClickListenerThreshold || 0.5;
		args.disableOverlayClickListener = args.disableOverlayClickListener || false;
		args.disableSwipeNav = args.disableSwipeNav || false;
		args.hideCloseButton = args.hideCloseButton || false;
		args.hideFullScreenButton = args.hideFullScreenButton || false;
		args.hideNavButtons = args.hideNavButtons || false;
		args.hideCaption = args.hideCaption || false;
		args.hideOverlay = args.hideOverlay || false;
		args.disableAltCaptions = args.disableAltCaptions || false;
		args.imgLoadIntervalMilliseconds = args.imgLoadIntervalMilliseconds || 250;
		args.animateInClass = args.animateInClass || 'robroy-fade-in';
		args.animateOutClass = args.animateOutClass || 'robroy-fade-out';
		args.enableLoop = args.enableLoop || false;
		args.showNumber = args.showNumber || false;
		Robroy.args = args;

		const lang = args.lang || {};
		lang.closeImage = lang.closeImage || 'Close Image';
		lang.fullScreen = lang.fullScreen || 'Full Screen';
		lang.previousImage = lang.previousImage || 'Previous Image';
		lang.nextImage = lang.nextImage || 'Next Image';
		lang.xOfY = lang.xOfY || '[current] / [total]';
		Robroy.lang = lang;

		// Add thumbnail click listeners.
		const $thumbnails = document.querySelectorAll(args.selector);
		const num = $thumbnails.length;
		let i;
		for (i = 0; i < num; i += 1) {
			if (!$thumbnails[i].getAttribute('data-robroy-index')) {
				$thumbnails[i].addEventListener('click', Robroy.onClickThumbnail);
				$thumbnails[i].setAttribute('data-robroy-index', i);
				Robroy.numImages += 1;
			}
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

		// Add mouseout listener.
		if (!args.disableSwipeNav && !args.disableMouseOutListener) {
			document.addEventListener('mouseout', () => {
				Robroy.onTouchEnd();
			});
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
	getDuration: (elem, attribute) => {
		let duration = getComputedStyle(elem)[attribute];
		if (duration.includes('ms')) {
			duration = parseFloat(duration.replace('ms', ''));
		} else if (duration.includes('s')) {
			duration = parseFloat(duration.replace('s', '')) * 1000;
		}
		return duration;
	},
	getAnimationDuration: (elem) => (Robroy.getDuration(elem, 'animationDuration')),
	getTransitionDuration: (elem) => (Robroy.getDuration(elem, 'transitionDuration')),
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

		const $container = document.createElement('dialog');
		$container.setAttribute('class', `robroy ${Robroy.args.animateInClass}`.trim());
		$container.setAttribute('id', Robroy.args.id);
		document.body.appendChild($container);

		const $track = document.createElement('div');
		$track.setAttribute('class', 'robroy__track');
		$container.appendChild($track);

		Robroy.addItem($track, $thumbnail, 'active');
		Robroy.addItem($track, $thumbnail, 'prev');
		Robroy.addItem($track, $thumbnail, 'next');

		if (!Robroy.args.hideFullScreenButton) {
			const $fullScreenButton = document.createElement('button');
			$fullScreenButton.setAttribute('class', 'robroy__button robroy__button--full-screen');
			$fullScreenButton.setAttribute('title', Robroy.lang.fullScreen);
			$fullScreenButton.setAttribute('type', 'button');
			$fullScreenButton.addEventListener('click', Robroy.fullScreen);
			$fullScreenButton.innerText = Robroy.lang.fullScreen;
			$container.appendChild($fullScreenButton);
		}

		if (!Robroy.args.hideCloseButton) {
			const $closeButton = document.createElement('button');
			$closeButton.setAttribute('class', 'robroy__button robroy__button--close');
			$closeButton.setAttribute('title', Robroy.lang.closeImage);
			$closeButton.setAttribute('type', 'button');
			$closeButton.addEventListener('click', Robroy.close);
			$closeButton.innerText = Robroy.lang.closeImage;
			$container.appendChild($closeButton);
		}

		if (!Robroy.args.hideNavButtons) {
			const $prevButton = document.createElement('button');
			$prevButton.setAttribute('class', 'robroy__button robroy__button--nav robroy__button--prev');
			$prevButton.setAttribute('title', Robroy.lang.previousImage);
			$prevButton.setAttribute('type', 'button');
			$prevButton.addEventListener('click', Robroy.previous);
			$prevButton.innerText = Robroy.lang.previousImage;
			$container.appendChild($prevButton);

			const $nextButton = document.createElement('button');
			$nextButton.setAttribute('class', 'robroy__button robroy__button--nav robroy__button--next');
			$nextButton.setAttribute('title', Robroy.lang.nextImage);
			$nextButton.setAttribute('type', 'button');
			$nextButton.innerText = Robroy.lang.nextImage;
			$nextButton.addEventListener('click', Robroy.next);
			$container.appendChild($nextButton);
		}

		if (Robroy.args.showNumber) {
			const $number = document.createElement('span');
			$number.setAttribute('class', 'robroy__number');
			$container.appendChild($number);
		}

		if (!Robroy.args.hideOverlay) {
			const $overlay = document.createElement('div');
			$overlay.setAttribute('class', 'overlay robroy__overlay');
			if (!Robroy.args.disableOverlayClickListener) {
				$overlay.addEventListener('click', Robroy.close);
			}
			$container.appendChild($overlay);
		}

		Robroy.setActiveImage($thumbnail);

		// Trap focus inside the lightbox.
		$container.showModal();
		$container.focus();

		// Animate in.
		if (Robroy.args.animateInClass) {
			const duration = Robroy.getAnimationDuration($container);
			setTimeout(() => {
				$container.classList.remove(Robroy.args.animateInClass);
			}, duration + 100);
		}
	},
	onTouchStart: (e) => {
		if (e.buttons !== 1) {
			// Don't do anything for right clicks.
			return;
		}

		// Save the initial touch position.
		Robroy.swipeX = e.clientX;
	},
	onTouchMove: (e) => {
		if (Robroy.swipeX === null) {
			return;
		}

		// Move the track.
		const $track = document.querySelector('.robroy__track');
		const x = e.clientX - Robroy.swipeX;
		$track.style.transform = `translate3d(${x}px, 0, 0)`;
		$track.setAttribute('data-robroy-dir', x > 0 ? 'prev' : 'next');
	},
	onTouchEnd: () => {
		if (Robroy.swipeX === null) {
			return;
		}

		// Move the track all the way to the adjacent image.
		const $track = document.querySelector('.robroy__track');
		const transitionDuration = Robroy.getTransitionDuration($track);
		const dir = $track.getAttribute('data-robroy-dir');
		const x = dir === 'prev' ? window.innerWidth : -1 * window.innerWidth;
		$track.style.transform = `translate3d(${x}px, 0, 0)`;

		// Reset swipe settings.
		Robroy.swipeX = null;
		$track.removeAttribute('data-robroy-dir');

		// Actually go to the previous/next image.
		setTimeout(() => {
			$track.style.transition = 'none';
			$track.style.transform = null;
			if (dir === 'prev') {
				Robroy.previous();
			} else {
				Robroy.next();
			}
			setTimeout(() => {
				$track.style.transition = null;
			});
		}, transitionDuration + 100);
	},
	simulateEvent: (e) => {
		const touch = e.changedTouches[0];
		const simulatedEvent = document.createEvent('MouseEvent');
		simulatedEvent.initMouseEvent(
			{
				touchstart: 'mousedown',
				touchmove: 'mousemove',
				touchend: 'mouseup',
				touchcancel: 'mouseup',
			}[e.type],
			true,
			true,
			window,
			1,
			touch.screenX,
			touch.screenY,
			touch.clientX,
			touch.clientY,
			false,
			false,
			false,
			false,
			0,
			null
		);
		return simulatedEvent;
	},
	touchHandler: (e) => {
		const touch = e.changedTouches[0];
		touch.target.dispatchEvent(Robroy.simulateEvent(e));
		e.preventDefault();
	},
	addItem: ($track, $thumbnail, className) => {
		const $container = document.createElement('div');
		$container.setAttribute('class', `robroy__item robroy__item--${className}`);
		if (className === 'prev') {
			$track.prepend($container);
		} else {
			$track.appendChild($container);
		}

		const $figure = document.createElement('figure');
		$figure.setAttribute('class', 'robroy__figure robroy__figure--loading');
		$container.appendChild($figure);

		const $img = document.createElement('img');
		$img.setAttribute('class', 'robroy__img');
		if (!Robroy.args.disableSwipeNav) {
			$img.addEventListener('mousedown', Robroy.onTouchStart, false);
			$img.addEventListener('mousemove', Robroy.onTouchMove, false);
			$img.addEventListener('mouseup', Robroy.onTouchEnd, false);
			$img.addEventListener('touchstart', Robroy.touchHandler, true);
			$img.addEventListener('touchmove', Robroy.touchHandler, true);
			$img.addEventListener('touchend', Robroy.touchHandler, true);
			$img.addEventListener('touchcancel', Robroy.touchHandler, true);
		}
		if (!Robroy.args.disableImageClickListener) {
			$img.addEventListener('click', Robroy.onClickImage);
		}
		$figure.appendChild($img);

		if (!Robroy.args.hideCaption) {
			const $figcaption = document.createElement('figcaption');
			$figcaption.setAttribute('class', 'robroy__caption');
			$figure.appendChild($figcaption);
		}

		Robroy.setImageAttributes($figure, $thumbnail);

		return $figure;
	},
	close: () => {
		if (Robroy.args.bodyClass) {
			document.body.classList.remove('robroy-open');
		}

		// Animate out.
		const $container = document.getElementById(Robroy.args.id);
		if (Robroy.args.animateOutClass) {
			$container.classList.add(Robroy.args.animateOutClass);
			const duration = Robroy.getAnimationDuration($container);
			setTimeout(() => {
				Robroy.onClose($container);
			}, duration + 100);
		} else {
			Robroy.onClose($container);
		}
	},
	onClose: ($container) => {
		// Remove the lightbox.
		$container.remove();

		// Return focus to the previously focused element.
		Robroy.activeElement.focus();
		Robroy.activeElement = null;
	},
	next: () => {
		let i = Robroy.currentIndex + 1;

		// Do not allow going past the last image.
		if (Robroy.currentIndex >= (Robroy.numImages - 1)) {
			if (!Robroy.args.enableLoop) {
				return;
			}

			i = 0;
		}

		const $thumbnail = document.querySelector(`[data-robroy-index="${i}"]`);
		Robroy.setActiveImage($thumbnail);
	},
	previous: () => {
		let i = Robroy.currentIndex - 1;

		// Do not allow going past the first image.
		if (Robroy.currentIndex <= 0) {
			if (!Robroy.args.enableLoop) {
				return;
			}

			i = Robroy.numImages - 1;
		}

		const $thumbnail = document.querySelector(`[data-robroy-index="${i}"]`);
		Robroy.setActiveImage($thumbnail);
	},
	fullScreen: () => {
		if (!document.fullscreenElement) {
			document.body.requestFullscreen();
		} else {
			document.exitFullscreen();
		}
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
	setActiveImage: ($thumbnail) => {
		const index = parseInt($thumbnail.getAttribute('data-robroy-index'), 10);

		// Show loading icon.
		const $container = document.getElementById(Robroy.args.id);
		$container.classList.add('robroy--loading');

		// Save current element index.
		Robroy.currentIndex = index;

		// Show/hide navigation.
		if (!Robroy.args.hideNavButtons && !Robroy.args.enableLoop) {
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

		// Update number.
		if (Robroy.args.showNumber) {
			const $number = $container.querySelector('.robroy__number');
			const i = index + 1;
			$number.innerText = Robroy.lang.xOfY.replace('[current]', i).replace('[total]', Robroy.numImages);
		}

		// Reset track position.
		const $track = document.querySelector('.robroy__track');
		$track.style.transform = null;
		$track.removeAttribute('data-robroy-dir');

		// Set the active image.
		const $figure = document.querySelector('.robroy__item--active .robroy__figure');
		Robroy.setImageAttributes($figure, $thumbnail);

		// Set the previous image.
		const prevIndex = index <= 0 ? Robroy.numImages - 1 : index - 1;
		const $prevThumbnail = document.querySelector(`[data-robroy-index="${prevIndex}"]`);
		if ($prevThumbnail) {
			const $prevFigure = document.querySelector('.robroy__item--prev .robroy__figure');
			Robroy.setImageAttributes($prevFigure, $prevThumbnail);
		}

		// Set the next image.
		const nextIndex = index >= (Robroy.numImages - 1) ? 0 : index + 1;
		const $nextThumbnail = document.querySelector(`[data-robroy-index="${nextIndex}"]`);
		if ($nextThumbnail) {
			const $nextFigure = document.querySelector('.robroy__item--next .robroy__figure');
			Robroy.setImageAttributes($nextFigure, $nextThumbnail);
		}
	},
	setImageAttributes: ($figure, $thumbnail) => {
		// Set image src.
		const $img = $figure.querySelector('.robroy__img');
		let src = $thumbnail.getAttribute('data-robroy-href');
		if (!src) {
			src = $thumbnail.getAttribute('href');
		}
		$img.setAttribute('src', src);

		// Set image dimensions.
		const height = $thumbnail.getAttribute('data-robroy-height');
		const width = $thumbnail.getAttribute('data-robroy-width');
		if (height && width) {
			const size = Robroy.getSize(height, width);
			$img.setAttribute('height', size.height);
			$img.setAttribute('width', size.width);
		}

		// Show/hide caption.
		const $figcaption = $figure.querySelector('.robroy__caption');
		const caption = Robroy.getCaption($thumbnail);
		if (caption) {
			$figcaption.style.display = '';
			$figcaption.innerHTML = caption;
		} else {
			$figcaption.style.display = 'none';
			$figcaption.innerText = '';
		}

		// Wait for the image to load.
		if ($img.complete) {
			Robroy.onImageLoad($figure, $img, $figcaption);
		} else {
			let int = setInterval(() => {
				if ($img.complete) {
					clearInterval(int);
					int = null;
					Robroy.onImageLoad($figure, $img, $figcaption);
				}
			}, Robroy.args.imgLoadIntervalMilliseconds);
		}
	},
	onImageLoad: ($figure, $img, $figcaption) => {
		Robroy.setSize($img, $figcaption);

		// Remove loading icon.
		const $container = document.getElementById(Robroy.args.id);
		$container.classList.remove('robroy--loading');
		$figure.classList.remove('robroy__figure--loading');
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

export default Robroy;
