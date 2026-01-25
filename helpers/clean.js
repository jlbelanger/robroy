export default (html) => {
	html = html.replace(/\t/g, '&nbsp; &nbsp; ');
	html = html.replace(/https:.+-\d+x\d+\.jpg/gi, 'thumbnail.jpg');
	html = html.replace(/https:.+\.jpg/gi, 'image.jpg');
	return html;
};
