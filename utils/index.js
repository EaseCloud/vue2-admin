import dateFormat from 'dateformat'

export default {
  dateFormat,
  today(format = 'yyyy-mm-dd') {
    return dateFormat(new Date(), format);
  },
  yesterday(format = 'yyyy-mm-dd') {
    return dateFormat(new Date() - 24 * 3600 * 1000, format);
  }
};
