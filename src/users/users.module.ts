import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './services/users.service';
import { User } from './models/user.model';
import { UserMongooseSchema } from './mongoose-schemas/user.mongoose-schema';
import { UsersResolver } from './resolvers/users.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserMongooseSchema },
    ]),
  ],
  providers: [
    UsersService,
    UsersResolver,
  ],
  exports: [
    UsersService,
  ],
})
export class UsersModule {
}
