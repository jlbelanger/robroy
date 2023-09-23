export default (html) => {
	html = html.replace(/\t/g, '&nbsp; &nbsp; ');
	html = html.replace(/https:.+-\d+x\d+\.jpg/ig, 'thumbnail.jpg');
	html = html.replace(/https:.+\.jpg/ig, 'image.jpg');
	return html;
};
