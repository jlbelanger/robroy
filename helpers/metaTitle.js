export default (title) => (
	title ? `${title.replace(/<[^>]+>/g, '')} | ` : ''
);
