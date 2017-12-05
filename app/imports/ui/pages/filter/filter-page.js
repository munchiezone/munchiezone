import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Restaurants } from '/imports/api/restaurant/RestaurantCollection';

const selectedRestaurantsKey = 'selectedRestaurants';

Template.Filter_Page.onCreated(function onCreated() {
  this.subscribe(Restaurants.getPublicationName());
  this.subscribe(Profiles.getPublicationName());
  this.messageFlags = new ReactiveDict();
  this.messageFlags.set(selectedRestaurantsKey, undefined);
});

Template.Filter_Page.helpers({
  profiles() {
    // Initialize selectedInterests to all of them if messageFlags is undefined.
    if (!Template.instance().messageFlags.get(selectedRestaurantsKey)) {
      Template.instance().messageFlags.set(selectedRestaurantsKey, _.map(Restaurants.findAll(), restaurant => restaurant.name));
    }
    // Find all profiles with the currently selected interests.
    const allProfiles = Profiles.findAll();
    const selectedRestaurants = Template.instance().messageFlags.get(selectedRestaurantsKey);
    return _.filter(allProfiles, profile => _.intersection(profile.restaurants, selectedRestaurants).length > 0);
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
    const selectedOptions = _.filter(event.target.Restaurants.selectedOptions, (option) => option.selected);
    instance.messageFlags.set(selectedRestaurantsKey, _.map(selectedOptions, (option) => option.value));
  },
});

