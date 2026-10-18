/**
 * https://github.com/atmulyana/expressCartMobile
 */
import {
    Button,
    ComboBox,
    Content,
    ContentLink,
    Icon,
    Image,
    ImageSlider,
    IntegerSpinner,
    Modal,
    Notification,
    ProcessIndicator,
    RatingStars,
    RenderHtml,
    Text,
    TextInput
} from '@/components';
import {
    useColors,
    useConfig,
    useContentWidth,
    useData,
    useEffectEvent,
    useForm,
    useLang,
    useNavHelpers,
    useRefCallback,
    useStyles
} from '@/hooks';
import { setCart } from '@/hooks/cart';
import {
    currencySymbol,
    digitCount,
    formatAmount,
    timeAgo
} from '@/libs/number-datetime';
import { serverUrl } from '@/libs/server';
import baseStyles, { arrayStyle, contentPadding, fontBase } from '@/styles';
import type {
    Product,
    ProductImagePath,
    ProductItem,
    SubmitFunction,
    UrlPathLocal,
    Variant
} from '@/types';
import { Duration } from '@/types';
import { Validation } from '@react-input-validator/native';
import { min, required } from '@react-input-validator/rules';
import { emptyArray, emptyObject, emptyString, isPlainObject } from 'javascript-common';
import React from 'react';
import {
    type ImageStyle,
    type StyleProp,
    StyleSheet,
    type TextStyle,
    View
} from 'react-native';

type Review = {
    title: string,
    description: string,
    rating: number,
    customer?: string,
    date: Date,
    timeAgo?: string,
}

type Data = {
    images: ProductImagePath[],
    relatedProducts: ProductItem[],
    result: Product,
    reviews?: {
        reviews: Review[],
        isNext?: boolean,
        page?: number,
        highestRating: number,
        average: number,
        count: number,
        featured: {
            review: Review,
            customer: {
                _id: string,
                email: string,
                company: string,
                firstName: string,
                lastName: string,
                address1: string,
                address2: string,
                country: string,
                state: string,
                postcode: string,
                phone: string,
            } | null,
        }
    },
    variants?: Variant[],
};

type ReviewsData = {
    isNext?: boolean,
    page?: number,
    rating?: number,
    reviews?: Review[],
};

const dummyRelatedProduct: ProductItem = {
    _id: emptyString,
    productImage: emptyString as UrlPathLocal,
    productPermalink: emptyString,
    productTitle: "Product Title",
    productPrice: 999,
};

const initData: Data = {
    images: emptyArray,
    relatedProducts: [
        dummyRelatedProduct,
        dummyRelatedProduct,
        dummyRelatedProduct,
    ],
    result: {
        _id: emptyString,
        imageCount: 1,
        productAddedDate: new Date(),
        productDescription: `Product description says everything about this product. Some features
of this product that may be important to explain.
<ul>
    <li>First feature</li>
    <li>Second feature</li>
    <li>Third feature</li>
</ul>`,
        productPermalink: emptyString,
        productPrice: 999,
        productPublished: true,
        productStock: 100,
        productTitle: dummyRelatedProduct.productTitle,
    },
    variants: [{
        _id: emptyString,
        title: "Variant Name",
        price: 999,
    }],
};

const prodStyles = StyleSheet.create({
    col: {
        flex: 0,
        //padding: contentPadding,
    },
    image: {
        flex: 0,
        height: 400,
        width: 400,
    },
    relatedRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: contentPadding,
        justifyContent: 'flex-start',
        marginTop: contentPadding,
    },
    relatedTitle: {
        ...baseStyles.textBold,
        ...baseStyles.para8,
        width: '100%',
    },
    relatedImageContainer: {
        alignItems: 'center',
        flex: 0,
        minHeight: 80,
        minWidth: 80,
    },
    review: {
        //borderColor: gray,
        borderStyle: 'solid',
        borderWidth: 1,
        padding: contentPadding,
    },
    reviewButtons: {
        ...baseStyles.para8,
        flexDirection:'row',
        flexWrap: 'wrap',
        justifyContent:'space-between',
    },
    reviewTime: {
        //color: gray,
        fontSize: 11,
        textAlign: 'right',
    },
    row: {
        ...baseStyles.productRow,
        flexWrap: 'wrap',
    },
});

