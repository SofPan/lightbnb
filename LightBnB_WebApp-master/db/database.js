const properties = require("./json/properties.json");
// const users = require("./json/users.json");

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Helpers
const convertStringToNumber = (stringToConvert) => {
  return Number(stringToConvert);
};

const convertCentsToDollar = (cents) => {
  return cents / 100;
};

const convertDollarsToCents = (dollars) => {
  return dollars * 100;
};


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = (email) => {
  return pool.query(`SELECT * FROM users WHERE email = $1`, [email])
    .then(res => res.rows[0] || null)
    .catch(err => console.log('getUserWithEmail error', err.message));
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = (id) => {
  return pool.query(`SELECT * FROM users WHERE id = $1`, [id])
    .then(res => res.rows[0] || null)
    .catch(err => console.log('getUserWithId error', err.message));
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = (user) => {
  const queryStatement = `
  INSERT INTO users(name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [user.name, user.email, user.password];
  return pool.query(queryStatement, values)
    .then(res => res.rows)
    .catch(err => console.log("addUser error", err.message));
};
/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = (guestId, limit = 10) => {
  const queryStatement = `
    SELECT reservations.*, properties.*, avg(rating) as average_rating
    FROM reservations
    JOIN properties ON properties.id = property_id
    JOIN property_reviews ON reservations.id = reservation_id
    WHERE reservations.guest_id = $1
    GROUP BY reservations.id, properties.id
    ORDER BY start_date
    LIMIT $2;
  `;
  const values = [guestId, limit];
  return pool
    .query(queryStatement, values)
    .then(res => res.rows)
    .catch(err => console.log('getAllReservations error:', err.message));
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  const queryParams = [];
  let queryString = `
    SELECT properties.*, AVG(property_reviews.rating) AS average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `AND owner_id = $${queryParams.length} `;
  }

  queryString += `
  GROUP BY properties.id
  `;

  // if no minimum or maximum is set, use defaults, else convert
  const minimumPrice = !options.minimum_price_per_night ? 0 : convertDollarsToCents(convertStringToNumber(options.minimum_price_per_night));

  const maximumPrice = !options.maximumPrice ? 1000000000 : convertDollarsToCents(convertStringToNumber(options.maximum_price_per_night));

  queryParams.push(minimumPrice);
  queryParams.push(maximumPrice);

  queryString += `
    HAVING cost_per_night >= $${queryParams.length - 1} 
    AND cost_per_night <= $${queryParams.length} 
  `;

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `AND AVG(property_reviews.rating) >= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `ORDER BY cost_per_night
    LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams)
    .then(res => res.rows)
    .catch(err => console.log("getAllProperties error:", err.message));
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = (property) => {
  let queryStatement = `
    INSERT INTO properties (
      title,
      description,
      number_of_bedrooms,
      number_of_bathrooms,
      parking_spaces,
      cost_per_night,
      thumbnail_photo_url,
      cover_photo_url,
      street,
      country,
      city,
      province,
      post_code,
      owner_id
      )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;

  const values = [];
  for (const prop in property) {
    if (
      prop === "number_of_bedrooms"
      || prop === "number_of_bathrooms"
      || prop === "parking_spaces"
    ) {
      property[prop] = convertStringToNumber(property[prop]);
    }
    values.push(property[prop]);
  }

  return pool.query(queryStatement, values)
    .then(res => res.rows)
    .catch(err => console.log("addProperty error", err.message));
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
