import { Profiles } from '/imports/api/profile/ProfileCollection';
import { Interests } from '/imports/api/interest/InterestCollection';
import { Restaurants } from '/imports/api/restaurant/RestaurantCollection';

export function removeAllEntities() {
  Profiles.removeAll();
  Interests.removeAll();
  Restaurants.removeAll();
}
