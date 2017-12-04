import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Restaurants } from '/imports/api/restaurant/RestaurantCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module Profile */

/**
 * Profiles provide portfolio data for a user.
 * @extends module:Base~BaseCollection
 */
class ProfileCollection extends BaseCollection {

  /**
   * Creates the Profile collection.
   */
  constructor() {
    super('Profile', new SimpleSchema({
      username: { type: String },
      // Remainder are optional
      firstName: { type: String, optional: true },
      lastName: { type: String, optional: true },
      interests: { type: Array, optional: true },
      'interests.$': { type: String },
      restaurants: { type: Array, optional: true },
      'restaurants.$': { type: String },
      number: { type: String, optional: true },
      picture: { type: SimpleSchema.RegEx.Url, optional: true },
      email: { type: String, optional: true },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new Profile.
   * @example
   * Profiles.define({ firstName: 'Philip',
   *                   lastName: 'Johnson',
   *                   username: 'johnson',
   *                   bio: 'I have been a professor of computer science at UH since 1990.',
   *                   interests: ['Application Development', 'Software Engineering', 'Databases'],
   *                   title: 'Professor of Information and Computer Sciences',
   *                   picture: 'http://philipmjohnson.org/headshot.jpg',
   *                   github: 'https://github.com/philipmjohnson',
   *                   facebook: 'https://facebook.com/philipmjohnson',
   *                   instagram: 'https://instagram.com/philipmjohnson' });
   * @param { Object } description Object with required key username.
   * Remaining keys are optional.
   * Username must be unique for all users. It should be the UH email account.
   * Interests is an array of defined interest names.
   * @throws { Meteor.Error } If a user with the supplied username already exists, or
   * if one or more interests are not defined, or if github, facebook, and instagram are not URLs.
   * @returns The newly created docID.
   */
  define({ firstName = '', lastName = '', username, interests = [], picture = '', number = '', email = '', restaurants = [] }) {
    // make sure required fields are OK.
    const checkPattern = { firstName: String, lastName: String, username: String, picture: String, email: String,
      number: String };
    check({ firstName, lastName, username, picture, number, email }, checkPattern);

    if (this.find({ username }).count() > 0) {
      throw new Meteor.Error(`${username} is previously defined in another Profile`);
    }

    // Throw an error if any of the passed Interest names are not defined.
    Interests.assertNames(interests);

    // Throws and error if any of the passed Restaurant names are undefined.
    Restaurants.assertNames(restaurants);

    // Throw an error if there are duplicates in the passed interest names.
    if (interests.length !== _.uniq(interests).length) {
      throw new Meteor.Error(`${interests} contains duplicates`);
    }

    // Throws an error if there are duplicates in the passed restaurant names.
    if (restaurants.length !== _.uniq(restaurants).length) {
      throw new Meteor.Error(`${restaurants} contains duplicates`);
    }

    return this._collection.insert({ firstName, lastName, username, email, interests, restaurants, picture, number });
  }

  /**
   * Returns an object representing the Profile docID in a format acceptable to define().
   * @param docID The docID of a Profile.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const firstName = doc.firstName;
    const lastName = doc.lastName;
    const username = doc.username;
    const interests = doc.interests;
    const restaurants = doc.restaurants;
    const picture = doc.picture;
    const number = doc.number;
    const email = doc.email;
    return { firstName, lastName, username, interests, restaurants, picture, number, email};
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Profiles = new ProfileCollection();