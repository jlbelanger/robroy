export default (html) => {
	let output = html;
	output = output.replace(/&lt;([^/& ]+)([& ])/g, '&lt;[span code__element]$1[/span]$2');
	output = output.replace(/&lt;\/([^/ ]+)&gt;/g, '&lt;/[span code__element]$1[/span]&gt;');
	output = output.replace(/ ([^ ]+)="/g, ' [span code__attribute]$1=[/span]"');
	output = output.replace(/=\[\/span\]"([^"]+)"/g, '=[/span][span code__value]"$1"[/span]');

	output = output.replace(/\[span (.+?)\]/g, '<span class="$1">');
	output = output.replace(/\[\/span\]/g, '</span>');
	return output;
};
