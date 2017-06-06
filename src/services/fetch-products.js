/* global fetch */
import config from '../../config/index.json';

const BASE_URL = `${config.apiBase}/${config.apiKey}/`;

export default (pageNumber, pageCount) => fetch(
  `${BASE_URL}/${pageNumber}/${pageCount}`
)
  .then((response) => {
    if (!response.ok) {
      throw new Error(
        `Products fetch error ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  });
