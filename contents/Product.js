/**
 * expressCartMobile
 * https://github.com/atmulyana/expressCartMobile
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import { View } from 'react-native';
import { SliderBox } from 'react-native-image-slider-box';
import { stripHtml } from "string-strip-html";
import {
    Button,
    ComboBox,
    ContentLink,
    Icon,
    Image,
    imagePlaceholder,
    IntegerSpinner,
    LessPureComponent,
    Modal,
    Notification,
    RatingStars,
    Text,
    TextInput
} from '../components';
import Content from './Content';
import routes from './routes'; 
import {appHelpers, contentWidth, currencySymbol, digitCount, formatAmount, lang, timeAgo, serverUrl} from '../common';
import styles from '../styles';
import {min, required} from '../validations';

class ReviewForm extends LessPureComponent {
    state = {
        title: '',
        description: '',
        rating: 0,
    };
    _modal = null;
    
    show() {
        this._modal?.show();
    }

    hide() {
        this._modal?.hide();
    }

    render() {
        const state = this.state;
        const {productId} = this.props;
        
        return <Modal ref={modal => this._modal = modal} title={lang("Product review")} buttonDone={lang('Add review')}
            style={{height: 270}}
            onSubmit={() => {
                this._modal.submitData('/product/addreview', {
                    product: productId,
                    ...state,
                })
                .catch(err => {
                    if (err.data?.message === 'You need to be logged in to create a review') {
                        this.hide();
                        appHelpers.loadContent(routes.customerLogin);
                    }
                    throw err;
                })
                .valid(data => {
                    this.hide();
                    Notification.success(data.message);
                    appHelpers.refreshContent();
                })
            }}
        >
            <Text>{lang('Title')}:</Text>
            <TextInput placeholder={lang('Love it.')} value={state.title} onChangeText={title => this.setState({title})} 
                fixHeight para4 validation={required} />
            
            <Text>{lang('Description')}:</Text>
            <TextInput placeholder={lang('Product is great. Does everything it said it can do.')} value={state.description}
                onChangeText={description => this.setState({description})} multiline numberOfLines={3} para4 validation={required} />
            
            <Text value={state.rating} validation={min(1)}>{lang('Rating')}:  <Text bold>{state.rating}</Text></Text>
            <RatingStars rating={state.rating} size={16} onRate={rating => this.setState({rating})} />

            <View style={styles.para8} />
        </Modal>;
    }
}

export default class Product extends Content {
    #reviewForm = null;
    
    constructor(props) {
        super(props);
        Object.assign(this.state, {
            comment: '',
            quantity: 1,
            reviewsShow: false,
            variant: null,
        });  
    }

    async onDataReady(silent, data) {
        if (this.data?.variants && this.data.variants.length > 0) this.state.variant = this.data.variants[0];
        else this.state.variant = null;
        return await super.onDataReady(silent, data);
    }

    render() {
        const state = this.state;
        const { config, images, relatedProducts, reviews, result, variants } = this.data;
        
        //Recalculate the image width in the case the screen width is too small
        const imageStyle = {...styles.productInfoImage};
        let imageWidth = contentWidth() - styles.productInfoCol.padding * 2;
        if (imageWidth < imageStyle.width) {
            imageStyle.height = imageStyle.width = imageWidth;
        }
        let colWidth = imageWidth + styles.productInfoCol.padding * 2;
        let relImageWidth = Math.round(imageStyle.width / 5);

        const imageLocations = [];
        for (let i in images) {
            if (images[i].productImage) imageLocations.unshift(serverUrl(images[i].path)); //Make sure the main image to be shown first
            else imageLocations.push(serverUrl(images[i].path));
        }
        //If having no image, set the default image
        if (imageLocations.length < 1) imageLocations.push(imagePlaceholder);
        
        return <>
            <ReviewForm ref={form => this.#reviewForm = form} productId={result._id} />

            <View style={[styles.productRow, styles.productInfoRow]}>
                <View style={[styles.productInfoCol, {width: colWidth}]}>
                    <SliderBox images={imageLocations}
                               parentWidth={imageWidth}
                               ImageComponentStyle={[styles.productImage, imageStyle]}
                               dotColor="#888"
                               inactiveDotColor="#aaa"
                    />
                </View>

                <View style={[styles.productInfoCol, {width: colWidth}]}>
                    <Text para8 bold>{result.productTitle}</Text>
                    
                    {variants && variants.length > 0
                        ? (<>
                            <Text para4 gray>
                                {currencySymbol(config.currencySymbol)}{formatAmount(state.variant.price)}
                            </Text>

                            <Text>{lang('Options')}</Text>
                            <ComboBox
                                items={variants.map(variant => (
                                    {
                                        value: variant,
                                        label: variant.title
                                    }
                                ))}
                                value={state.variant}
                                onValueChange={variant => this.setState({variant})}
                                style={{
                                    viewContainer: styles.para8,
                                    headlessAndroidContainer: styles.para8,
                                }}
                            />
                        </>)
                        : (
                            <Text para8 gray>
                                {currencySymbol(config.currencySymbol)}{formatAmount(result.productPrice)}
                            </Text>
                        )
                    }

                    {(config.trackStock && result.productStock < 1 || null) &&
                        <Text para8 red bold center large>
                            {lang('Out of stock')}
                        </Text>
                    }
                    <Text>{lang('Quantity')}</Text>
                    <IntegerSpinner min={1} max={config.maxQuantity} value={state.quantity} maxLength={digitCount(config.maxQuantity)}
                        style={[styles.para8, styles.textInputHeight]}
                        onValueChange={value => state.quantity = value /* need not to re-render */}
                        onExceedMax={() => Notification.warning(`Exceeds maximum quantity: ${config.maxQuantity}`)}
                    />

                    {(result.productComment || null) && <>
                        <Text>{lang('Leave a comment?')}</Text>
                        <TextInput value={state.comment} onChangeText={comment => this.setState({comment})} para8 multiline numberOfLines={3} />
                    </>}

                    <Button title={lang('Add to cart')} style={[styles.para8, {alignSelf:'stretch'}]}
                        onPress={() => {
                            const submit = () => {
                                this.submitData('/product/addtocart', {
                                    productId: result._id,
                                    productQuantity: state.quantity,
                                    productVariant: state.variant?._id,
                                    productComment: state.comment,
                                })
                                .then(data => {
                                    appHelpers.setCartCount(data.totalCartItems);
                                    Notification.success(data.message);
                                });
                            };

                            if ((state.quantity??0) < 1)
                                this.setState({quantity: 1}, submit);
                            else submit();
                        }}
                    />
                    
                    <Text para8>
                        {stripHtml(result.productDescription).result}
                    </Text>
                    
                    {(config.modules.enabled.reviews || null) && <>
                        <View style={[styles.para8, {flexDirection:'row', flexWrap: 'wrap', justifyContent:'space-between'}]}>
                            <Button title={lang('Add review')}
                                onPress={() => {
                                    this.submitData('/customer/check')
                                    .then(() => this.#reviewForm.show())
                                    .catch(err => {
                                        if (err.status == 400) {
                                            appHelpers.loadContent(routes.customerLogin);
                                        }
                                    })
                                }}
                            />
                            <RatingStars rating={Math.round(reviews.average)} size={16} />
                            {reviews.reviews.length > 0 && <View style={{flexDirection:'row'}}>
                                <Icon icon={state.reviewsShow ? "ChevronsUp" : "ChevronsDown"}
                                      width={styles.text.fontSize}
                                      height={styles.text.fontSize}
                                />
                                <Text link style={{flex:-1}}
                                    onPress={() => this.setState(state => ({reviewsShow: !state.reviewsShow}))}
                                >
                                    {lang("Recent reviews")}
                                </Text>
                            </View>}
                        </View>
                        <View style={{display: state.reviewsShow ? 'flex' : 'none'}}>
                            {reviews.reviews.map((item, idx) => <View key={idx} style={[styles.para8, styles.review]}>
                                <Text para4 style={styles.reviewTime}>{timeAgo(item.date)}</Text>
                                <Text para4>
                                    <Text bold>{lang("Rating")}: </Text>
                                    {item.rating}
                                </Text>
                                <Text para4>
                                    <Text bold>{lang("Title")}: </Text>
                                    {item.title}
                                </Text>
                                <Text para4>
                                    <Text bold>{lang("Description")}: </Text>
                                    {item.description}
                                </Text>
                            </View>)}
                        </View>
                    </>}
                    
                </View>
            </View>

            {config.showRelatedProducts && relatedProducts && relatedProducts.length > 0 &&
            <View style={[styles.productRow, styles.productInfoRow, styles.productRelatedRow]}>
                <Text para8 bold style={{width:'100%'}}>{lang("Related products")}</Text>
                {relatedProducts.map((item, idx) => 
                    <ContentLink key={idx}
                                 route={routes.productInfo(item.productPermalink || item._id)}
                                 style={[styles.para8, styles.productRelatedImageContainer, {width: relImageWidth}]}
                    >
                        <Image uri={item.productImage} style={[styles.para4, styles.productImage, {height: relImageWidth}]} />
                        <Text para4 style={styles.productText}>{item.productTitle}</Text>
                        <Text style={[styles.productText, styles.textGray]}>
                            {currencySymbol(config.currencySymbol)}{formatAmount(item.productPrice)}
                        </Text>
                    </ContentLink>
                )}
            </View>
            }
        </>;
    }
}