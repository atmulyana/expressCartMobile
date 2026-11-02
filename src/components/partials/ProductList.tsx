/**
 * https://github.com/atmulyana/expressCartMobile
 */
import {
    Button,
    ComboBox,
    ContentLink,
    Image,
    ListContent,
    Text
} from '@/components';
import {
    useConfig,
    useContentWidth,
    useData,
    useForm,
    useIsLoading,
    useLang,
    useNavHelpers,
    useStyles
} from '@/hooks';
import { setCart } from '@/hooks/cart';
import { currencySymbol, formatAmount } from '@/libs/number-datetime';
import { serverUrl } from '@/libs/server';
import baseStyles from '@/styles';
import type { DataUrl, ProductItem, UrlPath, UrlPathLocal } from '@/types';
import { emptyArray, emptyString } from 'javascript-common';
import React from 'react';
import {
    View,
    VirtualizedList,
    type ImageStyle,
    type ListRenderItem,
    type StyleProp,
    type ViewStyle
} from 'react-native';

const dummyProduct: ProductItem = {
    _id: emptyString,
    productPermalink: emptyString,
    productTitle: "Product Title",
    productPrice: 99,
    variants: [{
        _id: emptyString,
        title: "Variant Name",
        price: 99,
    }],
    productImage: emptyString as UrlPathLocal,
};

const initData = {
    results: [
        dummyProduct,
        dummyProduct,
        dummyProduct,
    ],
};

export default function ProductList() {
    //const ref = React.useRef<VirtualizedList<ProductItem[]>>(null);
    const config = useConfig();
    const cntWidth = useContentWidth();
    const [{results = emptyArray}] = useData<{
        results: ProductItem[],
    }>(initData);
    // const [isRefreshing] = useRefreshing();
    const styles = useStyles();

    const {
        imageStyle,
        itemWidth,
        minWidth,
        numColumns,
    } = React.useMemo(() => {
        let productsPerRow = [2, 1, 2, 3, 4][parseInt(config.productsPerRow as any) || 0] ?? 2;
        //if (productsPerRow > config.productsPerPage) productsPerRow = config.productsPerPage;

        const gap = baseStyles.productRow.gap;
        let minWidth = (baseStyles.productItem.minWidth ?? 0) as number;
        let itemWidth = Math.floor(
            (cntWidth - (productsPerRow - 1) * gap) / productsPerRow
        );
        if (itemWidth < minWidth) itemWidth = minWidth;
        if (itemWidth > cntWidth) {
            minWidth = itemWidth = cntWidth;
        }

        const numColumns = Math.floor( (cntWidth + gap) / (itemWidth + gap) );
        const imageStyle = [baseStyles.productImage, baseStyles.para4, {height: itemWidth}];

        return {
            imageStyle,
            itemWidth,
            minWidth,
            numColumns,
        };
    }, [config.productsPerRow, cntWidth]);

    const {
        itemStyle,
        itemStyleTransparent,
    } = React.useMemo(() => {
        const itemStyle: ViewStyle = {
            ...baseStyles.productItem,
            minWidth,
            width: itemWidth,
        };
        const itemStyleTransparent = [itemStyle, baseStyles.transparent];
        return {
            itemStyle,
            itemStyleTransparent,
        };
    }, [itemWidth, minWidth]);

    const {
        getItem,
        getItemCount,
    } = React.useMemo(() => {
        const lastEmptyCols = results.length % numColumns;
        //Because `numColumns` of `FlatList` cannot be set dynamically, we use `VirtualizedList` and
        //redefine `getItem` and `getItemCount` so that each row has `numColumns` items
        const getItemCount = () => Math.floor(results.length / numColumns) + (lastEmptyCols ? 1 : 0);
        const getItem = (data: ProductItem[], i: number) => {
            let j = i * numColumns;
            let rowData = data.slice(j, j + numColumns);
            //makes the last row has the same column count as the others to fix layout
            while (rowData.length < numColumns) rowData.push(dummyProduct);
            return rowData;
        }

        return {
            getItem,
            getItemCount,
        };
    }, [numColumns, results.length]);

    const {
        ListFooterComponent,
        renderItem,
    } = React.useMemo(() => {
        function ListFooterComponent() {
            // React.useEffect(() => {
            //     ref.current?.scrollToEnd();
            // }, emptyArray); //eslint-disable-line react-hooks/use-memo

            return <>{new Array(numColumns).fill(null, 0, numColumns).map((_, idx) => <Item
                key={idx} 
                data={dummyProduct}
                imageStyle={imageStyle}
                itemStyle={itemStyle}
                itemStyleTransparent={itemStyleTransparent}
            />)}</>;
        }

        const renderItem: ListRenderItem<ProductItem[]> = ({item: row}) => {
            return <View style={baseStyles.productRow}>
                {row.map(
                    (item: ProductItem, idx: number) => <Item
                        key={item._id === emptyString ? idx : (item._id as string)} 
                        data={item}
                        imageStyle={imageStyle}
                        itemStyle={itemStyle}
                        itemStyleTransparent={itemStyleTransparent}
                    />
                )}
            </View>;
        }

        return {
            ListFooterComponent,
            renderItem,
        };
    }, [
        imageStyle, itemStyle,
        itemStyleTransparent, //needs not to be a dep because always follows `itemStyle`
        numColumns  //needs not to be a dep because if it changes then `imageStyle` does too
    ]);

    const lang = useLang();
    const getTitle = React.useCallback((newTitle: string, _: any, url: UrlPath) => {
        const segments = url.split('/');
        let searchTerm = emptyString;
        if (segments[2]) searchTerm = decodeURIComponent(segments[2]);
        if (segments[1] == 'search') {
            return `${lang('Search results')}: ${searchTerm}`;
        }
        else if (segments[1] == 'category') {
            return `${lang('Category')}: ${searchTerm}`;
        }
        return newTitle;
    }, [lang])

    const ProductListComp = ListContent<ProductItem[]>;
    return <ProductListComp
        dataDefault={initData}
        ListEmptyComponent={ListEmpty}
        ListFooterComponent={/*isLoading && !isRefreshing ?*/ ListFooterComponent /*: null*/}
        ListFooterComponentStyle={styles.hidden}
        ListFooterComponentStyleLoading={styles.array('productRow', 'pb8')}
        nextUrlOrData={getNextDataUrl}
        Scroller={VirtualizedList}
        getItem={getItem}
        getItemCount={getItemCount}
        //ref={ref}
        renderItem={renderItem}
        title={getTitle}
    />;
}

