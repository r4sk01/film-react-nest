import {
  IsArray,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketDto {
  @IsNotEmpty() @IsString() @IsMongoId() film: string;
  @IsNotEmpty() @IsString() @IsMongoId() session: string;
  @IsNotEmpty() @IsString() @IsDateString() daytime: string;
  @IsNotEmpty() @IsNumber() row: number;
  @IsNotEmpty() @IsNumber() seat: number;
  @IsNotEmpty() @IsNumber() price: number;
}

export class CreateOrdersDto {
  @IsEmail() @IsNotEmpty() email: string;
  @IsNotEmpty() phone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTicketDto)
  tickets: CreateTicketDto[];
}

export class ReturnOrdersDto {
  total: number;
  items: CreateTicketDto[];
}

export class ReturnError {
  error: string;
}
