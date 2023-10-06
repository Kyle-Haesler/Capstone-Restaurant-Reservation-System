const knex = require("../db/connection")


function list(param){
    return knex("reservations").where("reservation_date", param).orderBy("reservation_time")
}
function create(reservation){
    return knex("reservations").insert(reservation).returning("*").then((createdRes) => createdRes[0])
}
function read(resID){
    return knex("reservations").where("reservation_id", resID)
}
function update(resID, data){
    return knex("reservations").select("*").where("reservation_id", resID).update(data, "*")
}

module.exports = {
    list,
    create,
    read,
    update
    
}