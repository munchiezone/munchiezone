import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Orders } from '/imports/api/order/OrderCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Restaurants } from '/imports/api/restaurant/RestaurantCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Edit_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Orders.getPublicationName());
  this.subscribe(Restaurants.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Orders.getSchema().namedContext('Edit_Page');
});

Template.Edit_Page.helpers({
  successClass() {
    return Template.instance().messageFlags.get(displaySuccessMessage) ? 'success' : '';
  },
  displaySuccessMessage() {
    return Template.instance().messageFlags.get(displaySuccessMessage);
  },
  errorClass() {
    return Template.instance().messageFlags.get(displayErrorMessages) ? 'error' : '';
  },
  order() {
    return Orders.findDoc(FlowRouter.getParam('_id'));
  },
  interests() {
    const order = Orders.findDoc(FlowRouter.getParam('_id'));
    const selectedInterests = order.interests;
    return order && _.map(Interests.findAll(),
        function makeInterestObject(interest) {
          return { label: interest.name, selected: _.contains(selectedInterests, interest.name) };
        });
  },
  restaurants() {
    return _.map(Restaurants.findAll(),
        function makeRestaurantObject(restaurant) {
          return { label: restaurant.name };
        });
  },
});

Template.Edit_Page.events({
  'submit .edit-data-form'(event, instance) {
    event.preventDefault();
    const docID = Orders.findDoc(FlowRouter.getParam('_id'));
    const currentOrder = _.filter(Orders.findAll(), function (obj) {
      return obj._id === docID._id;
    });

    const items = event.target.Order.value;
    const time = event.target.Time.value;
    const meetup = event.target.MeetUp.value;
    const pickupLocation = event.target.Pickup.value;
    const interest = currentOrder[0].interest;
    const restaurant = currentOrder[0].restaurant;
    const foodType = event.target.Food.value;
    const picture = event.target.Picture.value;
    const updatedOrderData = { restaurant, items, foodType, interest, time, meetup, pickupLocation, picture };
    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedOrderData reflects what will be inserted.
    const cleanData = Orders.getSchema().clean(updatedOrderData);
    // Determine validity.
    instance.context.validate(cleanData);
    console.log(updatedOrderData);

    if (instance.context.isValid()) {
      const id = Orders.update(docID._id, { $set: cleanData });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});
