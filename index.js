const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const expressSession = require("express-session");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const faker = require("faker");
// Our DB models
const User = require("./models/user");
const Connection = require("./models/connection");
const Bill = require("./models/bill");
const { fake } = require("faker");

mongoose.connect("mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(
  expressSession({
    secret: "telephone-billing-system",
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());
// Configuring passport in our App

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Our middleware
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") return next();
  res.redirect("/login");
};

// All our routes

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const { username, name, password } = req.body;
  User.register(new User({ username, name }), password, (error, user) => {
    if (error) {
      console.log(error);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, () => {
      res.redirect("/connections");
    });
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/connections",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/connections/new", isLoggedIn, (req, res) => {
  res.render("new");
});

app.get("/connections/:id/edit", (req, res) => {
  const { id } = req.params;
  Connection.findById(id, (error, connection) => {
    if (error) {
      console.log("Oops an error occurred while finding connection");
    }
    console.log(connection);
    res.render("edit", { connection });
  });
});

const getRandomNumber = (min, max) => {
  return Math.ceil(Math.random() * (max - min) + min);
};

app.get("/connections/:id/paybill", isLoggedIn, (req, res) => {
  const { id } = req.params;
  const billDesc = {};
  (billDesc.local = getRandomNumber(100, 2000)),
    (billDesc.isd = getRandomNumber(1000, 3000)),
    (billDesc.std = getRandomNumber(500, 1000)),
    (billDesc.total = billDesc.isd + billDesc.local + billDesc.std);
  Connection.findById(id, (error, connection) => {
    if (error) {
      console.log(
        "Oops an error occurred while finding connection by id during payment"
      );
      return;
    }
    res.render("paybill", { connection, billDesc });
  });
});

app.post("/connections/:id/paybill", (req, res) => {
  const { id } = req.params;
  const { bill } = req.body;
  console.log(bill);
  const { _id, username } = req.user;
  const owner = {
    id: _id,
    username: username,
  };
  const connection = {
    id: id,
  };
  bill.owner = owner;
  bill.connection = connection;
  bill.paymentDate = new Date();
  Bill.create(bill, (error, bill) => {
    if (error) {
      console.log("Oops an error while creating new bill");
      return;
    }
    console.log(bill);
    const newConnectionData = {
      isPaymentPending: false,
    };
    Connection.findByIdAndUpdate(id, newConnectionData, (error, connection) => {
      if (error) {
        console.log(
          "Oops an error while editing payment boolean of connection"
        );
        return;
      }
      console.log(connection);
      res.redirect("/connections");
    });
  });
});

app.get("/connections/allbills", isLoggedIn, (req, res) => {
  Bill.find({}, (error, bills) => {
    if (error) {
      console.log("Oops an error while fetching all the bills");
      return;
    }
    res.render("allbills", { bills });
  });
});

app.get("/connections/:id", isLoggedIn, (req, res) => {
  const { id } = req.params;
  Connection.findById(id, (error, connection) => {
    if (error) {
      console.log("Oops an error occurred while finding connection");
    }
    console.log(connection);
    res.render("show", { connection });
  });
});

app.put("/connections/:id", (req, res) => {
  const { id } = req.params;
  const { connection } = req.body;
  Connection.findByIdAndUpdate(id, connection, (error, connection) => {
    if (error) {
      console.log("Oops an error while editing connection");
      return;
    }
    console.log(connection);
    res.redirect("/connections");
  });
});

app.delete("/connections/:id", (req, res) => {
  const { id } = req.params;
  Connection.findByIdAndDelete(id, (error) => {
    if (error) {
      console.log("Oops an error while deleting");
      return;
    }
    res.redirect("/connections");
  });
});

app.get("/connections", isLoggedIn, (req, res) => {
  Connection.find({}, (error, connections) => {
    if (error) {
      console.log("Oops an error while fetching all the connections");
      return;
    }
    res.render("connections", { connections });
  });
});

app.get("/admin", isLoggedIn, isAdmin, (req, res) => {
  User.find({}, (error, users) => {
    if (error) {
      console.log("Oops an error while fetching all users");
      return;
    }
    res.render("admin", { users });
  });
});

app.post("/connections", (req, res) => {
  const { connection } = req.body;
  const { _id, username } = req.user;
  const owner = {
    id: _id,
    username: username,
  };
  connection.connectionName = faker.random.word();
  connection.isPaymentPending = true;
  connection.owner = owner;
  Connection.create(connection, (error, connection) => {
    if (error) {
      console.log("Oops error while creating new connection", error);
      return;
    }
    connection.save((error, connection) => {
      if (error) {
        console.log("Oops error while saving connection");
        return;
      }
      console.log(connection);
      res.redirect("/connections");
    });
  });
});

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}. Enjoy`);
});
