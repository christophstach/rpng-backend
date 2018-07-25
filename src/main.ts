import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './shared/services/config/config.service';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, server, { cors: true });

  app.useStaticAssets(join(__dirname + './../public'));
  app.setBaseViewsDir(join(__dirname + './../views'));
  app.setViewEngine('hbs');

  await app.listen(configService.get('PORT'));
}

bootstrap().then(() => {
  /* tslint:disable */
  console.log(`

  _____            _   _ _____   ____  __  __   _____  _____   ____       _ ______ _____ _______   _   _          __  __ ______    _____ ______ _   _ ______ _____         _______ ____  _____  
|  __ \\     /\\   | \\ | |  __ \\ / __ \\|  \\/  | |  __ \\|  __ \\ / __ \\     | |  ____/ ____|__   __| | \\ | |   /\\   |  \\/  |  ____|  / ____|  ____| \\ | |  ____|  __ \\     /\\|__   __/ __ \\|  __ \\ 
| |__) |   /  \\  |  \\| | |  | | |  | | \\  / | | |__) | |__) | |  | |    | | |__ | |       | |    |  \\| |  /  \\  | \\  / | |__    | |  __| |__  |  \\| | |__  | |__) |   /  \\  | | | |  | | |__) |
|  _  /   / /\\ \\ | . \` | |  | | |  | | |\\/| | |  ___/|  _  /| |  | |_   | |  __|| |       | |    | . \` | / /\\ \\ | |\\/| |  __|   | | |_ |  __| | . \` |  __| |  _  /   / /\\ \\ | | | |  | |  _  / 
| | \\ \\  / ____ \\| |\\  | |__| | |__| | |  | | | |    | | \\ \\| |__| | |__| | |___| |____   | |    | |\\  |/ ____ \\| |  | | |____  | |__| | |____| |\\  | |____| | \\ \\  / ____ \\| | | |__| | | \\ \\ 
|_|  \\_\\/_/    \\_\\_| \\_|_____/ \\____/|_|  |_| |_|    |_|  \\_\\\\____/ \\____/|______\\_____|  |_|    |_| \\_/_/    \\_\\_|  |_|______|  \\_____|______|_| \\_|______|_|  \\_\\/_/    \\_\\_|  \\____/|_|  \\_\\
                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                                                                                                                                
  `);
});
