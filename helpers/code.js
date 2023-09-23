import clean from './clean';
import escape from './escape';
import highlightCss from './highlightCss';
import highlightHtml from './highlightHtml';
import highlightJs from './highlightJs';
import highlightSh from './highlightSh';

export default (input, lang = '') => {
	let cleaned = '';
	let code = escape(clean(input));
	if (lang === 'js') {
		code = highlightJs(code);
	} else if (lang === 'css') {
		code = highlightCss(code);
	} else if (lang === 'sh') {
		code = highlightSh(code);
	} else {
		cleaned = input.replace(/<script(.|\n)+<\/script>/g, '').replace(/<link [^>]+>/g, '');
		code = highlightHtml(code);
	}
	return `${cleaned}<code class="code">${code.replace(/\n/g, '<br>')}</code>`;
};
