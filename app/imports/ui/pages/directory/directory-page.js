import { Template } from 'meteor/templating';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Orders } from '/imports/api/order/OrderCollection';

Template.Directory_Page.onCreated(function onCreated() {
  this.subscribe(Orders.getPublicationName());
});

Template.Directory_Page.helpers({

  /**
   * Returns a cursor to profiles, sorted by last name.
   */
  orders() {
    return Orders.find({}, { sort: { restaurant: 1 } });
  },
});
