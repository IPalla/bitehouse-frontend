export interface Kpis {
    totalOrders: string;
    inPreparationOrders: string;
    averagePreparationTime: string;
    minPreparationTime: string;
    maxPreparationTime: string;
    awaitingOrders: string;
    averageAwaitingTime: string;
    minAwaitingTime: string;
    maxAwaitingTime: string;
    inDeliveryOrders: string;
    averageDeliveryTime: string;
    minDeliveryTime: string;
    maxDeliveryTime: string;
    averageEndToEndTime: string;
    minEndToEndTime: string;
    maxEndToEndTime: string;
    pickupOrders: string;
    finishedOrders: string;
    followers: number;
    selledProducts: [][];
    mostSelledProduct: string;
}