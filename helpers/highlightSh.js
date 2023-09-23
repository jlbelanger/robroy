export default (html) => {
	let output = html;
	output = output.replace(/^([^ ]+)/, '[span code__attribute]$1[/span]');
	output = output.replace(/(--[^ ]+)/, '[span code__etc]$1[/span]');

	output = output.replace(/\[span (.+?)\]/g, '<span class="$1">');
	output = output.replace(/\[\/span\]/g, '</span>');
	return `<span class="code__value">${output}</span>`;
};
