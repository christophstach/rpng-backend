export class EnumHelper {
  static keys(e) {
    return Object.keys(e).filter(key => typeof e[key as any] !== 'number');
  }

  static values(e) {
    return this.keys(e).map(key => e[key as any]);
  }
}