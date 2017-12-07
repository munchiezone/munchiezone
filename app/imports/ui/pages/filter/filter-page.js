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
    // Find all orders with the currently selected interests.
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
  /**
   * Returns a cursor to profiles, sorted by last name.
   */
  orders() {
    return Orders.find({}, { sort: { restaurant: 1 } });
  },
});

Template.Filter_Page.events({
  'submit .filter-data-form'(event, instance) {
    event.preventDefault();
    const selectedOptions = _.filter(event.target.Restaurants.selectedOptions, (option) => option.selected);
    instance.messageFlags.set(selectedRestaurantsKey, _.map(selectedOptions, (option) => option.value));
  },
});

