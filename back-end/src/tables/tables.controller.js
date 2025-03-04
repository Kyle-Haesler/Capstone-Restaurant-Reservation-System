const tablesService = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const requiredProperties = ["table_name", "capacity"];
// ensures body data is A. there and B. has the required properties for creation of a new table
function bodyDataComplete(req, res, next) {
  if (!req.body.data) {
    next({
      status: 400,
      message: "Must include a data property in body",
    });
  }

  const requestData = req.body.data;
  for (let property of requiredProperties) {
    if (!requestData[property] || requestData[property.trim() === ""]) {
      next({
        status: 400,
        message: `Missing or empty property: ${property}`,
      });
    }
  }
  return next();
}
// ensures capacity is a positive number
function validCapacity(req, res, next) {
  const { capacity } = req.body.data;
  if (typeof capacity === "string" || capacity <= 0) {
    next({
      status: 400,
      message: "Invalid value for 'capacity'. Must be a positive number.",
    });
  }
  return next();
}
// ensures table_name is atleast two characters
function validTableName(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.trim().length < 2) {
    next({
      status: 400,
      message: "table_name must be atleast two characters in length.",
    });
  }
  return next();
}

// ensures the table does in fact exist
async function tableExists(req, res, next) {
  const tableId = req.params.table_id;
  const data = await tablesService.read(tableId);
  if (data.length === 0) {
    return next({
      status: 404,
      message: `Table Id ${tableId} does not exist.`,
    });
  }
  res.locals.table = data[0];
  next();
}

// ensures data property is present
function dataExists(req, res, next) {
  if (!req.body.data) {
    next({
      status: 400,
      message: "Must include a data property in body.",
    });
  }
  return next();
}
// ensures a reservation_id property is present for status change request
function reservationIdPresent(req, res, next) {
  if (!req.body.data.reservation_id) {
    next({
      status: 400,
      message: "Please include a reservation_id property in your request",
    });
  }
  return next();
}
// ensures the reservation actually exists
async function reservationExists(req, res, next) {
  const resID = req.body.data.reservation_id;
  const data = await tablesService.readRes(resID);
  if (data.length === 0) {
    return next({
      status: 404,
      message: `Reservation Id ${resID} does not exist.`,
    });
  }
  res.locals.reservation = data[0];
  next();
}

// ensures reservation isn't already seated before trying to seat
function reservationNotAlreadySeated(req, res, next) {
  const resStatus = res.locals.reservation.status;
  if (resStatus === "seated") {
    return next({
      status: 400,
      message: "This reservation has already been seated.",
    });
  }
  next();
}
// ensures a table has room for the reservation before attempting to seat
function tableHasCapacity(req, res, next) {
  const resParty = res.locals.reservation.people;
  const capacity = res.locals.table.capacity;
  if (resParty > capacity) {
    return next({
      status: 400,
      message:
        "The table does not have the capacity to fit this reservation, please try a different table.",
    });
  }
  next();
}
// ensures table is open when attempting to seat a reservation
function tableIsOpen(req, res, next) {
  const status = res.locals.table.reservation_id;
  if (status) {
    return next({
      status: 400,
      message:
        "This table is currently occupied, please select a different table.",
    });
  }
  next();
}
// ensures a table is occupied before attempting to finish
function tableIsNotSeated(req, res, next) {
  const status = res.locals.table.reservation_id;
  if (!status) {
    return next({
      status: 400,
      message:
        "This table is not occupied, please select a different table to finish.",
    });
  }
  next();
}

// PRIMARY FUNCTIONS
async function create(req, res, next) {
  const data = await tablesService.create(req.body.data);
  res.status(201).json({ data });
}
async function list(req, res, next) {
  const data = await tablesService.list();
  res.json({ data });
}
function read(req, res, next) {
  const table = res.locals.table;
  res.json({ data: table });
}
async function reserveAndChangeStatus(req, res, next) {
  const tableId = req.params.table_id;
  const resId = res.locals.reservation.reservation_id;
  const status = "seated";
  const data = await tablesService.reserveAndChangeStatus(
    tableId,
    resId,
    status,
  );
  res.json({ data });
}
async function destroy(req, res, next) {
  const tableId = req.params.table_id;
  const status = "finished";
  const data = await tablesService.delete(tableId, status);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    bodyDataComplete,
    validCapacity,
    validTableName,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(tableExists), read],
  update: [
    dataExists,
    reservationIdPresent,
    asyncErrorBoundary(reservationExists),
    reservationNotAlreadySeated,
    asyncErrorBoundary(tableExists),
    tableHasCapacity,
    tableIsOpen,
    asyncErrorBoundary(reserveAndChangeStatus),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    tableIsNotSeated,
    asyncErrorBoundary(destroy),
  ],
};
