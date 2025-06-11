import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrdersDto, ReturnOrdersDto, ReturnError } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockTicket = {
    id: 'ticket-1',
    film: '123e4567-e89b-12d3-a456-426614174000',
    session: 'session-1',
    daytime: '2024-01-20T19:00:00Z',
    row: 5,
    seat: 10,
    price: 500,
  };

  const mockCreateOrderDto: CreateOrdersDto = {
    email: 'test@example.com',
    phone: '+1234567890',
    tickets: [
      {
        film: '123e4567-e89b-12d3-a456-426614174000',
        session: 'session-1',
        daytime: '2024-01-20T19:00:00Z',
        row: 5,
        seat: 10,
        price: 500,
        id: '',
      },
    ],
    id: '',
  };

  const mockOrderService = {
    createOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an order successfully', async () => {
      const expectedResult: ReturnOrdersDto = {
        total: 1,
        items: [mockTicket],
      };

      mockOrderService.createOrder.mockResolvedValue(expectedResult);

      const result = await controller.create(mockCreateOrderDto);

      expect(result).toEqual(expectedResult);
      expect(service.createOrder).toHaveBeenCalledWith(mockCreateOrderDto);
      expect(service.createOrder).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple tickets in order', async () => {
      const multipleTicketsOrder: CreateOrdersDto = {
        ...mockCreateOrderDto,
        tickets: [
          ...mockCreateOrderDto.tickets,
          {
            film: '123e4567-e89b-12d3-a456-426614174000',
            session: 'session-1',
            daytime: '2024-01-20T19:00:00Z',
            row: 5,
            seat: 11,
            price: 500,
            id: '',
          },
        ],
      };

      const expectedResult: ReturnOrdersDto = {
        total: 2,
        items: [mockTicket, { ...mockTicket, id: 'ticket-2', seat: 11 }],
      };

      mockOrderService.createOrder.mockResolvedValue(expectedResult);

      const result = await controller.create(multipleTicketsOrder);

      expect(result).toEqual(expectedResult);
      expect(service.createOrder).toHaveBeenCalledWith(multipleTicketsOrder);
    });

    it('should return error when tickets already exist', async () => {
      const expectedResult: ReturnError = {
        error: 'Билеты с такими данными уже существует',
      };

      mockOrderService.createOrder.mockResolvedValue(expectedResult);

      const result = await controller.create(mockCreateOrderDto);

      expect(result).toEqual(expectedResult);
      expect(service.createOrder).toHaveBeenCalledWith(mockCreateOrderDto);
    });

    it('should return error when schedule not found', async () => {
      const expectedResult: ReturnError = {
        error: 'Schedule with ID session-1 not found',
      };

      mockOrderService.createOrder.mockResolvedValue(expectedResult);

      const result = await controller.create(mockCreateOrderDto);

      expect(result).toEqual(expectedResult);
      expect(service.createOrder).toHaveBeenCalledWith(mockCreateOrderDto);
    });

    it('should return error when daytime mismatch', async () => {
      const expectedResult: ReturnError = {
        error: 'Daytime mismatch for session session-1',
      };

      mockOrderService.createOrder.mockResolvedValue(expectedResult);

      const result = await controller.create(mockCreateOrderDto);

      expect(result).toEqual(expectedResult);
      expect(service.createOrder).toHaveBeenCalledWith(mockCreateOrderDto);
    });

    it('should handle empty tickets array', async () => {
      const emptyTicketsOrder: CreateOrdersDto = {
        ...mockCreateOrderDto,
        tickets: [],
      };

      const expectedResult: ReturnOrdersDto = {
        total: 0,
        items: [],
      };

      mockOrderService.createOrder.mockResolvedValue(expectedResult);

      const result = await controller.create(emptyTicketsOrder);

      expect(result).toEqual(expectedResult);
      expect(service.createOrder).toHaveBeenCalledWith(emptyTicketsOrder);
    });
  });
});
