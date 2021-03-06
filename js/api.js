import RobroyModal from './modal';
import RobroySpinner from './spinner';

export default class RobroyApi {
	static request(args) {
		args = args || {};
		args.method = args.method || 'GET';

		RobroySpinner.show();

		var req = new XMLHttpRequest();
		req.onreadystatechange = () => {
			if (req.readyState !== XMLHttpRequest.DONE) {
				return;
			}

			RobroySpinner.hide();

			var response = req.responseText;
			if (!response && (req.status < 200 || req.status > 299)) {
				RobroyModal.show('Error: The sever returned a ' + req.status + ' error.');
				return;
			}
			if (response && !args.noParse) {
				try {
					response = JSON.parse(response);
				} catch (e) {
					RobroyModal.show('Error: The sever returned a non-JSON response.');
					return;
				}

				if (response.errors) {
					var errors = response.errors.map((error) => error.title);
					RobroyModal.show('Error: ' + errors);
					return;
				}
			}

			args.callback(response, req.status);
		};
		req.open(args.method, args.url, true);
		req.send(args.formData);
	}
}
