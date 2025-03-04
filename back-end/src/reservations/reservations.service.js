const knex = require("../db/connection");

// GET /reservations?date
function list(param) {
  return knex("reservations")
    .where("reservation_date", param)
    .whereNot("status", "finished")
    .orderBy("reservation_time");
}
// POST /reservations
function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRes) => createdRes[0]);
}
// GET /reservations/:reservation_id
function read(resID) {
  return knex("reservations").where("reservation_id", resID);
}
// PUT /reservations/:reservation_id/status
function updateReservationStatus(resID, data) {
  return knex("reservations")
    .select("*")
    .where("reservation_id", resID)
    .update(data, "*")
    .then((updatedRes) => updatedRes[0]);
}
// GET /reservations?mobile_number
function searchByPhoneNumber(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`,
    )
    .orderBy("reservation_date");
}
// PUT /reservations/:reservation_id
function update(resID, data) {
  return knex("reservations")
    .select("*")
    .where("reservation_id", resID)
    .update(data, "*")
    .then((updatedRes) => updatedRes[0]);
}

module.exports = {
  list,
  create,
  read,
  updateReservationStatus,
  searchByPhoneNumber,
  update,
};
