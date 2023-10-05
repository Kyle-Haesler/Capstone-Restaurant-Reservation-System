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

module.exports = {
    list,
    create,
    read
}