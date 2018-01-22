var dbInterface = require('../db/config');

/* these functions are called by api.js and query the database.
They send back JSON to the callback provided. */

//user
var User = dbInterface.db.Model.extend({
  tableName: 'users',

  //has one company
  company: function() {
    return this.hasOne(Company);
  },

  //has many work orders
  work_orders: function() {
    return this.belongsToMany(WorkOrder);
  }

});

//work orders
var WorkOrder = dbInterface.db.Model.extend({
  tableName: 'work_orders',

  //has one client id
  clients: function() {
    return this.hasOne(Client);
  },

  //has one company id
  companies: function() {
    return this.hasOne(Company);
  },

  //has many users
  users: function() {
    return this.belongsToMany(User);
  }

});

//Company - We did not end up using this table (add in future)

// var Company = dbInterface.db.Model.extend({
//   tableName: 'companies',
// });

//Client- We did not end up using this table (add in future)

// var Client = dbInterface.db.Model.extend({
//   tableName: 'clients',
// });


//Work Order Users Join table - did not use (add in future)

// var WorkOrdersUsers = dbInterface.db.Model.extend({
//   tableName: 'work_orders_users'
// });

//----------------------query functions------------------------

//------User queries---------


//get all User data

//pass in user ID, returns data model for user
//queryObj is an object with conditions.
//examples:
/*
  getUser({
    id: 1
  });

  getUser({
    username: 'HimanshuP@gmail.com'
  });
*/
exports.getUser = function (queryObj, cb) {
  new User(queryObj)
    .fetch()
    .then( function(model) {
      cb(model);
    });
};

//add new user (returns new user model)
//NOTE: DO NOT INCLUDE the ID, this is an autoincrement value
//example:
/*
  addUser({
    username: 'Doug',
    password: '123abc',
    first_name: 'Doug',
    last_name: 'Lyford',
    role: 'worker' -or- 'admin',
    created_at: '<timedate>',
    photo: 'path/to/photo.jpg',
    phone: '207-xxx-xxxx',
    phone_alt: 'xxx-xxx-xxxx',
    company_id: '5' --- Foreign Key
  });
*/


//------Order queries -----------

exports.getOrders = function (cb) {
  new WorkOrder()
  .query('orderBy', 'id', 'desc')  //Sort by descending order (not using this FN currently)
  .fetchAll()
  .then(function (model) {
    cb(model);
  });
};

exports.getOrdersSelective = function (queryObj, cb) {
  new WorkOrder(queryObj)
  .query('orderBy', 'id', 'desc')
  .where(queryObj)
  .fetchAll()
  .then(function (model) {
    cb(model);
  });
};

// exports.getOrdersUsername = function (queryObj, cb) {
//   new WorkOrder(queryObj)
//   .query('orderBy', 'id', 'desc')
//   .where(queryObj)
//   .fetchAll()
//   .then(function (model) {
//     cb(model);
//   });
// };

//Create a new Work Order based on a query object.
//If database schema changes, this function does not need to change.  Can still be used this way with different schema.
exports.createOrder = function (queryObj, cb) {
  new WorkOrder(queryObj)
  .save()
  .then(function (model) {
    cb(model);
  });
};

exports.updateOrder = function (queryObj, cb) {
  //same code as createOrder, but simply do not pass in
  // {id: } in the queryObj and it will be treated as an update
  //rather than a creation.
  new WorkOrder(queryObj)
  .save()
  .then(function (model) {
    cb(model);
  });
};

exports.deleteOrder = function (queryObj, cb) {
  new WorkOrder(queryObj)
    .destroy({require: true})
    .then(function (model) {
      cb(model);
    });
};

// ------------ User Queries ---------------

//Creates new User Entry in User database.
//If user table schema changes, this function does not need to change.  It can be used with any schema.
exports.addUser = function (queryObj, cb) {
  new User(queryObj)
  .save()
  .then(function (model) {
    cb(model);
  });
};

//update user data
exports.updateUser = function (queryObj, cb) {
  new User(queryObj)
  // .where({username: queryObj.username})
  .save()
  .then(function (model) {
    cb(model);
  });
};

//get all users
exports.getAll = function (queryObj, cb) {
  new User(queryObj)
  .where(queryObj)
  .fetchAll()
  .then(function (model) {
    cb(model);
  });
};


//------SMS-Related queries---------

exports.getWorkOrderData = function(queryObj, cb) {
  new WorkOrder(queryObj)
    .fetch()
    .then( function(model) {
      cb(model);
    });
}

//------Company queries---------

/* The below queries were not used in our project as we removed the company table from our Schema and our MVP goals.  If a company table were added in the future, these can be used.

exports.getCompany = function (queryObj, cb) {
  new Company(queryObj)
    .fetch()
    .then( function(model) {
      cb(model);
    });
};

exports.addCompany = function(queryObj, cb) {
  new Company(queryObj)
    .save()
    .then( function(model) {
      cb(model);
    });
};

*/
