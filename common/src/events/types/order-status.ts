export enum OrderStatus {
  /* when order has been created, but ticket it is trying to order
     has not been reserved */
  Created = 'created',

  /* ticket the order is trying to reserver has already been
     reserved, user has cancelled order, or order expires before
     payment */
  Cancelled = 'cancelled',

  /* order successfully reserved ticket */
  AwaitingPayment = 'awaiting:payment',

  /* order has reserved ticket and user has provided payment
     successfully */
  Complete = 'complete'
}