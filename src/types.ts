/**
 * https://github.com/atmulyana/expressCartMobile
 */
import type { InputRef, Rules, ValidationOption } from "@react-input-validator/native";
import type { ExternalPathString, Href, HrefObject, RelativePathString } from "expo-router";

export type Config = {
    currencySymbol: string,
    productsPerRow: 1 | 2 | 3 | 4,
    productsPerPage: number,
    maxQuantity: number,
    trackStock: boolean,
    showRelatedProducts: boolean,
    showHomepageVariants: boolean,
    paymentGateway: string[],
    cartTitle: string,
    modules: {
        enabled: { 
            discount?: string,
            reviews?: string,
            shipping?: string,
        },
        loaded: {
            discount?: string,
            reviews?: string,
            shipping?: string,
        },
    },
};

export type DataReadyCallback = (
    data: any,
    newResponseUrl?: UrlPathLocal | false
) => /*Promise<any> |*/ any;

export type DataUrl = UrlPath | undefined | null;

export enum Duration {
    long = 3500,
    short = 2000,
}

export type GetNextDataUrl = (prevUrl?: DataUrl) => DataUrl;
export type HookListener = () => void;

export type HttpError = {
    data?: any,
    handled: boolean,
    status: number,
    valid?: boolean,
};
export type HttpReject = (reason: HttpError) => void;
export type HttpUrl = `http://${string}` | `https://${string}`;

export type InputChangeValue<T> = (
    val?: T | InputValueReducer<T>,
    ...args: any[]
) => void;
export type InputChangeValueCallback<T> = (
    val: T,
    ...args: any[]
) => void | {newValue: T};
export type InputProps<Instance = unknown, Value = any> = {
    name?: string | true,
    onValueChange?: InputChangeValue<Value>,
    ref?: React.Ref<InputValueRef<Value> & Omit<Instance, keyof InputValueRef<Value>>>,
    value?: Value,
};
export type InputValidationProps<Props, Instance = unknown, TValue = any> = Omit<InputProps<Instance, TValue>, 'ref'>
    & ValidationProps<Props, Instance, TValue>;
export type InputValueReducer<T> =  (oldVal?: T) => T;
export type InputValueRef<Value> = {
    value?: Value,
    setValue: InputChangeValue<Value>,
};

export type LinkHref = RelativePathString | UrlPathLocal;

export type MenuItem = {
    title: string,
    link: LinkHref,
    order: number,
};

export type MergeData<T> = (newData: T, oldData: any) => Promise<[any, boolean]> | [any, boolean];
export type NotFunc<T> = Exclude<T, Function>;

export type Order = {
    _id: string,
    orderPaymentId?: string | null,
    orderPaymentGateway: string,
    orderTotal: number,
    orderShipping: number,
    orderItemCount: number,
    orderProductCount: number,
    orderCustomer?: string,
    orderEmail: string,
    orderCompany?: string,
    orderFirstname?: string,
    orderLastname?: string,
    orderAddr1?: string,
    orderAddr2?: string,
    orderCountry?: string,
    orderState?: string,
    orderPostcode?: string,
    orderPhoneNumber?: string,
    orderComment?: string,
    orderStatus: OrderStatus,
    orderDate: Date,
    orderProducts: Record<string, TCartItem>,
    orderType: 'Single' | 'Subscription',
    productStockUpdated?: boolean,
    [p: string]: any,
};
export const OrderStatusMap = {
    Approved: false,
    'Approved - Processing': false,
    Cancelled: true,
    Completed: true,
    Created: false,
    Declined: true,
    Failed: false,
    Paid: true,
    Pending: true,
    Shipped: true,
};
export type OrderStatus =  keyof typeof OrderStatusMap;

export type PaymentConfig = {
    description: string,
    buttonText: string,
    [name: string]: string,
};

export type PaymentConfigs = {
    [gateway: string]: PaymentConfig,
};

export type ProcessProps = {
    loadingAware?: boolean,
    submittingAware?: boolean,
}

export type ProductBase = {
    _id: string,
    productPermalink: string,
    productTitle: string,
    productPrice: number,
    productPublished?: boolean,
    variants?: Variant[],
};

export type ProductImagePath = {
    id: number,
    path: string,
    productImage: boolean, //default image or not
};

export type ProductInfo = ProductBase & {
    productDescription: string,
    productComment?: boolean,
    productStock?: number,
    productStockDisable?: boolean,
    productSubscription?: string,
    productGtin?: string,
    productBrand?: string,
    tags?: string[],
};

export type Product = ProductInfo & {
    productAddedDate: Date,
    imageCount: number,
    imgaeDefaultIndex?: number,
};

export type ProductItem = ProductBase & {
    productImage: UrlPathLocal,
};

export type UrlPath = Exclude<`/${string}`, `//${string}`>;
export type UrlPathLocal = /* `/${string}` */ Exclude<Href,
    ExternalPathString | HrefObject | RelativePathString
        | `/../${string}` | `/(contents)${string}` | `/+not-found${string}`
>;

export type Session = {
    blockonomicsParams?: {
        expectedBtc: number,
        address: string,
        timestamp: number,
        pendingOrderId: string,
    },
    customerAddress1?: string,
    customerAddress2?: string,
    customerCompany?: string,
    customerCountry?: string,
    customerEmail?: string,
    customerFirstname?: string,
    customerLastname?: string,
    customerPhone?: string,
    customerPostcode?: string,
    customerPresent: boolean,
    customerState?: string,
};

export type SubmitFunction = (params: HttpUrl | UrlPath | SubmitParams) => void;
export type SubmitParams = {
    data?: {[name: string]: any} | null,
    httpHeaders?: {[name: string]: string},
    message?: string,
    onError?: (error: HttpError) => any,
    onSubmitted?: DataReadyCallback,
    rejectIfHandled?: string,
    url: HttpUrl | UrlPath,
};

export type TCart = {
    cartItemCount?: number,
    discountCode: string,
    items: Record<string, TCartItem>,
    orderComment?: string,
    shippingMessage?: string,
    shippingOptions: false,
    totalCartAmount: number,
    totalCartDiscount: number,
    totalCartShipping: number,
};

export type TCartItem = {
    title: string,
    link: `/product/${string}`,
    productComment?: string,
    productId: string,
    productImage: UrlPath,
    quantity: number,
    totalItemPrice: number,
    variantId?: string,
    variantTitle?: string,
};

export type TNotification = {
    message: string,
    type?: 'success' | 'warning' | 'error' | 'info',
    duration?: Duration,
};

export type ValidationProps<Props, Instance = unknown, Value = any> = {
    ref?: React.Ref<ValidationValueRef<Instance, Value>>,
    rules?: Rules,
    validationOptions?: Omit<ValidationOption<Props>, 'lang' | 'name' | 'rules'>,
};
export type ValidationRef<Instance> = Omit<Instance, keyof InputRef> & InputRef;
export type ValidationValueRef<Instance, Value = any> = Omit<ValidationRef<Instance>, keyof InputValueRef<Value>> & InputValueRef<Value>;

export type Variant = {
    _id: string,
    title: string,
    price: number,
    stock?: number,
    imageIdx?: number,
};