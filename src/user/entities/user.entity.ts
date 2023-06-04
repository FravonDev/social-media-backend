import { v4 as uuid } from 'uuid';

export class User {
  id: string;
  email: string;
  password: string;
  username: string;
  name: string;
  photo?: string;  
  constructor(props: User) {
    this.id = props.id ?? uuid();
    this.email = props.email;
    this.password = props.password;
    this.username = props.username;
    this.name = props.name;
    this.photo = props.photo;
  }
}
