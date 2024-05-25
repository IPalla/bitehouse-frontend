export * from './authAPI.service';
import { AuthAPIService } from './authAPI.service';
export * from './kpisAPI.service';
import { KpisAPIService } from './kpisAPI.service';
export * from './ordersAPI.service';
import { OrdersAPIService } from './ordersAPI.service';
export const APIS = [AuthAPIService, KpisAPIService, OrdersAPIService];
