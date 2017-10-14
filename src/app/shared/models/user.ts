export class User {
  id: number;
  analyzedEvents: Array<number>;
  dateJoined: string;
  email: string;
  firstName: string;
  lastName: string;
  isStaff: boolean;
  username: string;

  constructor (obj) {
    this.id = obj.id;
    this.analyzedEvents = [];
    obj.analyzed_events.forEach(event => this.analyzedEvents.push(event));
    this.dateJoined = obj.date_joined;
    this.email = obj.email;
    this.firstName = obj.first_name;
    this.lastName = obj.last_name;
    this.isStaff = obj.is_staff;
    this.username = obj.username;
  }

}
