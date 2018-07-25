import { Test, TestingModule } from '@nestjs/testing';
import { PlaygroundController } from './playground.controller';

describe('Playground Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [PlaygroundController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: PlaygroundController = module.get<PlaygroundController>(PlaygroundController);
    expect(controller).toBeDefined();
  });
});
