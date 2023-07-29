import './scss/robroy.scss';
import Robroy from './js/robroy';

const fn = (args) => {
	Robroy.init(args);
};

window.robroy = fn;

export default fn;
