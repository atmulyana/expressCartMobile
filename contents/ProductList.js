/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {
    Text,
    View,
    VirtualizedList,
} from 'react-native';
import {Button, ComboBox, ContentLink, Image, Notification} from '../components';
import ListContent from './ListContent';
import routes from './routes';
import {appHelpers, contentWidth, currencySymbol, formatAmount, lang} from '../common';
import styles from '../styles';

const ProductItem = ({data, config, itemStyle, submit}) => {
    const [variant, _setVariant] = React.useState(config.showHomepageVariants && data.variants ? data.variants[0] : undefined);
    const setVariant = React.useCallback(variant => _setVariant(variant), []);
    const productRoute = routes.productInfo(data.productPermalink || data._id);
    return (
        <View style={itemStyle}>
            <ContentLink route={productRoute}>
                <Image uri={data.productImage} style={[styles.para4, styles.productImage, {height:itemStyle.width}]} />
                <Text style={[styles.para4, styles.productText]}>{data.productTitle}</Text>
            </ContentLink>
            {data.variants && data.variants.length > 0
                ? config.showHomepageVariants 
                    
                    ? <ComboBox
                        items={data.variants.map(variant => (
                            {
                                value: variant,
                                label: currencySymbol(config.currencySymbol) + formatAmount(variant.price) + ' (' + variant.title + ')'
                            }
                        ))}
                        value={variant}
                        onValueChange={setVariant}
                        style={[styles.textGray, styles.para4]}
                      />
                    
                    : <Text style={[styles.para4, styles.productText, styles.textGray]}>
                        {currencySymbol(config.currencySymbol)}{formatAmount(data.variants[0].price)}
                      </Text>
                
                : <Text style={[styles.para4, styles.productText, styles.textGray]}>
                    {currencySymbol(config.currencySymbol)}{formatAmount(data.productPrice)}
                  </Text>
            }
            <Button title={lang('Add to cart')} style={[styles.para4]}
                onPress={() => {
                    if (!config.showHomepageVariants && data.variants && data.variants.length > 0) {
                        appHelpers.loadContent(productRoute);
                    }
                    else {
                        submit('/product/addtocart', {
                            productId: data._id,
                            productQuantity: 1,
                            productVariant: variant?._id,
                        }).then(data => {
                            appHelpers.setCartCount(data.totalCartItems);
                            Notification.success(data.message);
                        });
                    }
                }}
            />
        </View>
    );
};

export default class ProductList extends ListContent {
    static defaultParams = {
        url: routes.home.url,
    };

    getScroller() {
        let elm = super.getScroller();
        elm.Scroller = VirtualizedList;
        (elm.props = elm.props ?? {}).getItemCount = () => 0;
        return elm;
    }

    getNextDataUrl() {
        const dataUrl = this.state?.lastPageUrl,
              defUrl = '/page/2';
        let nextUrl;
        if (!dataUrl || dataUrl == '/') nextUrl = defUrl;
        else {
            const match = /^\/(page|category\/[^/]+|search\/[^/]+)(\/(\d+))?\/?$/.exec(dataUrl);
            if (!match) nextUrl = defUrl;
            else {
                const page = parseInt(match[3]) || 1;
                nextUrl = `/${match[1]}/${page+1}`;
            }
        }
        return nextUrl;
    }

    render() {
        const {config, results} = this.data;
        
        //Calculate the box width of product item based on the config
        const cntWidth = contentWidth();
        let itemStyle = Object.assign({}, styles.productItem);
        let productsPerRow = [2, 1, 2, 3, 4][parseInt(config.productsPerRow) || 0] ?? 2;
        //if (productsPerRow > config.productsPerPage) productsPerRow = config.productsPerPage;
        let width = Math.floor(
            (cntWidth - (productsPerRow - 1) * itemStyle.margin) / productsPerRow
        );
        itemStyle.width = (width < itemStyle.minWidth) ? itemStyle.minWidth : width;
        if (itemStyle.width > cntWidth) {
            itemStyle.minWidth = itemStyle.width = cntWidth;
        }

        const numColumns = Math.floor(cntWidth / itemStyle.width);
        //Because numColumns of FlatList cannot be set dynamically, we use VirtualizedList and redefine getItem and getItemCount
        //so that each row has numColumns items
        const getItemCount = () => Math.floor(results.length / numColumns) + ((results.length % numColumns) ? 1 : 0);
        const getItem = (data, i) => {
            let j = i * numColumns;
            let rowData = data.slice(j, j + numColumns);
            while (rowData.length < numColumns) rowData.push(null); //makes the last row has the same column count as the others to fix layout
            return rowData;
        }

        this.scrollerProps = {
           //numColumns,
            getItemCount,
            getItem,
            renderItem: ({item:row}) => {
                return <View style={styles.productRow}>
                    {row.map((item, idx) => item != null
                        ? <ProductItem {...{key:item._id, data:item, config, itemStyle, submit: this.submitData}} />
                        : <View key={idx} style={[itemStyle, {backgroundColor:'transparent'}]} />
                    )}
                </View>;
            },
            ListEmptyComponent: <Text style={styles.productText}>{lang('No products found')}</Text>,
        };

        return super.render();
    }
}