import "express-async-errors";
import { Response } from "express";
import { exitHandler } from "@/libs/exit-handler";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";
import { generateTransactionCode } from "@/libs/utils/transaction-code";

interface ErrorDetail {
  type: string;
  code: string;
  trxId: string;
  stack?: string;
  details?: unknown;
}

interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  error: ErrorDetail;
}

class ErrorHandler {
  public handleError(error: Error | AppError, response?: Response): void {
    if (this.isTrustedError(error) && response) {
      this.handleTrustedError(error as AppError, response);
    } else {
      this.handleUntrustedError(error, response);
    }
  }

  public isTrustedError(error: Error): boolean {
    if (error instanceof AppError) {
      return error.isOperational;
    } else if (error instanceof SyntaxError) {
      return true;
    }

    return false;
  }

  private handleTrustedError(error: AppError, response: Response): void {
    const trxId = generateTransactionCode();

    console.log('\n====================================');
    console.log(`🔴 [ERROR][${trxId}] Trusted Error`);
    console.log('------------------------------------');
    console.log('Type     :', error.name);
    console.log('Code     :', `ERR_${error.statusCode}`);
    console.log('Message  :', error.message);
    console.log('Time     :', new Date().toISOString());
    console.log('Details  :', JSON.stringify(error.data, null, 2));
    console.log('====================================\n');

    response.status(error.statusCode).json({
      success: false,
      statusCode: error.statusCode,
      message: error.message,
      error: {
        type: error.name,
        details: error.data || null,
        code: `ERR_${error.statusCode}`,
        trxId
      },
    });
  }

  private handleUntrustedError(
    error: Error | AppError,
    response?: Response
  ): void {
    const trxId = generateTransactionCode();

    console.log('\n====================================');
    console.log(`❌ [CRITICAL][${trxId}] Untrusted Error`);
    console.log('------------------------------------');
    console.log('Type     :', error.name);
    console.log('Code     : ERR_500');
    console.log('Message  :', error.message);
    console.log('Time     :', new Date().toISOString());
    if (error instanceof AppError) {
      console.log('Details  :', JSON.stringify(error.data, null, 2));
    }
    console.log('Stack    :\n', error.stack);
    console.log('====================================\n');

    if (response) {
      const errorResponse: ErrorResponse = {
        success: false,
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        message: process.env.NODE_ENV === 'development'
          ? error.message
          : 'Internal server error',
        error: {
          type: error.name,
          code: 'ERR_500',
          trxId
        }
      };

      if (process.env.NODE_ENV === 'development') {
        errorResponse.error = {
          ...errorResponse.error,
          stack: error.stack || undefined,
          details: error instanceof AppError ? error.data : undefined
        };
      }

      response.status(HttpCode.INTERNAL_SERVER_ERROR).json(errorResponse);
    }

    exitHandler.handleExit(1);
  }
}

export const errorHandler = new ErrorHandler();
