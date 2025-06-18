/** @format */

export class FormatUtils {
  /**
   * Format ngày theo định dạng dd/MM/yyyy
   * @param date - Date object hoặc ISO string
   * @param locale - Mặc định là 'vi-VN'
   * @returns chuỗi ngày đã format, ví dụ: "05/06/2025"
   */
  static formatDate(
    date: Date | string,
    locale: string = "vi-VN",
    isShowTime: boolean = false
  ): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      ...(isShowTime && {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
    });
  }
  static formatPriceVND(value: number): string {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    });
  }
}
