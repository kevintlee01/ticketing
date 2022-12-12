"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    /* when order has been created, but ticket it is trying to order
       has not been reserved */
    OrderStatus["Created"] = "created";
    /* ticket the order is trying to reserver has already been
       reserved, user has cancelled order, or order expires before
       payment */
    OrderStatus["Cancelled"] = "cancelled";
    /* order successfully reserved ticket */
    OrderStatus["AwaitingPayment"] = "awaiting:payment";
    /* order has reserved ticket and user has provided payment
       successfully */
    OrderStatus["Complete"] = "complete";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
