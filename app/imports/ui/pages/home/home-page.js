import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Orders } from '/imports/api/order/OrderCollection';
import { Restaurants } from '/imports/api/restaurant/RestaurantCollection';

const selectedInterestsKey = 'selectedInterests';
const owner = this.userId;

Template.Home_Page.onCreated(function onCreated() {
  this.subscribe(Restaurants.getPublicationName());
  this.subscribe(Orders.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(selectedInterestsKey, undefined);
});

Template.Home_Page.helpers({
  profiles() {
    // Initialize selectedInterests to all of them if messageFlags is undefined.
    if (!Template.instance().messageFlags.get(selectedInterestsKey)) {
      Template.instance().messageFlags.set(selectedInterestsKey, _.map(Interests.findAll(), interest => interest.name));
    }
    // Find all profiles with the currently selected interests.
    const allProfiles = Profiles.findAll();
    const selectedInterests = Template.instance().messageFlags.get(selectedInterestsKey);
    return _.filter(allProfiles, profile => _.intersection(profile.interests, selectedInterests).length > 0);
  },

  interests() {
    return _.map(Interests.findAll(),
        function makeInterestObject(interest) {
          return {
            label: interest.name,
            selected: _.contains(Template.instance().messageFlags.get(selectedInterestsKey), interest.name),
          };
        });
  },
  orders() {
    if (!Template.instance().messageFlags.get(selectedRestaurantsKey)) {
      Template.instance().messageFlags.set(selectedRestaurantsKey, _.map(Restaurants.findAll(), restaurants => restaurant.name));
    }
    // Find all orders with the currently selected interests.
    const allOrders = Orders.findAll();
    const selectedRestaurants = Template.instance().messageFlags.get(selectedRestaurantsKey);
    return _.filter(allOrders, order => _.intersection(order.restaurant, selectedRestaurants).length > 0);
  },
  orders2() {
    return Orders.find({ owner }, { sort: { restaurant: 1 } });
  },

  routeUserName() {
    return FlowRouter.getParam('username');
  },
});

Template.Home_Page.events({
  'submit .home-data-form'(event, instance) {
    event.preventDefault();
    const selectedOptions = _.filter(event.target.Interests.selectedOptions, (option) => option.selected);
    instance.messageFlags.set(selectedInterestsKey, _.map(selectedOptions, (option) => option.value));
  },
});
