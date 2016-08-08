var User = require('./users.js');
var CurioSchema = require('./Curio.model.js');
var CurrentIDSchema = require('./CurrentID.model.js');
var mongoose = require('mongoose');
var path = require('path');
//var configAuth = require('./auth.js') ttaco

require('./passport.js');
module.exports = function(app, passport) {
    app.post('/login', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/'
        }));

    app.get('/api/user_data', function(req, res) {

        if (req.user === undefined) {
            // The user is not logged in
            res.json({
                username: null
            });
        } else {
            res.json({
                username: req.user
            });

        }
    });

    app.get('/api/user_data2', function(req, res) {

        if (req.user === undefined) {
            // The user is not logged in
            res.json({
                username: null
            });
        } else {
            res.json({
                username: req.user
            });

        }
    });

    app.get('/api/curios', function(req, res) {
CurioSchema.find(function(err, CurioSchemas){
  res.json(CurioSchemas);
});
    });

app.post('/api/addCurio', function(req, res) {



//mongoose.connect(process.env.MONGOLAB_URI);
var newCurio = new CurioSchema({
  title: req.body.title,
  description: req.body.description,
  userName: req.user.facebook.name,
  userID: req.user.facebook.id,
  tradeOffered: []
});

newCurio.save(function(err, data){
  if (err){console.log(err);}
  else{res.redirect('/');}
});

});

app.post('/api/iWantThis/:id', function(req, res) {

//query db for user
//req.user.facebook.id
 User.findOne({"facebook.id": req.user.facebook.id}, function(err, user){
  if (err) {console.log(err)} else {
    if(user.facebook.city){var tradeCity = user.facebook.city} else {var tradeCity = "Not Specified"}
        if(user.facebook.state){var tradeState = user.facebook.state} else {var tradeState = "Not Specified"}
            if(user.facebook.whereITrade){var tradeWhere = user.facebook.whereITrade} else {var tradeWhere = "Not Specified"}

    var tradeData = [user.facebook.name, tradeCity, tradeState, tradeWhere, user.facebook.id]
    CurioSchema.update({_id: req.params.id}, {$push: {"tradeOfferedBy": tradeData}},{safe: true, upsert: true, new : true},
        function(err, model) {
          if(err){console.log(err)}else{res.redirect('/')};
        })
  }
})

});


app.get('/api/curio/:id', function(req, res) {
  console.log(req.params.id)
  var idStuff = req.params.id;
CurioSchema.findOne({"_id": idStuff},function(err, curio){
  console.log(curio);
  if (err) {
    console.log(err)
  }else{
    res.json({curio});

  }
})

});


app.post('/api/updateUser/', function(req, res) {

  User.update({"facebook.id": req.user.facebook.id}, {"facebook.city": req.body.City, "facebook.state": req.body.State, "facebook.whereITrade": req.body.Location},{safe: true, upsert: true, new : true},
      function(err, model) {
        if(err){console.log(err)}else{res.redirect('/')};
      })

});

app.post('/api/accept/:id/:uID', function(req, res) {

  var itemID = req.params.id
    var userID = req.params.uID
  CurioSchema.update({"_id": itemID}, {"tradedToID": userID, userName: '', userID: ''},{safe: true, upsert: true, new : true},
      function(err, model) {
        if(err){console.log(err)}else{res.redirect('/')};
      })

});

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('*', function(req, res){
      res.sendFile(path.resolve(__dirname,'build','index.html'));
    })

};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}
