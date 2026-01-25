// eslint-disable-next-line @stylistic/no-extra-parens
export default (title) => (title ? `${title.replace(/<[^>]+>/g, '')} | ` : '');
