import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { getModelToken } from '@nestjs/mongoose';

describe('CustomerService', () => {
  let service: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getModelToken('Customer'),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