const Item = React.memo(function Item({
    data,
    imageStyle,
    itemStyle,
    itemStyleTransparent,
}: {
    data: ProductItem,
    imageStyle: StyleProp<ImageStyle>,
    itemStyle: ViewStyle,
    itemStyleTransparent: StyleProp<ViewStyle>,
}) {
    const config = useConfig();
    const lang = useLang();
    const styles = useStyles();
    const nav = useNavHelpers();
    const isLoading = useIsLoading();
    const [Form, submit] = useForm(async (data) => {
        if (data?.cart) await setCart(data.cart);
    });
    
    const isDummy = data._id === emptyString;
    const productRoute: UrlPathLocal = `/product/${data.productPermalink || data._id}`;
    
    return <Form style={isLoading || !isDummy ? itemStyle : itemStyleTransparent}>
        <ContentLink href={productRoute} disabled={isDummy} style={styles.flexGrow}>
            <Image
                loadingAware={isDummy}
                source={isDummy
                    ? require('@/assets/images/placeholder.png')
                    : {uri: serverUrl(data.productImage)}
                }
                style={imageStyle}
            />
            <Text
                loadingAware={isDummy}
                style={styles.array('productText', 'para4')}
            >{data.productTitle}</Text>
        </ContentLink>
        {data.variants && data.variants.length > 0 ? (
            config.showHomepageVariants ? (
                <ComboBox
                    disabled={isDummy}
                    loadingAware={isDummy}
                    name='productVariant'
                    value={data.variants[0]._id}
                    style={styles.array('txt-disabled', 'para4')}
                >{
                    data.variants.map(variant => (
                        <ComboBox.Item
                            key={variant._id}
                            value={variant._id}
                            label={
                                currencySymbol(config.currencySymbol)
                                + formatAmount(variant.price)
                                + ' (' + variant.title + ')'
                            }
                        />
                    ))
                }</ComboBox>
            ) : (
                <Text
                    loadingAware={isDummy}
                    style={styles.array('productText', 'textInput', 'textInputHeight',
                        'brd-transparent', 'txt-disabled', 'para4')}
                >
                    {currencySymbol(config.currencySymbol)}{formatAmount(data.variants[0].price)}
                </Text>
            )
        ) : (
            <Text
                loadingAware={isDummy}
                style={styles.array('productText', 'textInput', 'textInputHeight',
                    'brd-transparent', 'txt-disabled', 'para4')}
            >
                {currencySymbol(config.currencySymbol)}{formatAmount(data.productPrice)}
            </Text>
        )}
        <Button 
            loadingAware={isDummy}
            disabled={isDummy}
            //style={styles.para4}
            onPress={() => {
                if (!config.showHomepageVariants && data.variants && data.variants.length > 0) {
                    nav.goto(productRoute);
                }
                else {
                    submit({
                        data: {
                            productId: data._id,
                            productQuantity: 1,
                        },
                        message: `${lang('Adding to cart')}...`,
                        url: '/product/addtocart',
                    });
                }
            }}
        >
            {lang('Add to cart')}
        </Button>
    </Form>;
});

const ListEmpty = React.memo(function ListEmpty() {
    const lang = useLang();
    const styles = useStyles();

    return <Text style={styles.productText}>{lang('No products found')}</Text>;
});

function getNextDataUrl(prevUrl?: DataUrl): DataUrl {
    const dataUrl = prevUrl?.trim?.();
    if (!dataUrl) return null;
    if (dataUrl == '/') return '/page/2';
    else {
        const match = /^\/(page|category\/[^/]+|search\/[^/]+)(\/(\d+))?\/?$/.exec(dataUrl);
        if (!match) return null;
        else {
            const page = parseInt(match[3]) || 1;
            return `/${match[1]}/${page + 1}`;
        }
    }
}