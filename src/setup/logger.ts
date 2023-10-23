import winston from 'winston';
import { Reporter, TestCase, TestError, TestResult } from '@playwright/test/reporter';

const colors = {
  info: 'blue',
  error: 'red',
};
winston.addColors(colors);

export const fileLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp(),
    winston.format.printf(({ timeStamp, level, message }) => {
      return `${timeStamp} [${level}]: ${message}`;
    }),
  ),
  transports: [new winston.transports.File({ filename: 'logs/execution.log', level: 'info' })],
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    }),
  ),
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'logs/execution.log', level: 'info' })],
});

export default class TestLogger implements Reporter {
  onTestBegin(test: TestCase): void {
    logger.info(`Test Case Started : ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status === 'passed') {
      logger.info(`\x1b[32mTest Case Passed : ${test.title}\x1b[0m`); // Green color
    } else if (result.status === 'skipped') {
      logger.info(`\x1b[33mTest Case Skipped : ${test.title}\x1b[0m`); // Yellow color
    } else if (result.status === 'failed' && result.error) {
      fileLogger.error(`Test Case Failed: ${test.title} Error: ${result.error.message}`);
    }
  }

  onError(error: TestError): void {
    logger.error(error.message);
  }
}
