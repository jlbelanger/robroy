export default (html) => {
	html = html.replace(/\t/g, '    ');
	html = html.replace(/https:.+-\d+x\d+\.jpg/ig, 'thumbnail.jpg');
	html = html.replace(/https:.+\.jpg/ig, 'image.jpg');
	return html;
};
