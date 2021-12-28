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
import {ValidationRule} from '../validations';

const {validationStyle} = StyleSheet.create({
    validationStyle: {
        //height: 0,
        position: 'absolute',
        //overflow: 'visible',
    }
});

export default class ValidationContainer extends LessPureComponent {
    constructor(props) {
        super(props);
        
        const validations = [], inputs = [], layouts = [];
        let idx = 0;
        const refHandler = (comp, collections, elmIdx) => collections[elmIdx] = comp;

        this._map = child => {
            if (!child) return child;
            let currentIdx, child2 = child;
            
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
                                layouts[currentIdx] = { ...ev.nativeEvent.layout };
                                if (validations[currentIdx]) validations[currentIdx].setLayout(layouts[currentIdx]);
                            },
                            validator: () => validations[currentIdx],
                        },
                    },
                    <Validation key={`validator_${currentIdx}`}
                        ref={comp => {
                            if (comp && layouts[currentIdx]) comp.layout = layouts[currentIdx];
                            refHandler(comp, validations, currentIdx);
                        }}
                        input={() => inputs[currentIdx]}
                        rule={child.props.validation}
                        style={validationStyle}
                    />,
                ];
            }
            return child2;
        };

        this._reset = () => {
            idx = 0;
            inputs.length = 0;
            layouts.length = 0;
            validations.length = 0;
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