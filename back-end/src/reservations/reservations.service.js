const knex = require("../db/connection")


function list(param){
    return knex("reservations").where("reservation_date", param).whereNot("status", "finished").orderBy("reservation_time")
}
function create(reservation){
    return knex("reservations").insert(reservation).returning("*").then((createdRes) => createdRes[0])
}
function read(resID){
    return knex("reservations").where("reservation_id", resID)
}
function update(resID, data){
    return knex("reservations").select("*").where("reservation_id", resID).update(data, "*").then((updatedRes) => updatedRes[0])
}
// GET /reservations?mobile_number
function searchByPhoneNumber(mobile_number){
    return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
    list,
    create,
    read,
    update,
    searchByPhoneNumber
    
}