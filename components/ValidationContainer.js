/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {StyleSheet} from 'react-native';
import LessPureComponent from './LessPureComponent';
import Validation from './Validation';
import {joinRefHandler, updateSubtreeElements} from '../common';
import {ValidationRule} from '../validations'

const {validationStyle} = StyleSheet.create({
    validationStyle: {
        position: 'absolute',
        height: 0,
    }
});

export default class ValidationContainer extends LessPureComponent {
    constructor(props) {
        super(props);
        
        const validations = [], inputs = [];
        let idx = 0;
        const refHandler = (comp, collections, elmIdx) => collections[elmIdx] = comp;
            
        this._map = child => {
            if (!child) return child;
            let currentIdx, child2 = child, inputLayout = null;
            const setLayout = ({nativeEvent: {layout}}) => {
                validations[currentIdx]?.setLayout(layout);
                inputLayout = layout;
            };
            
            if (child.type === Validation) {
                currentIdx = idx++;
                child2 = {...child,
                    ref: joinRefHandler(
                        comp => refHandler(comp, validations, currentIdx),
                        child.ref
                    )
                };
            }
            else if (child.props?.validation && (
                (child.props.validation instanceof ValidationRule)
                || Array.isArray(child.props.validation) && child.props.validation.find(item => item instanceof ValidationRule)
            )) {
                currentIdx = idx++;
                child2 = [
                    {...child,
                        ref: joinRefHandler(
                            comp => refHandler(comp, inputs, currentIdx),
                            child.ref
                        ),
                        props: {
                            ...child.props,
                            onLayout: ev => {
                                child.props.onLayout && child.props.onLayout(ev);
                                setLayout(ev);
                            },
                            validator: () => validations[currentIdx],
                        },
                    },
                    <Validation key={`validator_${currentIdx}`}
                        ref={comp => refHandler(comp, validations, currentIdx)}
                        input={() => inputs[currentIdx]}
                        layout={inputLayout}
                        rule={child.props.validation}
                        style={validationStyle}
                    />,
                ];
            }
            return child2;
        };

        this._reset = () => {
            validations.length = 0;
            inputs.length = 0;
            idx = 0;
        };

        this.validate = () => {
            let isValid = true;
            for (let idx = validations.length-1; idx >= 0; idx--) {
                isValid &= validations[idx].validate();
            }
            return isValid;
        }

        this.clearValidation = () => {
            for (let v of validations) v?.clearValidation();
        }
    }

    static dontUpdate(element) {
        return element?.type === ValidationContainer;
    }
    
    render() {
        this._reset();
        return <>
            {updateSubtreeElements(this.props.children, this._map, ValidationContainer.dontUpdate)}
        </>;
    }
}