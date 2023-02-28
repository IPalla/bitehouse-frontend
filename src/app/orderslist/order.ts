

export interface StatusHistory {
    response: string;
    status: number;
    source: number;
    timeStamp: Date;
}

export interface Customer {
    email: string;
    name: string;
    phoneNumber: string;
    companyName: string;
}

export interface Courier {
}

export interface SubItem {
    subItems: any[];
    productType: number;
    quantity: number;
    productTags: any[];
    plu: string;
    sortOrder: number;
    name: string;
    price: number;
}

export interface Item {
    name: string;
    sortOrder: number;
    subItems: SubItem[];
    quantity: number;
    isCombo: boolean;
    price: number;
    productTags: number[];
    plu: string;
    productType: number;
}

export interface DeliveryAddress {
    street: string;
    city: string;
    source: string;
    postalCode: string;
    country: string;
}

export interface Courier2 {
}

export interface CourierUpdateHistory {
    status: number;
    received: Date;
    arrivalTime: Date;
    source: number;
    deliveryTime: Date;
    courier: Courier2;
}

export interface Payment {
    type: number;
    rebate: number;
    due: number;
    amount: number;
}

export interface Packaging {
    includeCutlery: boolean;
}

export interface Status {
    status: number;
    text: string;
    literal: string;
    color: string;
    spinner: boolean;
    pickup: boolean;
    markAsDelivered: boolean;
}

export interface OrderData {
    isDelayed: boolean;
    serviceCharge: number;
    statusHistory: StatusHistory[];
    note: string;
    taxTotal: number;
    taxes: any[];
    _created: Date;
    customer: Customer;
    posReceiptId: string;
    posId: string;
    date: number;
    recent: boolean;
    courier: Courier;
    channel: number;
    channelOrderHistoryRawIds: any[];
    orderType: number;
    status: number;
    parsedStatus: Status;
    channelOrderRawId: string;
    deliveryIsAsap: boolean;
    items: Item[];
    deliveryCost: number;
    _id: string;
    numberOfCustomers: number;
    account: string;
    capacityUsages: any[];
    _updated: Date;
    pickupTimeUpdated: Date;
    deliveryAddress: DeliveryAddress;
    channelOrderId: string;
    channelOrderDisplayId: string;
    discounts: any[];
    discountTotal: number;
    rating: any[];
    courierUpdateHistory: CourierUpdateHistory[];
    orderIsAlreadyPaid: boolean;
    channelLink: string;
    timezone: string;
    brandId: string;
    pickupTime: Date;
    posLocationId: string;
    decimalDigits: number;
    payment: Payment;
    resolvedBy: string;
    location: string;
    bagFee: number;
    deliveryTime: Date;
    by: string;
    pos: number;
    driverTip: number;
    channelOrderKey: string;
    tip: number;
    packaging: Packaging;
}

export interface Notification {
    messageId: string;
    ccdDestinations: string[];
    fixedDestination: string;
}

export interface Created {
    _seconds: number;
    _nanoseconds: number;
}

export interface Order {
    orderData: OrderData;
    notification: Notification;
    preparationTime: number;
    created: Created;
    env: string;
}