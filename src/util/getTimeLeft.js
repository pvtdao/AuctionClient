export default function formatTime(dayTime = '') {
  const getDayTime = new Date(dayTime).getTime();

  const today = new Date();
  var date =
    today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time =
    today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

  const dateNow = `${date} ${time}`;
  const getDayNow = new Date(dateNow).getTime();

  let diff = getDayTime - getDayNow;
  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);

  let hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);

  let mins = Math.floor(diff / (1000 * 60));
  diff -= mins * (1000 * 60);

  let seconds = Math.floor(diff / 1000);
  diff -= seconds * 1000;
  return {
    days,
    hours,
    mins,
    // seconds,
  };
}
