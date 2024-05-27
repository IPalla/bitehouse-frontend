import { Order } from './order';

export interface OrderNotification {
  events?: string[];
  order?: Order;
}
