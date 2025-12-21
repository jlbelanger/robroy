import clean from './clean.js';
import escape from './escape.js';
import highlightCss from './highlightCss.js';
import highlightHtml from './highlightHtml.js';
import highlightJs from './highlightJs.js';
import highlightSh from './highlightSh.js';

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
