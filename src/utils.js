export default (url) => `${url
  .trim()
  .replace(/^https?:\/\//, '')
  .replace(/\/$/, '')
  .replace(/[^a-zA-Z0-9-]/g, '-')
}.html`;
