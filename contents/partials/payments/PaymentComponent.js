/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import PropTypes from 'prop-types';
import {LessPureComponent} from '../../../components';

export default class PaymentComponent extends LessPureComponent {
    static propTypes = {
        config: PropTypes.object.isRequired,
        paymentConfig: PropTypes.object,
        submitData: PropTypes.func.isRequired,
        pageSubmit: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        const oriRender = this.render.bind(this);
        this.render = function() {
            if (this.props.paymentConfig) return oriRender();
            return null;
        }
    }
}