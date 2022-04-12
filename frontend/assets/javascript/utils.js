const redirectToPage = (link) => {
  window.location.href = link;
  return false;
}

const convertDate = (date) => {
  const year = date.slice(0, 4);
  const month = date.slice(5, 7);
  const day = date.slice(8, 10);

  return `${month}/${day}/${year}`;
};

const getDifferenceBetweenDates = (startDate, endDate) => {
  const convertStartDate = convertDate(startDate);
  const convertEndDate = convertDate(endDate);
  startDate = new Date(convertStartDate);
  endDate = new Date(convertEndDate);

  const difference = endDate.getTime() - startDate.getTime();
  const daysLeft = Math.ceil(difference / (1000 * 3600 * 24));
  return daysLeft;
};

const refreshPage = () => {
  location.reload();
}


const renderLastOffer = (offers, startPrice) => {
  const lastOffer = offers.length === 0 ? startPrice : offers[offers.length - 1].value;
  return lastOffer;
};


export { redirectToPage, convertDate, getDifferenceBetweenDates, refreshPage, renderLastOffer };