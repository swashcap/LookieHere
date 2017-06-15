/* global fetch */

/**
 * Fetch products from a URL.
 * @module
 *
 * @param {string} url URL to fetch
 * @param {string} sanitizedURL URL to log if an error occurs
 * @returns {Promise}
 */
export default (url, sanitizedURL) => fetch(url).then((response) => {
  if (!response.ok) {
    throw new Error(
      `Fetch error:
  URL: ${sanitizedURL}
  Status: ${response.status}
  Message: ${response.statusText}
`
    );
  }

  return response.json();
});