export default function ProductInfo() {
    const config = useConfig();
    const cntWidth = useContentWidth();
    const [{images, relatedProducts, reviews, result, variants}] = useData(initData);
    const [Form, submit]= useForm(async (data) => {
        if (data?.cart) await setCart(data.cart);
    });
    const lang = useLang();
    const styles = useStyles();

    const [variant, setVariant] = React.useState(variants?.[0]);
    const isDummy = result._id === emptyString;

    const maxLength = React.useMemo(() => digitCount(config.maxQuantity), [config.maxQuantity]);

    const {
        colStyle,
        imageStyle,
        isSingleColumn,
        relImageStyle,
        relLinkStyle,
    } = React.useMemo(() => {
        const imageStyle: ImageStyle = {
            ...baseStyles.productImage,
            ...prodStyles.image,
        };
        let imageWidth = cntWidth; //- prodStyles.col.padding * 2;
        if (imageWidth < (imageStyle.width as number)) {
            imageStyle.height = imageStyle.width = imageWidth;
        }
        else {
            imageWidth = imageStyle.width as number;
        }
        let colWidth = (cntWidth - baseStyles.productRow.gap) / 2;
        if (colWidth < imageWidth /*+ prodStyles.col.padding * 2*/) {
            colWidth = cntWidth;
            imageStyle.alignSelf = 'center';
        }

        const relImageWidth = Math.round(imageWidth / 5);
        
        return {
            colStyle: [prodStyles.col, {width: colWidth}],
            imageStyle,
            isSingleColumn: colWidth * 2 > cntWidth - baseStyles.productRow.gap,
            relImageStyle: [baseStyles.productImage, baseStyles.para4, {height: relImageWidth}],
            relLinkStyle: [prodStyles.relatedImageContainer, baseStyles.para8, {width: relImageWidth}],
        };
    }, [cntWidth]);

    const imageLocations = React.useMemo(() => {
        if (isDummy) return [require('@/assets/images/placeholder.png')];

        const imageLocations = [];
        for (let i in images) {
            if (images[i].productImage) imageLocations.unshift(images[i].path); //Make sure the main image to be shown first
            else imageLocations.push(images[i].path);
        }
        return imageLocations;
    }, [isDummy, images]);

    React.useEffect(() => {
        setVariant(variants?.[0]);
    }, [variants]);

    return <Content title={isDummy ? emptyString : result.productTitle}>
        <View style={prodStyles.row}>
            <View style={colStyle}>
                <ImageSlider
                    //loadingAware={isDummy}
                    srcSet={imageLocations}
                    style={imageStyle}
                />
                {!isSingleColumn && <RelatedProducts
                    imageStyle={relImageStyle}
                    isDummy={isDummy}
                    linkStyle={relLinkStyle}
                    products={relatedProducts}
                />}
            </View>

            <View style={colStyle}>
                <Text
                    loadingAware={isDummy}
                    style={isSingleColumn
                        ? styles.array('textBold', 'textCenter', 'center', 'para8')
                        : styles.array('textBold', 'start', 'para8')
                    }
                >{result.productTitle}</Text>
                
                <Form style={styles.para8}>
                    {variants && variants.length > 0
                        ? (<>
                            <Text
                                loadingAware={isDummy}
                                style={isSingleColumn
                                    ? styles.array('txt-disabled', 'textCenter', 'center', 'para8')
                                    : styles.array('txt-disabled', 'start', 'para8')
                                }
                            >
                                {
                                    currencySymbol(config.currencySymbol)
                                }{
                                    formatAmount(variant?.price ?? 0)
                                }
                            </Text>

                            <Text>{lang('Options')}</Text>
                            <ComboBox
                                loadingAware={isDummy}
                                onValueChange={variant => setVariant(variant)}
                                style={styles.para8}
                                value={variant}
                            >{
                                variants.map(variant => (
                                    <ComboBox.Item
                                        key={variant._id}
                                        value={variant}
                                        label={variant.title}
                                    />
                                ))
                            }</ComboBox>
                        </>)
                        : (
                            <Text
                                loadingAware={isDummy}
                                style={isSingleColumn
                                    ? styles.array('txt-disabled', 'textCenter', 'center', 'para8')
                                    : styles.array('txt-disabled', 'start', 'para8')
                                }
                            >
                                {
                                    currencySymbol(config.currencySymbol)
                                }{
                                    formatAmount(result.productPrice)
                                }
                            </Text>
                        )
                    }

                    {config.trackStock && (result.productStock ?? 0) < 1 &&
                        <Text
                            loadingAware={isDummy}
                            style={styles.array('txt-danger', 'textBold', 'textCenter',
                                'center', 'para8')}
                        >
                            {lang('Out of stock')}
                        </Text>
                    }
                    <Text>{lang('Quantity')}</Text>
                    <IntegerSpinner
                        loadingAware={isDummy}
                        max={config.maxQuantity}
                        maxLength={maxLength}
                        min={1}
                        name='productQuantity'
                        onExceedMax={() => {
                            Notification.warning(`Exceeds maximum quantity: ${config.maxQuantity}`);
                        }}
                        style={styles.array('textInputHeight', 'para8')}
                        value={1}
                    />

                    {result.productComment && <>
                        <Text>{lang('Leave a comment?')}</Text>
                        <TextInput
                            loadingAware={isDummy}
                            name='productComment'
                            multiline
                            numberOfLines={3}
                            style={styles.para8}
                        />
                    </>}

                    <Button
                        onPress={() => {
                            submit({
                                data: {
                                    productId: result._id,
                                    productVariant: variant?._id,
                                },
                                message: `${lang('Adding to cart')}...`,
                                url: '/product/addtocart',
                            });
                        }}
                        loadingAware={isDummy}
                        style={styles.array('textCenter', 'stretch')}
                    >{lang('Add to cart')}</Button>
                </Form>
                
                <View style={styles.para8}>
                    <RenderHtml
                        html={result.productDescription}
                        loadingAware={isDummy}
                    />
                </View>
                
                {(config.modules.enabled.reviews || null) && <ReviewsContainer
                    isNext={reviews?.isNext}
                    productId={result._id}
                    rating={reviews?.average}
                    reviews={reviews?.reviews}
                />}
                
                {isSingleColumn && <RelatedProducts
                    imageStyle={relImageStyle}
                    isDummy={isDummy}
                    linkStyle={relLinkStyle}
                    products={relatedProducts}
                />}
            </View>
        </View>
    </Content>;
}

