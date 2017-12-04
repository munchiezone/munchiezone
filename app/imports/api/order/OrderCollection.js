import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Restaurants } from '/imports/api/restaurant/RestaurantCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Order */

/**
 * Orders provide portfolio data for a user.
 * @extends module:Base~BaseCollection
 */
class OrderCollection extends BaseCollection {

  /**
   * Creates the Order collection.
   */
  constructor() {
    super('Order', new SimpleSchema({
      restaurant: { type: Array, optional: false},
      'restaurant.$': { type: String },
      orders: { type: String },
      foodType: { type: Array, optional: true },
      'foodType.$': { type: String },
      interest: { type: Array, optional: true },
      'interest.$': { type: String },
      timeMinutes: { type: Number },
      pickupLocation: { type: String },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Order.
   * @example
   * Orders.define({ restaurant: 'McDonalds',
   *                   orders: '1 Cheeseburger, 3 Large Cokes',
   *                   foodType: ['American', 'Fastfood'],
   *                   interest: ['Vegetarian'],
   *                   timeMinutes: 60,
   *                   pickupLocation: 'Campus Center: 2465 Campus Rd, Honolulu, HI 96822',
   * @param { Object } description Object with required key username.
   * Remaining keys are optional.
   * Username must be unique for all users. It should be the UH email account.
   * Restaurants is an array of defined restaurant names.
   * @throws { Meteor.Error } If a user with the supplied username already exists, or
   * if one or more interests are not defined, or if github, facebook, and instagram are not URLs.
   * @returns The newly created docID.
   */
  define({ restaurant = '', orders = '', username, foodType = [], interest = [], timeMinutes = null,
           pickupLocation = '' }) {
    // make sure required fields are OK.
    const checkPattern = { restaurant: String, orders: String, username: String, bio: String, picture: String,
      title: String, location: String };
    check({ restaurant, orders, username, foodType, interest, timeMinutes, pickupLocation }, checkPattern);

    if (this.find({ restaurant }).count() > 0) {
      throw new Meteor.Error(`${restaurant} is previously defined in another Order`);
    }

    // Throw an error if any of the passed Interest names are not defined.
    Interests.assertNames(interest);

    // IMPLEMENT RESTAURANT STUFF

    // Throw an error if there are duplicates in the passed foodType names.
    if (foodType.length !== _.uniq(foodType).length) {
      throw new Meteor.Error(`${foodType} contains duplicates`);
    }

    // Throw an error if there are duplicates in the passed interest names.
    if (interest.length !== _.uniq(interest).length) {
      throw new Meteor.Error(`${interest} contains duplicates`);
    }

    return this._collection.insert({ restaurant, orders, username, foodType, interest, timeMinutes, pickupLocation });
  }

  /**
   * Returns an object representing the Order docID in a format acceptable to define().
   * @param docID The docID of a Order.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const restaurant = doc.restaurant;
    const orders = doc.orders;
    const username = doc.username;
    const foodType = doc.foodType;
    const interest = doc.interest;
    const timeMinutes = doc.timeMinutes;
    const pickupLocation = doc.pickupLocation;
    return { restaurant, orders, username, foodType, interest, timeMinutes, pickupLocation };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Orders = new OrderCollection();
