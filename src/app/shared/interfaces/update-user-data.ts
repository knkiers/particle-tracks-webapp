/**
 * this interface specifies the format for the fields that can be passed
 * in when updating a user's data
 */
export interface UpdateUserData {
  username?: string;
  password?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  institution_id?: number;
}