const RelatedProducts = React.memo(function RelatedProducts({
    imageStyle,
    isDummy,
    linkStyle,
    products,
}: {
    imageStyle: StyleProp<ImageStyle>,
    linkStyle: StyleProp<TextStyle>,
    isDummy: boolean,
    products: ProductItem[],
}) {
    const config = useConfig();
    const lang = useLang();
    const styles = useStyles();

    if (products.length < 1) return null;
    return <View style={prodStyles.relatedRow}>
        <Text style={prodStyles.relatedTitle}>{lang("Related products")}</Text>
        {products.map((item, idx) => 
            <ContentLink key={idx}
                disabled={isDummy}
                href={`/product/${item.productPermalink || item._id}`}
                style={linkStyle}
            >
                <Image
                    source={isDummy
                        ? require('@/assets/images/placeholder.png')
                        : {uri: serverUrl(item.productImage)}
                    }
                    style={imageStyle}
                />
                <Text loadingAware={isDummy} style={styles.array('productText', 'para4')}>
                    {item.productTitle}
                </Text>
                <Text loadingAware={isDummy} style={styles.array('productText', 'txt-disabled')}>
                    {currencySymbol(config.currencySymbol)}{formatAmount(item.productPrice)}
                </Text>
            </ContentLink>
        )}
    </View>;
});

const ReviewsContainer = React.memo(function ReviewsContainer({
    isNext,
    productId,
    rating = 0,
    reviews,
}: {
    isNext?: boolean,
    productId: string,
    rating?: number,
    reviews?: Review[],
}) {
    const [data, setData] = React.useState<ReviewsData>(emptyObject);
    const updateData = useRefCallback((newData: typeof data) => {
        if ((newData?.reviews?.length ?? 0) > 0)
            setData(oldData => ({...oldData, ...newData}));
        else
            setData(emptyObject);
    });

    const [Form, submit, isSubmitting] = useForm(({data}) => updateData(data));
    const lang = useLang();
    const nav = useNavHelpers();
    const [reviewsShow, setReviewsShow] = React.useState(false);
    const [reviewFormFlag, toggleReviewForm] = React.useState(false);
    const isDummy = productId === emptyString;

    const changeData = useEffectEvent(
        (reviews?: Review[]) => {
        updateData({
            isNext,
            reviews,
            page: 1,
            rating,
        });
    });
    React.useEffect(() => {
        changeData(reviews);
    }, [reviews]);

    return <>
        <ReviewForm productId={productId} updateReviews={updateData} toggled={reviewFormFlag} />
        <Form fragment>
            <View style={prodStyles.reviewButtons}>
                <Button
                    disabled={isSubmitting}
                    loadingAware={isDummy}
                    onPress={() => {
                        submit({
                            url: '/customer/check',
                            onError: (err) => {
                                if (!err.handled && (err.status == 400 || err.status == 401))
                                    nav.goto('/customer/login');
                            },
                            onSubmitted: () => {
                                toggleReviewForm(flag => !flag);
                                return false;
                            },
                        });
                    }}
                >{lang('Add review')}</Button>
                <ProcessIndicator loadingAware={!isDummy}>
                    <RatingStars rating={data.rating ?? 0} size={16} />
                </ProcessIndicator>
                {(data.reviews?.length ?? 0) > 0 && <View style={baseStyles.flexRow}>
                    <Icon
                        name={reviewsShow ? "chevrons-up" : "chevrons-down"}
                        size={fontBase.fontSize}
                    />
                    <Text
                        onPress={() => !isDummy && setReviewsShow(r => !r)}
                        style={baseStyles.textLink}
                    >
                        {lang("Recent reviews")}
                    </Text>
                </View>}
            </View>
            <View style={reviewsShow && !isDummy ? null : baseStyles.hidden}>
                <Reviews
                    isNext={data.isNext}
                    isSubmitting={isSubmitting}
                    page={data.page}
                    productId={productId}
                    reviews={data.reviews}
                    submit={submit}
                />
            </View>
        </Form>
    </>;
});

