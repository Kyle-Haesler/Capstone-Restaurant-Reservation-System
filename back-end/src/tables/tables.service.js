const knex = require("../db/connection")


function create(newTable){
    return knex("tables").insert(newTable).returning("*").then((createdTables) => createdTables[0])
}
function list(){
    return knex("tables").select("*").orderBy("table_name")
}
function read(tableID){
    return knex("tables").where("table_id", tableID)
}
function update(tableID, data){
    return knex("tables").select("*").where("table_id", tableID).update(data, "*")
}
function destroy(tableID){
    return knex("tables").select("*").where("table_id", tableID).update({reservation_id: null}, "*")
}
// grabbing reservation ID to find the number of people and validate it exists as well
function readRes(resID){
    return knex("reservations").where("reservation_id", resID)
}

module.exports = {
    list,
    create,
    read,
    update,
    delete: destroy,
    readRes
}