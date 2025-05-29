import {
  IsArray,
  IsDateString,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  film: string;
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  session: string;
  @IsNotEmpty()
  @IsString()
  @IsDateString()
  daytime: string;
  @IsNotEmpty()
  @IsNumber()
  row: number;
  @IsNotEmpty()
  @IsNumber()
  seat: number;
  @IsNotEmpty()
  @IsNumber()
  price: number;
  id: string;
}

export class CreateOrdersDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  tickets: CreateTicketDto[];
  id: string;
}

export class ReturnOrdersDto {
  total: number;
  items: CreateTicketDto[];
}

export class ReturnError {
  error: string;
}
