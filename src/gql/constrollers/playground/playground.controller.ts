import { Controller, Get, Render } from '@nestjs/common';
import { ConfigService } from '../../../shared/services/config/config.service';

@Controller()
export class PlaygroundController {
  constructor(private readonly configService: ConfigService) {
  }

  @Get()
  @Render('gql/playground/index')
  async index() {
    return {
      endpoint: this.configService.get('GRAPHQL_ENDPOINT'),
      subscriptionEndpoint: this.configService.get('GRAPHQL_SUBSCRIPTION_ENDPOINT')
    };
  }
}
