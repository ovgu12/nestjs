import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCustomerDTO } from './dto/create-customer.dto';
import { Customer } from './interfaces/customer.interface';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel('Customer') private readonly customerModel: Model<Customer>,
  ) {}

  /**
   * Searchs customers for given query
   *
   * @param query
   */
  async searchCustomers(query: string): Promise<Customer[]> {
    const customers = await this.customerModel
      .find({
        $text: { $search: query },
      })
      .exec();
    return customers;
  }

  /**
   * Gets all customers data
   */
  async getAllCustomer(): Promise<Customer[]> {
    const customers = await this.customerModel.find().exec();
    return customers;
  }

  /**
   * Gets customer by given email
   *
   * @param query
   */
  async getCustomerByEmail(email: string): Promise<Customer> {
    const customer = await this.customerModel.findOne({ email }).exec();
    return customer;
  }

  /**
   * Gets customer data
   *
   * @param customerId
   */
  async getCustomer(customerId): Promise<Customer> {
    const customer = await this.customerModel.findById(customerId).exec();
    return customer;
  }

  /**
   * Adds a customer
   *
   * @param createCustomerDTO
   */
  async addCustomer(createCustomerDTO: CreateCustomerDTO): Promise<Customer> {
    const newCustomer = await (this.customerModel as any)(createCustomerDTO);
    return newCustomer.save();
  }

  /**
   * Update customer data
   *
   * @param customerId
   * @param createCustomerDTO
   */
  async updateCustomer(
    customerId,
    createCustomerDTO: CreateCustomerDTO,
  ): Promise<Customer> {
    const updatedCustomer = await this.customerModel.findByIdAndUpdate(
      customerId,
      createCustomerDTO,
      { new: true },
    );
    return updatedCustomer;
  }

  /**
   * Deletes customer by id
   *
   * @param customerId
   */
  async deleteCustomer(customerId): Promise<any> {
    const deletedCustomer = await this.customerModel.deleteOne({
      id: customerId,
    });
    return deletedCustomer;
  }
}
