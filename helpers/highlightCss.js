export default (html) => {
	let output = html;
	output = output.replace(/^(@[^ ]+)/, '[span code__element]$1[/span]');
	output = output.replace(/('[^']+')/, '[span code__value]$1[/span]');

	output = output.replace(/\[span (.+?)\]/g, '<span class="$1">');
	output = output.replace(/\[\/span\]/g, '</span>');
	return output;
};
