import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Orders } from '/imports/api/order/OrderCollection';
import { Restaurants } from '/imports/api/restaurant/RestaurantCollection';

const selectedRestaurantsKey = 'selectedRestaurants';

Template.Filter_Page.onCreated(function onCreated() {
  this.subscribe(Restaurants.getPublicationName());
  this.subscribe(Orders.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(selectedRestaurantsKey, undefined);
});

Template.Filter_Page.helpers({
  orders() {
    // Initialize selectedRestaurants to all of them if messageFlags is undefined.
    if (!Template.instance().messageFlags.get(selectedRestaurantsKey)) {
      Template.instance().messageFlags.set(selectedRestaurantsKey, _.map(Restaurants.findAll(),
              restaurant => restaurant.name));
    }
    // Find all profiles with the currently selected interests.
    const allOrders = Orders.findAll();
    const selectedRestaurants = Template.instance().messageFlags.get(selectedRestaurantsKey);
    return _.filter(allOrders, order => _.intersection(order.restaurants, selectedRestaurants).length > 0);
  },

  restaurants() {
    return _.map(Restaurants.findAll(),
        function makeRestaurantObject(restaurant) {
          return {
            label: restaurant.name,
            selected: _.contains(Template.instance().messageFlags.get(selectedRestaurantsKey), restaurant.name),
          };
        });
  },
});

Template.Filter_Page.events({
  'submit .filter-data-form'(event, instance) {
    event.preventDefault();
    const selectedOptions = _.filter(event.target.Interests.selectedOptions, (option) => option.selected);
    instance.messageFlags.set(selectedRestaurantsKey, _.map(selectedOptions, (option) => option.value));
  },
});

