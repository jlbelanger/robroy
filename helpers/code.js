import clean from './clean';
import escape from './escape';
import highlight from './highlight';

export default (html) => (`${html.replace(/<script(.|\n)+<\/script>/g, '')}<pre><code class="code">${highlight(escape(clean(html)))}</code></pre>`);
