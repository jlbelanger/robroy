import './css/robroy.css';
import Robroy from './js/robroy.js';

const fn = (args) => {
	Robroy.init(args);
};

window.robroy = fn;

export default fn;
