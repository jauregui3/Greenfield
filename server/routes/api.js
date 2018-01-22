/*
 * Serve JSON to our AngularJS client
 */

var fileToServe = require('../utility/paths');
var dbHelpers = require('../utility/dbquery');

exports.getAll = (req, res) => { // testing purpose only to get all users in db
  dbHelpers.getAll(req.body, (users) => {
    res.send(users);
  });
};

exports.getUser = (req, res) => {
  dbHelpers.getUser(req.body, (user) => {
    res.send(user);
  });
}

exports.userSignUp = (req, res) => {
  dbHelpers.addUser(req.body, (newUser) => {
    dbHelpers.getUser(req.body, (user) => {
      res.send(user);
    });
  });
};

exports.userSignIn = (req, res) => {
  dbHelpers.getUser(req.body, (user) => {
    res.send(user);
  });

};

exports.createOrder = (req, res) => {
  dbHelpers.createOrder(req.body, (order) => {
    res.send(order);
  });

};

exports.updateOrder = (req, res) => {
  dbHelpers.updateOrder(req.body, (order) => {
    res.send(order);
  });

};

exports.getOrders = (req, res) => {
  dbHelpers.getOrders((orders) => {
    res.send(orders);
  });
};

exports.getUnclaimed = (req, res) => {
  dbHelpers.getOrdersSelective({workername: null}, (orders) => {
    res.send(orders);
  });
};
exports.getCompleted = (req, res) => {
  var phone = req.params.phone;
  dbHelpers.getOrdersSelective({workerphone: phone, is_done: true}, (orders) => {
    res.send(orders);
  });
};

exports.getMyCreated = (req, res) => {
  var username = req.params.userName;
  dbHelpers.getOrdersSelective({username: username}, (orders) => {
    res.send(orders);
  });
};

exports.getMyInProgress = (req, res) => {
  var phone = req.params.phone;
  dbHelpers.getOrdersSelective({workerphone: phone, is_done: false}, (orders) => {
    res.send(orders);
  });
};

exports.getOrdersUsername = (req, res) => {
  var username = req.params.username;
  dbHelpers.getOrdersUsername({username: username}, (orders) => {
    res.send(orders);
  });
};

exports.deleteOrder = (req, res) => {
  var id = req.params.id;
  dbHelpers.deleteOrder({id: id}, (order) => {
    res.send(order);
  });
};

exports.updateUser = (req, res) => {
  dbHelpers.updateUser(req.body, (user) => {
    res.send(user);
  });
};