const Reviews = React.memo(function Reviews({
    isNext = false,
    isSubmitting,
    page = 1,
    productId,
    reviews = emptyArray,
    submit,
}: {
    isNext?: boolean,
    isSubmitting: boolean,
    page?: number,
    productId: string,
    reviews?: Review[],
    submit: SubmitFunction,
}) {
    const colors = useColors();
    const lang = useLang();
    const styles = useStyles();
    const styles2 = React.useMemo(() => {
        return {
            review: [prodStyles.review, baseStyles.para8, {borderColor: colors.border}],
            reviewTime: [prodStyles.reviewTime, baseStyles.para4, {color: colors.disabled}],
        }
    }, [colors]);

    return <>
        {reviews.map((item, idx) => <View key={idx} style={styles2.review}>
            <Text style={styles2.reviewTime}>{timeAgo(item.date)}</Text>
            <Text style={baseStyles.para4}>
                <Text style={baseStyles.textBold}>{lang("Rating")}: </Text>
                {item.rating}
            </Text>
            <Text style={baseStyles.para4}>
                <Text style={baseStyles.textBold}>{lang("Title")}: </Text>
                {item.title}
            </Text>
            <Text style={baseStyles.para4}>
                <Text  style={baseStyles.textBold}>{lang("Description")}: </Text>
                {item.description}
            </Text>
        </View>)}
        {(isNext || page > 1) && <View style={baseStyles.pagingButtons}>
            <Button
                disabled={page < 2 || isSubmitting}
                style={styles.get('btn-outline-neutral')}
                onPress={() => submit({
                    url: `/product/${productId}/reviews/${page - 1}`,
                    data: null,
                })}
            >
                <Icon name="chevrons-left" color={colors.neutral} />
            </Button>
            <Button
                disabled={!isNext || isSubmitting}
                style={styles.get('btn-outline-neutral')}
                onPress={() => submit({
                    url: `/product/${productId}/reviews/${page + 1}`,
                    data: null,
                })}
            >
                <Icon name="chevrons-right" color={colors.neutral} />
            </Button>
        </View>}
    </>;
});

const ReviewForm = React.memo(function ReviewForm({
    productId,
    updateReviews,
    toggled,
}: {
    productId: string,
    updateReviews: (data: ReviewsData) => void,
    toggled: boolean,
}) {
    const lang = useLang();
    const nav = useNavHelpers();
    const [rating, setRating] = React.useState(0);
    const onRate = useRefCallback((rating: number) => setRating(rating));

    return <Modal
        buttonDone={lang('Add review')}
        onSubmit={(modalSubmit, hide) => {
            modalSubmit({
                url: '/product/addreview',
                data: {
                    product: productId,
                    rating,
                },
                message: `${lang('Saving review')}...`,
                onError: err => {
                    if (err.data?.message === 'You need to be logged in to create a review') {
                        hide();
                        nav.goto('/customer/login');
                    }
                },
                onSubmitted: ({data}) => {
                    setTimeout(() => {
                        hide();
                        if (
                            isPlainObject(data)
                            && Array.isArray(data?.reviews)
                            && typeof(data?.average) == 'number'
                        )
                            updateReviews({
                                isNext: data?.isNext,
                                page: 1,
                                rating: data?.average,
                                reviews: data?.reviews,
                            });
                        else
                           nav.refresh();
                    }, Duration.short);
                },
            });
        }}
        title={lang("Product review")}
        toggled={toggled}
    >
        <Text>{lang('Title')}:</Text>
        <TextInput
            name='title'
            placeholder={lang('Love it.')}
            rules={required}
            style={arrayStyle('textInputHeight', 'para4')}
        />
        
        <Text>{lang('Description')}:</Text>
        <TextInput
            multiline
            name='description'
            numberOfLines={3}
            placeholder={lang('Product is great. Does everything it said it can do.')}
            rules={required}
            style={baseStyles.para4}
        />
        
        <Text>{lang('Rating')}:  <Text style={baseStyles.textBold}>{rating}</Text></Text>
        <Validation rules={min(1)} name='rating' value={rating} />
        <RatingStars onRate={onRate} rating={rating} size={16} showNumber={false} />

        <View style={baseStyles.para8} />
    </Modal>;
});
        