import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { ReturnFilms, ReturnSchedules, ReturnError } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  const mockFilm = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    rating: 8.5,
    director: 'Christopher Nolan',
    tags: ['sci-fi', 'thriller'],
    title: 'Inception',
    about: 'A mind-bending thriller',
    description: 'A thief who steals corporate secrets...',
    image: 'inception.jpg',
    cover: 'inception-cover.jpg',
    schedule: [
      {
        id: 'schedule-1',
        daytime: '2024-01-20T19:00:00Z',
        hall: 1,
        rows: 10,
        seats: 20,
        price: 500,
        taken: ['1:5', '2:6'],
      },
    ],
  };

  const mockFilmsService = {
    findAll: jest.fn(),
    findScheduleById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findFilmsAll', () => {
    it('should return all films', async () => {
      const expectedResult: ReturnFilms = {
        total: 1,
        items: [mockFilm],
      };

      mockFilmsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findFilmsAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no films exist', async () => {
      const expectedResult: ReturnFilms = {
        total: 0,
        items: [],
      };

      mockFilmsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findFilmsAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findFilmScheduleById', () => {
    it('should return film schedule by id', async () => {
      const filmId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedResult: ReturnSchedules = {
        total: 1,
        items: mockFilm.schedule,
      };

      mockFilmsService.findScheduleById.mockResolvedValue(expectedResult);

      const result = await controller.findFilmScheduleById({ id: filmId });

      expect(result).toEqual(expectedResult);
      expect(service.findScheduleById).toHaveBeenCalledWith(filmId);
      expect(service.findScheduleById).toHaveBeenCalledTimes(1);
    });

    it('should return error when film not found', async () => {
      const filmId = 'non-existent-id';
      const expectedResult: ReturnError = {
        error: 'По заданному id данные не найдены',
      };

      mockFilmsService.findScheduleById.mockResolvedValue(expectedResult);

      const result = await controller.findFilmScheduleById({ id: filmId });

      expect(result).toEqual(expectedResult);
      expect(service.findScheduleById).toHaveBeenCalledWith(filmId);
    });

    it('should handle empty schedule', async () => {
      const filmId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedResult: ReturnSchedules = {
        total: 0,
        items: [],
      };

      mockFilmsService.findScheduleById.mockResolvedValue(expectedResult);

      const result = await controller.findFilmScheduleById({ id: filmId });

      expect(result).toEqual(expectedResult);
      expect(service.findScheduleById).toHaveBeenCalledWith(filmId);
    });
  });
});
