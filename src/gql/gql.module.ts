import { Global, Inject, Module } from '@nestjs/common';
import { GraphQLFactory, GraphQLModule } from '@nestjs/graphql';
import { MiddlewaresConsumer } from '@nestjs/common/interfaces/middlewares';
import { graphqlExpress } from 'apollo-server-express/dist/expressApollo';
import { PlaygroundController } from './constrollers/playground/playground.controller';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { ConfigService } from '../shared/services/config/config.service';

@Global()
@Module({
  imports: [GraphQLModule],
  providers: [
    {
      provide: 'PubSub',
      useValue: new PubSub(),
    },
    {
      provide: 'SubscriptionServer',
      useFactory: (configService: ConfigService) => {
        const server = createServer();
        return new Promise(
          resolve => server.listen(
            parseInt(configService.get('GRAPHQL_SUBSCRIPTION_SERVER_PORT'), 10),
            () => resolve(server),
          ),
        );
      },
      inject: [ConfigService],
    },
  ],
  controllers: [PlaygroundController],
  exports: ['PubSub'],
})
export class GqlModule {
  constructor(
    private readonly graphQLFactory: GraphQLFactory,
    private readonly configService: ConfigService,
    @Inject('SubscriptionServer') private readonly  subscriptionServer,
  ) {
  }

  configure(consumer: MiddlewaresConsumer) {
    const typeDefs = this.graphQLFactory.mergeTypesByPaths('./**/*.graphql');
    const schema = this.graphQLFactory.createSchema({ typeDefs });
    const subscriptionServer = new SubscriptionServer({
      execute,
      subscribe,
      schema,
    }, {
      server: this.subscriptionServer,
      path: this.configService.get('GRAPHQL_SUBSCRIPTION_SERVER_PATH'),
    });

    consumer
      .apply(graphqlExpress(req => {
        return {
          schema,
          rootValue: req,
        };
      }))
      .forRoutes(this.configService.get('GRAPHQL_SERVER_PATH'));
  }
}
