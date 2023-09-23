export default (html) => {
	let output = html;
	output = output.replace(/(import|from|if|=) /g, '[span code__element]$1[/span] ');
	output = output.replace(/([^( .]+)\(/g, '[span code__attribute]$1[/span](');
	output = output.replace(/('[^']+')/g, '[span code__value]$1[/span]');
	output = output.replace(/ (false|true|\d+(\.\d+)?)/g, ' [span code__etc]$1[/span]');
	output = output.replace(/(^|\n| )(\/\/[^\n]*)/g, '$1[span code__comment]$2[/span]');
	output = output.replace(/(=>|const)/g, ' [span code__etc2]$1[/span]');

	output = output.replace(/\[span (.+?)\]/g, '<span class="$1">');
	output = output.replace(/\[\/span\]/g, '</span>');
	return output;
};
