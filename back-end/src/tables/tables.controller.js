const tablesService = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
// new table validation

const requiredProperties = [
    "table_name",
    "capacity"
  ]
  function bodyDataComplete(req, res, next){
    if(!req.body.data){
    next({
      status: 400,
      message: "Must include a data property in body"
    })
  }
  
  const requestData = req.body.data
  for(let property of requiredProperties){
    if(!requestData[property] || requestData[property.trim() === ""]){
      next({
        status: 400,
        message: `Missing or empty property: ${property}`
      })
    }
  } 
  return next()
  }
  function validCapacity(req, res, next) {
    const { capacity } = req.body.data;
    if (typeof capacity === "string" || capacity <= 0) {
      next({
        status: 400,
        message: "Invalid value for 'capacity'. Must be a positive number.",
      });
    }
    return next()
    }
    function validTableName(req, res, next){
        const {table_name} = req.body.data
        if(table_name.trim().length < 2){
            next({
                status: 400,
                message: "table_name must be atleast two characters in length."
            })
        }
        return next()
    }

// read validations
async function tableExists(req, res, next){
  const tableId = req.params.table_id
  const data = await tablesService.read(tableId)
  if(data.length === 0){
    return next({
      status: 404,
      message: `Table Id ${tableId} does not exist.`
    })
  }
  res.locals.table = data[0]
  next()
}

async function create(req, res, next){
    const data = await tablesService.create(req.body.data)
    res.status(201).json({data})
  }
async function list(req, res, next){
    const data = await tablesService.list()
    res.json({data})
}
function read(req, res, next){
  const table = res.locals.table
  res.json({data: table})
}
// PUT tables/:table_id/seat validation
function dataExists(req, res, next){
  if(!req.body.data){
    next({
      status: 400,
      message: "Must include a data property in body."
    })
  }
  return next()
}
// PUT tables/:table_id/seat
async function update(req, res, next){
  
  const tableId = req.params.table_id
  const data = await tablesService.update(tableId, req.body.data)
  res.json({data})
}
  
  
  module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        bodyDataComplete,
        validCapacity,
        validTableName,
        asyncErrorBoundary(create)
    ],
    read: [
      asyncErrorBoundary(tableExists),
      read
    ],
    update: [
      dataExists,
      asyncErrorBoundary(tableExists),
      asyncErrorBoundary(update)
    ]
  };