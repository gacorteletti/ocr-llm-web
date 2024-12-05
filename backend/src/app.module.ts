import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DocumentModule } from './document/document.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // include configuration globally
    AuthModule, UserModule, DocumentModule,
  ],
})
export class AppModule {}
