export default function getFullDay(day = '') {
  let getDay = day.split('T')[0].split('-');
  getDay = getDay.reverse();
  return `${getDay[0]}/${getDay[1]}/${getDay[2]}`;
}
