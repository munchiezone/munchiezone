import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.Directory_Order.helpers({
  routeUserName() {
    return FlowRouter.getParam('username');
  },
});
