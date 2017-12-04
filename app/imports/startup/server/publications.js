import { Restaurants } from '/imports/api/restaurant/RestaurantCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Orders } from '/imports/api/order/OrderCollection';


Restaurants.publish();
Interests.publish();
Profiles.publish();
Orders.publish();
