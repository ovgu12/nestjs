import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  Put,
  Query,
  NotFoundException,
  Delete,
  Param,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDTO } from './dto/create-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Get('/search')
  async searchCustomers(@Res() res, @Query('query') query) {
    const customers = await this.customerService.searchCustomers(query);
    return res.status(HttpStatus.OK).json(customers);
  }

  @Get('/getByEmail')
  async getCustomerByEmail(@Res() res, @Query('email') email) {
    const customer = await this.customerService.getCustomerByEmail(email);
    return res.status(HttpStatus.OK).json(customer);
  }

  @Get('/:customerId')
  async getCustomer(@Res() res, @Param('customerId') customerId) {
    const customer = await this.customerService.getCustomer(customerId);
    if (!customer) throw new NotFoundException('Customer does not exist!');
    return res.status(HttpStatus.OK).json(customer);
  }

  @Put('/:customerId')
  async updateCustomer(
    @Res() res,
    @Param('customerId') customerId,
    @Body() createCustomerDTO: CreateCustomerDTO,
  ) {
    const customer = await this.customerService.updateCustomer(
      customerId,
      createCustomerDTO,
    );
    if (!customer) throw new NotFoundException('Customer does not exist!');
    return res.status(HttpStatus.OK).json({
      message: 'Customer has been successfully updated',
      customer,
    });
  }

  @Delete('/:customerId')
  async deleteCustomer(@Res() res, @Param('customerId') customerId) {
    const customer = await this.customerService.deleteCustomer(customerId);
    if (!customer) throw new NotFoundException('Customer does not exist');
    return res.status(HttpStatus.OK).json({
      message: 'Customer has been deleted',
      customer,
    });
  }

  @Post('/')
  async addCustomer(@Res() res, @Body() createCustomerDTO: CreateCustomerDTO) {
    const customer = await this.customerService.addCustomer(createCustomerDTO);
    return res.status(HttpStatus.OK).json({
      message: 'Customer has been created successfully',
      customer,
    });
  }

  @Get('/')
  async getAllCustomer(@Res() res) {
    const customers = await this.customerService.getAllCustomer();
    return res.status(HttpStatus.OK).json(customers);
  }
}
