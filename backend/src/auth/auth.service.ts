import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signup() {
    return { msg: 'SIGN UP HERE' };
  }

  signin() {
    return { msg: 'SIGN IN HERE' };
  }
}
