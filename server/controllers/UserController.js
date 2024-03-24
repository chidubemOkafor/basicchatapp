const {User} = require("../schema/schema")
require("dotenv").config()
const bcrypt = require("bcrypt")

const SALT_ROUND = 10;

class UserController {
    static async CreateAccount (req,res) {
        try {
            const {username, email, password, socket_id} = req.body

            // checks if account with username already exists 
            const exists = await User.findOne({username})
            if(exists) {
                return res.status(409).json({message: "user already exists"})
            }

            //checks if email already exists
            const emailExists = await User.findOne({email})
            if(emailExists) {
                return res.status(409).json({message: "email already exists"})
            }

           const salt = await bcrypt.genSalt(SALT_ROUND)
           const hashpassword = await bcrypt.hash(password,salt)

           const createAccount = new User({username, email, password: hashpassword, socket_id})
           const account = await createAccount.save();

           res.status(200).json({message: "user saved", data: account})

        } catch (error) {
            console.error(error)
            res.status(500).json({message: "internal server error", data: error})
        }
    }

    static async Login (req,res) {
        try {
            const { username, password } = req.body
            const account = await User.findOne({ username })
            if (!account) {
               return res.status(404).json({message: "account not found"})
            }

            const passwordMatch = await bcrypt.compare(password, account.password)

            if(!passwordMatch) {
               return  res.status(401).json({message: "incorrect pasword"})
            }

            res.status(200).json({message: "login success", data: account})
            
        } catch (error) {
            console.error(error)
            res.status(500).json({message: "internal server error", data: error})
        }
    }

    static async getUsers (req,res) {
        try {
            const {userId} = req.params
            const {searchName} = req.query
            if(!searchName) {
                res.status(400).json({message: "name is required"})
            }
            const users = await User.find({ _id: { $ne: userId } });

            const user = users.filter((user) => user.username.toLowerCase().includes(searchName.toLowerCase()))
            res.status(200).json({message: "user found", data: user})
        } catch (error) {
            console.log(error)
            res.status(500).json({message: "internal server error", data: error})
        }
    }
}

module.exports = UserController