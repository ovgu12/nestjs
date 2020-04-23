import { IsEmail, IsNotEmpty} from 'class-validator'
export class CreateCustomerDTO {
    @IsNotEmpty()
    readonly firstName: string;
    @IsNotEmpty()
    readonly lastName: string;
    @IsEmail()
    readonly email: string;
    readonly createdAt: Date;
}