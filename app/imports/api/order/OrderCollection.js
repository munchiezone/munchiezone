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
      restaurant: { type: Array },
      'restaurant.$': { type: String },
      items: { type: String },
      foodType: { type: String, optional: true },
      interest: { type: Array, optional: true },
      'interest.$': { type: String },
      timeMinutes: { type: String },
      pickupLocation: { type: String },
      picture: { type: String, optional: true },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Order.
   * @example
   * Orders.define({ restaurant: 'McDonalds',
   *                   itmes: '1 Cheeseburger, 3 Large Cokes',
   *                   foodType: ['American', 'Fastfood'],
   *                   interest: ['Vegetarian'],
   *                   timeMinutes: '60',
   *                   pickupLocation: 'Campus Center: 2465 Campus Rd, Honolulu, HI 96822',
   * @param { Object } description Object with required key username.
   * Remaining keys are optional.
   * Username must be unique for all users. It should be the UH email account.
   * Restaurants is an array of defined restaurant names.
   * @throws { Meteor.Error } If a user with the supplied username already exists, or
   * if one or more interests
   * @returns The newly created docID.
   */
  define({
           restaurant = [], items = '', username, foodType = [], interest = [],
           timeMinutes = '', pickupLocation = '', picture = '',
         }) {
    // make sure required fields are OK.
    const checkPattern = {
      restaurant: String, items: String, username: String, location: String,
      timeMinutes: String, picture: String,
    };
    check({ restaurant, items, username, foodType, interest, timeMinutes, pickupLocation, picture }, checkPattern);

    if (this.find({ restaurant }).count() > 0) {
      throw new Meteor.Error(`${restaurant} is previously defined in another Order`);
    }

    // Throw an error if any of the passed Interest names are not defined.
    Interests.assertNames(interest);
    // IMPLEMENT RESTAURANT STUFF
    Restaurants.assertNames(restaurant);
    // Throw an error if there are duplicates in the passed interest names.
    if (interest.length !== _.uniq(interest).length) {
      throw new Meteor.Error(`${interest} contains duplicates`);
    }

    return this._collection.insert({
      restaurant,
      items,
      username,
      foodType,
      interest,
      timeMinutes,
      pickupLocation,
      picture,
    });
  }

  /**
   * Returns an object representing the Order docID in a format acceptable to define().
   * @param docID The docID of a Order.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const restaurant = doc.restaurant;
    const items = doc.items;
    const username = doc.username;
    const foodType = doc.foodType;
    const interest = doc.interest;
    const timeMinutes = doc.timeMinutes;
    const pickupLocation = doc.pickupLocation;
    const picture = doc.picture;
    return { restaurant, items, username, foodType, interest, timeMinutes, pickupLocation, picture };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Orders = new OrderCollection();
