import { TskvLogger } from './tskv.logger';

describe('TskvLogger tests', () => {
  let logger: TskvLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log message in tskv format', () => {
    const message = 'tskv message';
    logger.log(message);
    const expectedString = `level=log\tmessage=${message}\toptionalParams=\n`;
    expect(consoleLogSpy).toHaveBeenCalledWith(expectedString);
  });

  it('should log message with optional params in tskv format', () => {
    const message = 'tskv message';
    const params = ['param1', 'param2'];
    logger.log(message, ...params);
    const expectedString = `level=log\tmessage=${message}\toptionalParams=${params.join(',')}\n`;
    expect(consoleLogSpy).toHaveBeenCalledWith(expectedString);
  });

  it('should log error in tskv format', () => {
    const message = 'tskv error message';
    logger.error(message);
    const expectedString = `level=error\tmessage=${message}\toptionalParams=\n`;
    expect(consoleErrorSpy).toHaveBeenCalledWith(expectedString);
  });

  it('should log warning in tskv format', () => {
    const message = 'tskv warning message';
    logger.warn(message);
    const expectedString = `level=warn\tmessage=${message}\toptionalParams=\n`;
    expect(consoleWarnSpy).toHaveBeenCalledWith(expectedString);
  });

  it('should log debug in tskv format', () => {
    const message = 'tskv debug message';
    logger.debug(message);
    const expectedString = `level=debug\tmessage=${message}\toptionalParams=\n`;
    expect(consoleLogSpy).toHaveBeenCalledWith(expectedString);
  });

  it('should log verbose in tskv format', () => {
    const message = 'tskv verbose message';
    logger.verbose(message);
    const expectedString = `level=verbose\tmessage=${message}\toptionalParams=\n`;
    expect(consoleLogSpy).toHaveBeenCalledWith(expectedString);
  });

  it('should log fatal in tskv format', () => {
    const message = 'tskv fatal message';
    logger.fatal(message);
    const expectedString = `level=fatal\tmessage=${message}\toptionalParams=\n`;
    expect(consoleLogSpy).toHaveBeenCalledWith(expectedString);
  });

  it('should handle complex optional params', () => {
    const message = 'complex params';
    const params = [{ key: 'value' }, [1, 2, 3], null, undefined];
    logger.log(message, ...params);
    const expectedString = `level=log\tmessage=${message}\toptionalParams=${params.join(',')}\n`;
    expect(consoleLogSpy).toHaveBeenCalledWith(expectedString);
  });
});
