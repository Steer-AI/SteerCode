const DEBUG_LOGGING =
  typeof window !== 'undefined' ? localStorage.getItem('DEBUG_LOGGING') : false;

export class Log {
  static DEBUG(message: string, ...args: unknown[]) {
    const d = new Date();
    DEBUG_LOGGING &&
      console.debug(
        `%c[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}] [DEBUG] ${message}`,
        'background: #222; color: #bada55',
        ...args
      );
  }

  static INFO(message: string, ...args: unknown[]) {
    const d = new Date();
    console.info(
      `%c[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}] [INFO] ${message}`,
      'background: #89cff0; color: #000',
      ...args
    );
  }

  static ERROR(message: string, ...args: unknown[]) {
    const d = new Date();
    console.error(
      `%c[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}] [ERROR] ${message}`,
      'background: #e52b50; color: #fff',
      ...args
    );
  }

  static WARNING(message: string, ...args: unknown[]) {
    const d = new Date();
    console.warn(
      `%c[${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}] [WARNING] ${message}`,
      'background: #ffe135; color: #000',
      ...args
    );
  }
}
