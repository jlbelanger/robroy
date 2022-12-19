# Robroy Lightbox

## Features

- The basics
	- Previous, next, and close buttons
	- Captions
	- Loading icon
- No dependencies
	- Vanilla JS (no jQuery required)
	- No images, icons, or fonts required
- Accessibility
	- Responsive and mobile-friendly
		- Large images shrink to fit on the screen
	- Works on Chrome, Firefox, and Safari
	- Screenreader friendly
	- Keyboard accessible
		- Left/right arrows show the previous or next image
		- Escape key closes the lightbox and returns focus to previously activated element
	- Sensible fallback behaviour when JS is disabled
	- Command/Ctrl clicking the thumbnail opens the image in a new tab rather than opening the lightbox
- Extras
	- Clicking on the left side of the image shows the previous image; clicking on the right side of the image shows the next image
	- Clicking outside of the lightbox closes the lightbox
	- Disables body scrolling when lightbox is open

## Configuration

### JS

JS configuration options are defined in [`src/js/robroy.js`](https://github.com/jlbelanger/robroy/blob/main/src/js/robroy.js). To override these settings, pass them to `robroy({})` in your JS code.

### SCSS

SCSS configuration options are defined in [`src/scss/_variables.scss`](https://github.com/jlbelanger/robroy/blob/main/scss/_variables.scss). To override these settings, re-define the variables in your SCSS file.

## Development

### Requirements

- [Git](https://git-scm.com/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)

### Setup

``` bash
# Clone the repo
git clone https://github.com/jlbelanger/robroy.git
cd robroy

# Install dependencies
yarn install
```

### Run

In the `robroy` folder, run:

``` bash
yarn watch
```

### Lint

In the `robroy` folder, run:

``` bash
yarn lint
```

### Package

In the `robroy` folder, run:

``` bash
yarn build
```

## Credits

- Debounce: https://davidwalsh.name/javascript-debounce-function
