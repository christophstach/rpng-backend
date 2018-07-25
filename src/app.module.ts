import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { GqlModule } from './gql/gql.module';

@Module({
  imports: [
    CoreModule,
    SharedModule,
    AuthModule,
    GqlModule,
  ],
})
export class AppModule {
}
