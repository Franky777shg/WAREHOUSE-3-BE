const { db } = require("../database");
const { createToken, verifyToken } = require("../helpers/jwt");
const { sendEmail } = require("../helpers/sendMail");
const crypto = require("crypto");
const BASE_URL = "http://localhost:3000";

module.exports = {
  userLogin: (req, res) => {
    const { email, password } = req.body;
    const hashPassword = crypto
      .createHmac("sha1", process.env.SECRET_KEY)
      .update(req.body.password)
      .digest("hex");

    const getUserDataQuery = `SELECT * from user WHERE email='${email}' AND password='${hashPassword}'`;
    db.query(getUserDataQuery, (err, result) => {
      if (err) res.status(400).send(err);
      if (result.length === 0) {
        res.status(200).send({ status: "failed", message: "User not found" });
      } else {
        let token = createToken({
          idUser: result[0].id_user,
        });

        res.status(200).send({ status: "success", data: result[0], token });
      }
    });
  },
  keepLogin: (req, res) => {
    let idUser = req.user.idUser;
    const getUserDataQuery = `SELECT * from user WHERE id_user='${idUser}'`;
    db.query(getUserDataQuery, (err, result) => {
      if (err) res.status(400).send(err);
      if (result.length === 0) {
        res.status(200).send({ status: "failed", message: "User not found" });
      } else {
        console.log(result);
        res.status(200).send(result);
      }
    });
  },
  userRegister: (req, res) => {
    const userData = req.body;
    let emailBody = `<a href='${BASE_URL}/auth/verification/${userData.email}' target='_blank'> Click to verif your account </a>`;

    req.body.password = crypto
      .createHmac("sha1", process.env.SECRET_KEY)
      .update(req.body.password)
      .digest("hex");

    const registerQuery = `INSERT INTO user(username, password, email, full_name, gender, age, profile_picture, status_verified) values ('${userData.username}', '${userData.password}', '${userData.email}', '${userData.name}', '', '', '', 'pending')`;

    db.query(registerQuery, (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }

      sendEmail(userData.email, "Confirmation", emailBody);
      res.status(200).send({ status: "success", message: userData.email });
    });
  },

  accountVerification: (req, res) => {
    let isUserExist = false;
    const checkQuery = `SELECT * FROM user where email='${req.params.verifEmail}' AND status_verified='pending' `;
    const checkRegisteredAccount = db.query(checkQuery, (error, result) => {
      isUserExist = true;
    });

    if (checkRegisteredAccount) {
      db.query(
        `UPDATE user set status_verified ='active' WHERE email='${req.params.verifEmail}'`,
        (error2, result2) => {
          res.status(200).send({ message: "success", data: result2 });
        }
      );
    }
  },

  changePass: (req, res) => {
    const { password } = req.body
    
    //buat input password jadi hash
    // password = crypto
    // .createHmac("sha1", process.env.SECRET_KEY)
    // .update(password)
    // .digest("hex");

    const updatePass = `update user set password =${db.escape(password)} where id_user=${req.params.id};`

    db.query(updatePass, (errChangePass, resultChangePass) => {
        if (errChangePass) {
            console.log(errChangePass)
            res.status(400).send(errChangePass)
        }

        res.status(200).send(resultChangePass)
    })
  },

  getUserAddress : (req,res) => {
    let idUser = req.user.idUser;
    let getQuerry = `SELECT *
    FROM user u
    INNER JOIN address a 
    ON u.id_user = a.id_user 
    WHERE  a.id_user  = ${idUser}`
    db.query(getQuerry, (err, result) => {
        if(err) {
            console.log(err)
            res.status(400).send(err)
        }
        res.status(200).send(result)
    })
  },

  getDataUser : (req, res) => {
    let idUser = req.user.idUser;
    let getQuerry = `SELECT * FROM user WHERE id_user = ${idUser}`
    db.query(getQuerry, (err, result) => {
        if(err) {
            console.log(err)
            res.status(400).send(err)
        }
        res.status(200).send(result)
    })
  },
  
  updateUser : (req, res) => {

   let idUser = req.user.idUser;
   const editData = req.body
   const {username ,email} = req.body

   if(!username || !email){
    res.status(400).send('Field Username Atau Email tidak boleh kosong')
    return
  }

   const updateUser = `UPDATE user SET username= '${editData.username}', full_name='${editData.full_name}', 
   email='${editData.email}', gender='${editData.gender}', age='${editData.age}' WHERE id_user = ${idUser}`
    db.query(updateUser, req.body, (err, result) => {
        if(err) { 
            console.log(err)
            res.status(400).send(err)
        }
        
        const getuser = `SELECT * FROM user WHERE id_user  = ${idUser}`
        db.query(getuser, (err2, result2) => {
            if(err2) {
                console.log(err2)
                res.status(400).send(err2)
            }
            res.status(200).send(result2)
            
          })

        // res.status(200).send(result)
      })
  },

  updateUserAddress : (req,res) => {
    const editData = req.body
    let idUser = req.user.idUser;
    const updateUserAddress = `UPDATE address 
    SET  
    address='${editData.address}', 
    kecamatan='${editData.kecamatan}', 
    kabupaten='${editData.kabupaten}', 
    status_aktif='${editData.status_aktif}' 
    WHERE id_user = ${idUser}`
    db.query(updateUserAddress, req.body, (err, result) => {
         if(err) { 
             console.log(err)
             res.status(400).send(err)
         }
         const getUserAddress = `SELECT *
         FROM user u
         INNER JOIN address a 
         ON u.id_user = a.id_user 
         WHERE  a.id_user  = ${idUser}`
         db.query(getUserAddress, (err2, result2) => {
             if(err2) {
                 console.log(err2)
                 res.status(400).send(err2)
             }
             res.status(200).send(result2)
             
           })
 
         // res.status(200).send(result)
       })
  },

  addUserAddress : (req,res) => {
    const editData = req.body
    let idUser = req.user.idUser;
    const addUserAddress = `INSERT INTO address(address, kecamatan, kabupaten, id_user)
    VALUES 
    ('${editData.address}', '${editData.kecamatan}', '${editData.kabupaten}', '${idUser}')`;
    db.query(addUserAddress, req.body, (err, result) => {
         if(err) { 
             console.log(err)
             res.status(400).send(err)
         }
         const getUserAddress = `SELECT *
         FROM user u
         INNER JOIN address a 
         ON u.id_user = a.id_user 
         WHERE  a.id_user  = ${idUser}`;
         db.query(getUserAddress, (err2, result2) => {
             if(err2) {
                 console.log(err2)
                 res.status(400).send(err2)
             }
             res.status(200).send(result2)
             
           })
 
         // res.status(200).send(result)
       })
  },

  deleteUserAddress : (req,res) => {
      // const editData = req.body
      let idUser = req.user.idUser;
      const addUserAddress = `DELETE FROM address WHERE id_user = '${idUser}'`;
      db.query(addUserAddress, req.body, (err, result) => {
          if(err) { 
              console.log(err)
              res.status(400).send(err)
          }
          const getUserAddress = `SELECT *
          FROM user u
          INNER JOIN address a 
          ON u.id_user = a.id_user 
          WHERE  a.id_user  = ${idUser}`;
          db.query(getUserAddress, (err2, result2) => {
              if(err2) {
                  console.log(err2)
                  res.status(400).send(err2)
              }
              res.status(200).send(result2)
              
            })
  
          // res.status(200).send(result)
        })
  }

};
