export class User {
  username: string;
  email: string;
  password: string;
  profileImage: string;

  constructor(
    username: string,
    email: string,
    password: string,
    profileImage: string
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.profileImage = profileImage;
  }
}
