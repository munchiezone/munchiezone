import { Restaurants } from '/imports/api/restaurant/RestaurantCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Profiles } from '/imports/api/profile/ProfileCollection';


Restaurants.publish();
Interests.publish();
Profiles.publish();
