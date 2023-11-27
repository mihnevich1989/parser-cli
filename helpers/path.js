const getPath = (url) => {
  const indexMainDomain = (url.indexOf('.com') != -1) ? url.indexOf('.com') + 5 : url.indexOf('.ai') + 4;
  return url.substr(indexMainDomain);
};
export { getPath };
