import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { getModelToken } from '@nestjs/mongoose';
import { CustomerService } from './customer.service';

describe('Customer Controller', () => {
  let controller: CustomerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        CustomerService,
        {
          provide: getModelToken('Customer'),
          useValue: {},
        },
      ]
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
