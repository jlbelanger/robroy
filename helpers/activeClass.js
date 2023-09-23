export default (linkFilename, currentFilename) => {
	if (linkFilename[0] === '/') {
		return ((`/${currentFilename}`).indexOf(linkFilename) > -1) ? ' class="active"' : '';
	}
	return (linkFilename === currentFilename) ? ' class="active"' : '';
};
