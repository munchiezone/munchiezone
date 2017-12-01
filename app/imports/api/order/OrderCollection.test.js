/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

import { Orders } from '/imports/api/order/OrderCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { removeAllEntities } from '/imports/api/base/BaseUtilities';

if (Meteor.isServer) {
  describe('OrderCollection', function testSuite() {
    const restaurant = 'McDonalds';
    const orders = '1 Cheeseburger, 3 Large Cokes';
    const foodType = ['American', 'Fastfood'];
    const dietType = ['Vegetarian'];
    const timeMinutes = 60;
    const pickupLocation = 'Campus Center: 2465 Campus Rd, Honolulu, HI 96822';
    const defineObject = {
      restaurant,
      orders,
      foodType,
      dietType,
      timeMinutes,
      pickupLocation,
    };

    before(function setup() {
      removeAllEntities();
      // Define a sample interest.
      Interests.define({ name: dietType, description: dietType[1] });
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('#define, #isDefined, #removeIt, #dumpOne, #restoreOne', function test() {
      let docID = Orders.define(defineObject);
      expect(Orders.isDefined(docID)).to.be.true;
      // Check that fields are available
      const doc = Orders.findDoc(docID);
      expect(doc.restaurant).to.equal(restaurant);
      expect(doc.orders).to.equal(orders);
      expect(doc.foodType).to.equal(foodType);
      expect(doc.dietType).to.equal(dietType);
      expect(doc.timeMinutes).to.equal(timeMinutes);
      expect(doc.pickupLocation).to.equal(pickupLocation);
      // Check that multiple definitions with the same email address fail ???
      expect(function foo() {
        Orders.define(defineObject);
      }).to.throw(Error);
      // Check that we can dump and restore a Order.
      const dumpObject = Orders.dumpOne(docID);
      Orders.removeIt(docID);
      expect(Orders.isDefined(docID)).to.be.false;
      docID = Orders.restoreOne(dumpObject);
      expect(Orders.isDefined(docID)).to.be.true;
      Orders.removeIt(docID);
    });

    // Recheck this
    it('#define (illegal interest)', function test() {
      const illegalInterests = ['foo'];
      const defineObject2 = {
        restaurant, orders, foodType, dietType: illegalInterests, timeMinutes, pickupLocation,
      };
      expect(function foo() {
        Orders.define(defineObject2);
      }).to.throw(Error);
    });

    // Recheck this. Create another to check foodType duplicates.
    it('#define (duplicate interests)', function test() {
      const duplicateInterests = [dietType[1], dietType[1]];
      const defineObject3 = {
        restaurant, orders, foodType, dietType: duplicateInterests, timeMinutes, pickupLocation };
      expect(function foo() {
        Orders.define(defineObject3);
      }).to.throw(Error);
    });
  });
}

