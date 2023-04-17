const { Router } = require("express");
const UsuarioManager = require("../services/users.services");
const { isValidPasswd, createHashValue } = require("../utils/encrypt");
const { generateJWT } = require("../utils/jwt");
const handlePolicies = require("../middleware/handle-policies.middleware");
const router = Router();
const manager = new UsuarioManager()


router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const findUser = await manager.getUserByMail(email)
      // console.log("USER", findUser);
      if (!findUser) {
        return res
          .status(401)
          .json({ message: `este usuario no esta registrado` });
      }
      const isValidComparePsw = await isValidPasswd(password, findUser[0].password);
      if (!isValidComparePsw) {
        return res.status(401).json({ message: `credenciales invalidas` });
      }
  
      const signUser = {
        email,
        role: findUser[0].rol,
        id: findUser[0]._id,
      };
      // console.log(signUser);
  
      const token = await generateJWT({ ...signUser });
      
      return res.cookie(
        "cookieToken", token, {
          maxAge : 60 * 60 * 1000,
          httpOnly : true,
        }
      )
      .json({ message: `welcome $${email},login success`, token });
    } catch (error) {
      console.log(
        "🚀 ~ file: session.routes.js:34 ~ router.post ~ error:",
        error
      );
    }
  });
  
router.post("/register", async (req, res) => {
    try {
      console.log("BODY ****", req.body); 
      const { nombre, apellido, mail, edad, password, rol } = req.body;
  
      const pswHashed = await createHashValue(password);
  
      const userAdd = {
        mail,
        password,
        nombre,
        apellido,
        edad,
        password: pswHashed,
        rol,
      };
      const newUser = await manager.agregarUsuario(userAdd);
  
      return res.json({
        message: `usuario creado`,
        user: newUser,
      });
    } catch (error) {
      console.log(
        "🚀 ~ file: session.routes.js:64 ~ router.post ~ error:",
        error
      );
      return res.json({ message: `${error}` });
    }
  });


router.get("/current", handlePolicies(["ADMIN"]), async (req, res) => {
    // console.log(" VALIDANDO REQ", req.user);
    return res.json({ message: `jwt en las cookies` });
  });
  

  router.get("/currentUser", handlePolicies(["USER"]), async (req, res) => {
    console.log(" VALIDANDO REQ", req.user);
    return res.json({ message: `jwt en las cookies` });
  });






module.exports = router