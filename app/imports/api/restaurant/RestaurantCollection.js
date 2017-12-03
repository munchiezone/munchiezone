import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Restaurant */

/**
 * Represents a specific restaurant, such as "Software Engineering".
 * @extends module:Base~BaseCollection
 */
class RestaurantCollection extends BaseCollection {

  /**
   * Creates the Restaurant collection.
   */
  constructor() {
    super('Restaurant', new SimpleSchema({
      name: { type: String },
      description: { type: String, optional: true },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Restaurant.
   * @example
   * Restaurants.define({ name: 'McDonalds',
   *                    description: '.' });
   * @param { Object } description Object with keys name and description.
   * Name must be previously undefined. Description is optional.
   * Creates a "slug" for this name and stores it in the slug field.
   * @throws {Meteor.Error} If the restaurant definition includes a defined name.
   * @returns The newly created docID.
   */
  define({ name, description }) {
    check(name, String);
    check(description, String);
    if (this.find({ name }).count() > 0) {
      throw new Meteor.Error(`${name} is previously defined in another Restaurant`);
    }
    return this._collection.insert({ name, description });
  }

  /**
   * Returns the Restaurant name corresponding to the passed restaurant docID.
   * @param restaurantID An restaurant docID.
   * @returns { String } An restaurant name.
   * @throws { Meteor.Error} If the restaurant docID cannot be found.
   */
  findName(restaurantID) {
    this.assertDefined(restaurantID);
    return this.findDoc(restaurantID).name;
  }

  /**
   * Returns a list of Restaurant names corresponding to the passed list of Restaurant docIDs.
   * @param restaurantIDs A list of Restaurant docIDs.
   * @returns { Array }
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  findNames(restaurantIDs) {
    return restaurantIDs.map(restaurantID => this.findName(restaurantID));
  }

  /**
   * Throws an error if the passed name is not a defined Restaurant name.
   * @param name The name of an restaurant.
   */
  assertName(name) {
    this.findDoc(name);
  }

  /**
   * Throws an error if the passed list of names are not all Restaurant names.
   * @param names An array of (hopefully) Restaurant names.
   */
  assertNames(names) {
    _.each(names, name => this.assertName(name));
  }

  /**
   * Returns the docID associated with the passed Restaurant name, or throws an error if it cannot be found.
   * @param { String } name An restaurant name.
   * @returns { String } The docID associated with the name.
   * @throws { Meteor.Error } If name is not associated with an Restaurant.
   */
  findID(name) {
    return (this.findDoc(name)._id);
  }

  /**
   * Returns the docIDs associated with the array of Restaurant names, or throws an error if any name cannot be found.
   * If nothing is passed, then an empty array is returned.
   * @param { String[] } names An array of restaurant names.
   * @returns { String[] } The docIDs associated with the names.
   * @throws { Meteor.Error } If any instance is not an Restaurant name.
   */
  findIDs(names) {
    return (names) ? names.map((instance) => this.findID(instance)) : [];
  }

  /**
   * Returns an object representing the Restaurant docID in a format acceptable to define().
   * @param docID The docID of an Restaurant.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const description = doc.description;
    return { name, description };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Restaurants = new RestaurantCollection();
