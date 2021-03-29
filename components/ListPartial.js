/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {
    FlatList,
    LogBox,
    RefreshControl,
    View,
} from 'react-native';
import PropTypes from 'prop-types';
import Partial from './Partial';
import {scrollView as scrollViewStyle} from '../styles';

export default class ListPartial extends Partial {
    static propTypes = {
        ...super.propTypes,
        refreshable: PropTypes.bool,
    };
    static defaultProps = {
        ...super.defaultProps,
        refreshable: false,
    };

    __data = null;

    constructor(props) {
        super(props);
        this.__data = this.props.data;
    }

    get contentData() {
        return this.__data;
    }

    _render(_, submittingIndicator) {
        const styles = [scrollViewStyle, {flex:0}];
        const contentStyles = [];
        const {List, props:props1={}} = this.getListComponent();
        if (props1.style) styles.push(props1.style);
        if (props1.contentContainerStyle) contentStyles.push(props1.contentContainerStyle);
        const props2 = typeof(this.listProps) == 'object' ? this.listProps : {};
        if (props2.style) styles.push(props2.style);
        if (props2.contentContainerStyle) contentStyles.push(props2.contentContainerStyle);
        const listProps = Object.assign(
            {
                contentInsetAdjustmentBehavior: "automatic",
                refreshControl: this.props.refreshable && <RefreshControl
                    refreshing={this.state.isLoading}
                    onRefresh={() => {
                        this.state.isLoading = true; //when refreshing, it must be <true>, so that after data refreshed, it will be re-rendered
                                                     //not use setState because to avoid double re-render
                        this.refreshData();
                    }}
                />,
            },
            props1,
            props2,
            {
                style: styles,
                contentContainerStyle: contentStyles
            }
        );
        
        return <View {...this.props} style={[{flex:0}].concat(this.props.style)}>
            {submittingIndicator}
            <List {...listProps} />
        </View>;
    }

    getListComponent() {
        return {
            List: FlatList,
            props: {
                contentContainerStyle: {padding:0},
                data: this.data?.results ?? [],
                extraData: this.state.lastPageUrl,
                keyExtractor: (_, idx) => idx+'',
                //scrollEnabled: false,
            },
        };
    }

    clearLocalData() {
        this.__data = null; //force to get fresh data from server when reloading
    }

    componentDidMount() {
        super.componentDidMount();
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']); //We do really need VirtualizedList (FlatList) inside ScrollView
    }

    shouldComponentUpdate(nextProps, nextState) {
        this.__data = nextProps.data;
        return super.shouldComponentUpdate(nextProps, nextState);
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     super.componentDidUpdate(prevProps, prevState, snapshot);
    //     this.__data = this.props.data;
    // }

    render() {
        return null;
    }    
}