import { JsonLogger } from './json.logger';

describe('JsonLogger test', () => {
  let logger: JsonLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log message in json format', () => {
    const message = 'json message';
    logger.log(message);
    const expectedData = JSON.stringify({
      level: 'log',
      message,
      optionalParams: [],
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(expectedData);
  });

  it('should log message with optional params in json format', () => {
    const message = 'json message';
    const params = ['param1', { key: 'value' }, 123];
    logger.log(message, ...params);
    const expectedData = JSON.stringify({
      level: 'log',
      message,
      optionalParams: params,
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(expectedData);
  });

  it('should log error in json format', () => {
    const message = 'json error message';
    logger.error(message);
    const expectedData = JSON.stringify({
      level: 'error',
      message,
      optionalParams: [],
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(expectedData);
  });

  it('should log warning in json format', () => {
    const message = 'json warning message';
    logger.warn(message);
    const expectedData = JSON.stringify({
      level: 'warn',
      message,
      optionalParams: [],
    });
    expect(consoleWarnSpy).toHaveBeenCalledWith(expectedData);
  });

  it('should log debug in json format', () => {
    const message = 'json debug message';
    logger.debug(message);
    const expectedData = JSON.stringify({
      level: 'debug',
      message,
      optionalParams: [],
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(expectedData);
  });

  it('should log verbose in json format', () => {
    const message = 'json verbose message';
    logger.verbose(message);
    const expectedData = JSON.stringify({
      level: 'verbose',
      message,
      optionalParams: [],
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(expectedData);
  });

  it('should log fatal in json format', () => {
    const message = 'json fatal message';
    logger.fatal(message);
    const expectedData = JSON.stringify({
      level: 'fatal',
      message,
      optionalParams: [],
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(expectedData);
  });
});
