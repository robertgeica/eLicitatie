const redirectToPage = (link) => {
  window.location.href = link;
  return false;
}

export { redirectToPage };