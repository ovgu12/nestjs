import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCustomerDTO } from './dto/create-customer.dto';
import { Customer } from './interfaces/customer.interface';

@Injectable()
export class CustomerService {

    constructor(@InjectModel('Customer') private readonly customerModel: Model<Customer>) { }
    
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
        const customer = await this.customerModel.findOne({email}).exec();
        return customer;
    } 

    /**
     * Gets customer data
     *
     * @param customerID
     */
    async getCustomer(customerID): Promise<Customer> {
        const customer = await this.customerModel.findById(customerID).exec();
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
     * @param customerID 
     * @param createCustomerDTO 
     */
    async updateCustomer(customerID, createCustomerDTO: CreateCustomerDTO): Promise<Customer> {
        const updatedCustomer = await this.customerModel
            .findByIdAndUpdate(customerID, createCustomerDTO, { new: true });
        return updatedCustomer;
    }

    /**
     * Deletes customer by id
     *
     * @param customerID
     */
    async deleteCustomer(customerID): Promise<any> {
        const deletedCustomer = await this.customerModel.findByIdAndRemove(customerID);
        return deletedCustomer;
    }

}
