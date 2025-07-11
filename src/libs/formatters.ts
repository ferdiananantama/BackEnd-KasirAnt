import { DATE_FORMAT, DECIMAL_PRECISION } from "@/const";
import moment from "moment";
import { AppError, HttpCode } from "@/libs/exceptions/app-error";

export function isValidDate(dateString: string): boolean {
  return moment(dateString, DATE_FORMAT, true).isValid();
}

export function parseDateStringToDate(dateString: string): Date {
  return moment(dateString, DATE_FORMAT).toDate();
}

export function validateMonthString(month: string): boolean {
  const validMonthNames = moment.months().map((name) => name.toLowerCase());
  return validMonthNames.includes(month.toLowerCase()) ? true : false;
}

export function parseMonthStringToNumber(month: string): number {
  if (!validateMonthString(month)) {
    throw new AppError({
      statusCode: HttpCode.BAD_REQUEST,
      description: `Invalid month name '${month}', use english month name`,
    });
  }

  const date = moment(`${month} 1, 2000`, "MMMM D, YYYY");
  return date.month(); // returned number is month index
}

export function parseMonthNumberToString(month: number): string {
  if (month < 0 || month > 11) {
    throw new AppError({
      statusCode: HttpCode.BAD_REQUEST,
      description: "Month number should be between 0 and 11",
    });
  }

  const date = moment({ month: month });
  return date.format("MMMM"); // returned month name is title case
}

export function validateOrderByColumn(column: string, keys: string[]): void {
  if (!keys.includes(column)) {
    throw new AppError({
      statusCode: HttpCode.BAD_REQUEST,
      description: `Invalid column orderBy: ${column} was not valid`,
    });
  }
}

export function formatDecimal(val: number): number {
  return Number(val.toFixed(DECIMAL_PRECISION));
}

export function percentage(val: number, sumVal: number): number {
  if (!sumVal) return 0;
  return formatDecimal((val * 100) / sumVal);
}

export function searchArray<T extends Record<any, any>>(
  array: T[],
  property: string,
  query: string
): T[] {
  const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const pattern = new RegExp(".*" + escapedQuery + ".*", "i");
  return array.filter((item) => pattern.test(item[property]!));
}
