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
        paymentConfig: PropTypes.object.isRequired,
        submitData: PropTypes.func.isRequired,
        pageSubmit: PropTypes.func.isRequired,
    };
}