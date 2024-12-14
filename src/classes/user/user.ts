import argon2 from "argon2";
export class User {
  username: string;
  email: string;
  password: string;
  country: string;

  constructor(
    username: string,
    email: string,
    password: string,
    country: string
  ) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.country = country;
  }
  encryptPassword = async () => {
    try {
      const hash = await argon2.hash(this.password);
      this.password = hash;
    } catch (err) {
      throw new Error("Error while password encryption");
    }
  };
}
