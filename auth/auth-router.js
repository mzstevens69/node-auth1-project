const bcrypt = require("bcryptjs");

const router = require("express").Router();

const Users = require("../users/users-model");

// router.get("/secret", (req, res, next) => {
//     if (req.headers.authorization) {
//         bcrypt.hash(req.headers.authorization, 12, (err, hash) => {
          
//             if (err) {
//                 res.status(500).json({ errorMessage: "it is not working" });
//             } else {
//                 res.status(200).json({ hash });
//             }
//         });
//     } else {
//         res.status(400).json({ error: "missing header" });
//     }
// });

router.post("/register", (req, res) => {
    let user = req.body;

    const hash = bcrypt.hashSync(req.body.password, 12);

    user.password = hash;

    Users.add(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.post("/login", (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                // if (user) {
                // compare().then(match => {
                //   if (match) {
                //     // good password
                //   } else {
                //     // they don't match
                //   }
                // }).catch()
                req.session.username = user.username
                res.status(200).json({ message: `You are now Logged in ${user.username}!` });
            } else {
                res.status(401).json({ message: "Invalid Credentials" });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});
router.get ('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.status(500).json({ message: "you don't have to go home, but you can't stay here!"})
        } else {
          res.status(204).end()
          //res.status(200).json({ message: 'bye bye now'})
        }
      })
    } else {
      res.status(200).json({ bye: "you were never here!" })
    }
  })



module.exports = router;