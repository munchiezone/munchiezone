import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';
import { Orders } from '/imports/api/order/OrderCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Restaurants } from '/imports/api/restaurant/RestaurantCollection';

const displaySuccessMessage = 'displaySuccessMessage';
const displayErrorMessages = 'displayErrorMessages';

Template.Create_Page.onCreated(function onCreated() {
  this.subscribe(Interests.getPublicationName());
  this.subscribe(Orders.getPublicationName());
  this.subscribe(Restaurants.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(displaySuccessMessage, false);
  this.messageFlags.set(displayErrorMessages, false);
  this.context = Orders.getSchema().namedContext('Create_Page');
});

Template.Create_Page.helpers({
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
    return Orders.findDoc(FlowRouter.getParam('restaurant'));
  },
  interest() {
    const order = Orders.findDoc(FlowRouter.getParam('restaurant'));
    const selectedDietType = order.dietType;
    return order && _.map(Interests.findAll(),
        function makeInterestObject(interest) {
          return { label: interest.name, selected: _.contains(selectedDietType, interest.name) };
        });
  },
  restaurants() {
    const order = Orders.findDoc(FlowRouter.getParam('restaurant'));
    const selectedRestaurant = order.restaurants;
    return order && _.map(Restaurants.findAll(),
        function makeRestaurantObject(restaurant) {
          return { label: restaurant.name, selected: _.contains(selectedRestaurant, restaurant.name) };
        });
  },
});

// get drop down menus to work !!!!!!!!!!
Template.Create_Page.events({
  'submit .order-data-form'(event, instance) {
    event.preventDefault();
    const orders = event.target.Order.value;
    const timeMinutes = event.target.Time.value;
    const pickupLocation = event.target.Pickup.value;

    const selectedInterests = _.filter(event.target.Interests.selectedOptions, (option) => option.selected);
    const dietType = _.map(selectedInterests, (option) => option.value);
    const foodType = event.target.Food.value;
    const selectedRestaurant = _.filter(event.target.Restaurant.selectedOptions, (option) => option.selected);
    const restaurant = _.map(selectedRestaurant, (option) => option.value);

    const newOrderData = { restaurant, orders, foodType, dietType, timeMinutes, pickupLocation };

    // Clear out any old validation errors.
    instance.context.reset();
    // Invoke clean so that updatedProfileData reflects what will be inserted.
    const cleanData = Orders.getSchema().clean(newOrderData);
    // Determine validity.
    instance.context.validate(cleanData);

    if (instance.context.isValid()) {
      const docID = Orders.findDoc(FlowRouter.getParam('restaurant'))._id;
      const id = Orders.update(docID, { $set: cleanData });
      instance.messageFlags.set(displaySuccessMessage, id);
      instance.messageFlags.set(displayErrorMessages, false);
    } else {
      instance.messageFlags.set(displaySuccessMessage, false);
      instance.messageFlags.set(displayErrorMessages, true);
    }
  },
});
