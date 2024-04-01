const { Users } = require("../models");
const jwt = require("jsonwebtoken");
const passwordHasher = require("../lib/passwordHasher");
const bcrypt = require("bcrypt");
const getUserEmail = require("../lib/getUserEmail")
require('dotenv').config();

const createUser = async (req, res) => {
    const language = req.body.language;
    try {
        await Users.create({
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            password: await passwordHasher(req),
            language: req.body.language
        }).then(data => {
            const accessToken = jwt.sign({ email: data.email}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24h'});
            if(language === "ARM") return res.status(201).json({message: "Օգտատերը հաջողությամբ ստեղծվեց!", user: data, token: accessToken})
            else if(language === "RUS") return res.status(201).json({message: "Пользователь успешно создан!", user: data, token: accessToken})
            else return res.status(201).json({message: "User successfully created!", user: data, token: accessToken})
        })
    } catch (error) {
        if(error.message === "Validation error: Validation len on username failed")
        {
            if(language === "ARM") return res.status(400).json({message: `Օգտվողի անունը պետք է լինի 2-ից ավելի և 24-ից պակաս նշան`})
            else if(language === "RUS") return res.status(400).json({message: `Имя пользователя должно содержать более 2 и менее 24 символов.`})
            else return res.status(400).json({message: `The username must be more than 2 and less than 24 symbols`})
        }
        else if(error.message === "Validation error: Choose valid the valid language: [ENG, RUS, ARM]")
        {
            if(language === "ARM") return res.status(400).json({message: `Ընտրեք վավեր լեզուն: [ENG, RUS, ARM]`})
            else if(language === "RUS") return res.status(400).json({message: `Выберите действительный язык: [ENG, RUS, ARM]`})
            else return res.status(400).json({message: `Choose the valid language: [ENG, RUS, ARM]`})
        }
        else if(error.message === "notNull Violation: Please enter the username!")
        {
            if(language === "ARM") return res.status(400).json({message: `Пожалуйста, введите имя пользователя!!`})
            else if(language === "RUS") return res.status(400).json({message: `Խնդրում ենք մուտքագրել օգտվողի անունը`})
            else return res.status(400).json({message: `Please enter the username!`})
        }
        else if(error.message === "notNull Violation: Please enter the email!")
        {
            if(language === "ARM") return res.status(400).json({message: `Խնդրում եմ մուտքագրեք էլ!`})
            else if(language === "RUS") return res.status(400).json({message: `Пожалуйста, введите адрес электронной почты!`})
            else return res.status(400).json({message: `Please enter the email!`})
        }
        else if(error.message === "Validation error: Please write the valid email!")
        {
            if(language === "ARM") return res.status(400).json({message: `Խնդրում ենք մուտքագրել վավեր էլ!`})
            else if(language === "RUS") return res.status(400).json({message: `Пожалуйста, введите действительный адрес электронной почты!`})
            else return res.status(400).json({message: `Please enter the valid email!`})
        }
        else if(error.message === "повторяющееся значение ключа нарушает ограничение уникальности \"Users_email_key\"")
        {
            if(language === "ARM") return res.status(400).json({message: `Այս նամակն արդեն օգտագործվել է, օգտագործեք ևս մեկը!`})
            else if(language === "RUS") return res.status(400).json({message: `Этот адрес электронной почты уже используется, используйте другой!`})
            else return res.status(400).json({message: `This email is alredy used, use another one!`})
        }
        else if(error.message === "notNull Violation: Please enter the phone number!")
        {
            if(language === "ARM") return res.status(400).json({message: `Խնդրում ենք մուտքագրել հեռախոսահամարը!`})
            else if(language === "RUS") return res.status(400).json({message: `Пожалуйста, введите номер телефона!`})
            else return res.status(400).json({message: `Please enter the phone number!`})
        }
        else if(error.message === "повторяющееся значение ключа нарушает ограничение уникальности \"Users_phone_key\"")
        {
            if(language === "ARM") return res.status(400).json({message: `Этот номер телефона уже используется, используйте другой!`})
            else if(language === "RUS") return res.status(400).json({message: `Այս հեռախոսահամարն արդեն օգտագործված է, օգտագործեք մեկ ուրիշը:`})
            else return res.status(400).json({message: `This phone number is alredy used, use another one!`})
        }
        else if(error.message === "notNull Violation: Please enter the password!")
        {
            if(language === "ARM") return res.status(400).json({message: `Խնդրում ենք մուտքագրել գաղտնաբառը!`})
            else if(language === "RUS") return res.status(400).json({message: `Пожалуйста, введите пароль!`})
            else return res.status(400).json({message: `Please enter the password!`})
        }
        else {
            if(language === "ARM"){
                console.log(error.message);
                return res.status(500).json({message: `Սերվերի սխալ: ${error.name}`})
            }
            else if(language === "RUS"){
                console.log(error.message);
                return res.status(500).json({message: `Ошибка сервера: ${error.name}`})
            }
            else {
                console.log(error.message);
                return res.status(500).json({message: `Server error: ${error.name}`})
            }
        }
    }
}
const getUser = async (req, res) => {
    const useremail = getUserEmail(req, res);
    const user = await Users.findOne({ where: {email: useremail}})
    const language = user.language;
    try {
        const userEmail = getUserEmail(req, res);
        if(await Users.findOne({where: {email: userEmail}})){
            await Users.findOne({where: {email: userEmail}}).then(data => { return res.status(200).json({info: data}); })
        }else {
            if(language === "ARM") return res.status(404).json({message: `Օգտատերը չի գտնվել!`});
            else if(language === "RUS") return res.status(404).json({message: `Пользователь не найден!`});
            else return res.status(404).json({message: `User not found!`});
        }
    } catch (error) {
        if(language === "ARM"){
            console.log(error.message);
            return res.status(500).json({message: `Սերվերի սխալ: ${error.name}`})
        }
        if(language === "RUS"){
            console.log(error.message);
            return res.status(500).json({message: `Ошибка сервера: ${error.name}`})
        }
        else {
            console.log(error.message);
            return res.status(500).json({message: `Server error: ${error.name}`})
        }
    }
}
const removeUser = async (req, res) => {
    const useremail = getUserEmail(req, res);
    const user = await Users.findOne({ where: {email: useremail}})
    const language = user.language;
    try {
        const userEmail = getUserEmail(req, res);
        if(await Users.findOne({where: {email: userEmail}})) {
            await Users.destroy({where: {email: userEmail}})
            if(language === "ARM") return res.status(200).json({message: "Օգտատերը հաջողությամբ ջնջվեց!"});
            else if(language === "RUS") return res.status(200).json({message: "Пользователь успешно удален!"});
            else return res.status(200).json({message: "User successfully deleted!"});
        }
        else {
            if(language === "ARM") return res.status(404).json({message: `Օգտատերը չի գտնվել!`});
            else if(language === "RUS") return res.status(404).json({message: `Пользователь не найден!`});
            else return res.status(404).json({message: `User not found!`});
        }
        
    } catch (error) {
        if(language === "ARM"){
            console.log(error.message);
            return res.status(500).json({message: `Սերվերի սխալ: ${error.name}`})
        }
        if(language === "RUS"){
            console.log(error.message);
            return res.status(500).json({message: `Ошибка сервера: ${error.name}`})
        }
        else {
            console.log(error.message);
            return res.status(500).json({message: `Server error: ${error.name}`})
        }
    }
}
const updateUser = async (req, res) => {
    const useremail = getUserEmail(req, res);
    const user = await Users.findOne({ where: {email: useremail}})
    const language = user.language;
    try {
        const userEmail = getUserEmail(req, res);
        if(await Users.findOne({where: {email: userEmail}})) {
            const userInfo = await Users.findOne({where: {email: userEmail}});
                if(req.body.password){
                const info = {
                    username: req.body.username || userInfo.username,
                    email: req.body.email || userInfo.email,
                    phone:  req.body.phone || userInfo.phone,
                    password: await passwordHasher(req),
                    language: req.body.language || userInfo.language
                }
                await Users.update(info, {where: { email: userEmail }})
                if(language === "ARM") return res.status(200).json({message: "Օգտվողը հաջողությամբ թարմացվեց!"});
                else if(language === "RUS") return res.status(200).json({message: "Пользователь успешно обновлен!"});
                else return res.status(200).json({message: "User successfully updated!"});
            }else {
                if(language === "ARM") return res.status(400).json({message: "Օգտատերը չի կարող մուտք գործել, քանի որ անհրաժեշտ է գաղտնաբառ:"});
                else if(language === "RUS") return res.status(400).json({message: "Пользователь не может войти в систему, поскольку требуется пароль."});
                else return res.status(400).json({message: "User can't log in because a password is required."});
            }
            
        } 
        else
        {
            if(language === "ARM") return res.status(404).json({message: `Օգտատերը չի գտնվել!`});
            else if(language === "RUS") return res.status(404).json({message: `Пользователь не найден!`});
            else return res.status(404).json({message: `User not found!`});
        } 

    } catch (error) {
    if(error.message === "Validation error: Validation len on username failed")
    {
        if(language === "ARM") return res.status(400).json({message: `Օգտվողի անունը պետք է լինի 2-ից ավելի և 24-ից պակաս նշան`})
        else if(language === "RUS") return res.status(400).json({message: `Имя пользователя должно содержать более 2 и менее 24 символов.`})
        else return res.status(400).json({message: `The username must be more than 2 and less than 24 symbols`})
    }
    else if(error.message === "Validation error: Choose valid the valid language: [ENG, RUS, ARM]")
    {
        if(language === "ARM") return res.status(400).json({message: `Ընտրեք վավեր լեզուն: [ENG, RUS, ARM]`})
        else if(language === "RUS") return res.status(400).json({message: `Выберите действительный язык: [ENG, RUS, ARM]`})
        else return res.status(400).json({message: `Choose the valid language: [ENG, RUS, ARM]`})
    }
    else if(error.message === "notNull Violation: Please enter the username!")
    {
        if(language === "ARM") return res.status(400).json({message: `Пожалуйста, введите имя пользователя!!`})
        else if(language === "RUS") return res.status(400).json({message: `Խնդրում ենք մուտքագրել օգտվողի անունը`})
        else return res.status(400).json({message: `Please enter the username!`})
    }
    else if(error.message === "notNull Violation: Please enter the email!")
    {
        if(language === "ARM") return res.status(400).json({message: `Խնդրում եմ մուտքագրեք էլ!`})
        else if(language === "RUS") return res.status(400).json({message: `Пожалуйста, введите адрес электронной почты!`})
        else return res.status(400).json({message: `Please enter the email!`})
    }
    else if(error.message === "Validation error: Please write the valid email!")
    {
        if(language === "ARM") return res.status(400).json({message: `Խնդրում ենք մուտքագրել վավեր էլ!`})
        else if(language === "RUS") return res.status(400).json({message: `Пожалуйста, введите действительный адрес электронной почты!`})
        else return res.status(400).json({message: `Please enter the valid email!`})
    }
    else if(error.message === "повторяющееся значение ключа нарушает ограничение уникальности \"Users_email_key\"")
    {
        if(language === "ARM") return res.status(400).json({message: `Այս նամակն արդեն օգտագործվել է, օգտագործեք ևս մեկը!`})
        else if(language === "RUS") return res.status(400).json({message: `Этот адрес электронной почты уже используется, используйте другой!`})
        else return res.status(400).json({message: `This email is alredy used, use another one!`})
    }
    else if(error.message === "notNull Violation: Please enter the phone number!")
    {
        if(language === "ARM") return res.status(400).json({message: `Խնդրում ենք մուտքագրել հեռախոսահամարը!`})
        else if(language === "RUS") return res.status(400).json({message: `Пожалуйста, введите номер телефона!`})
        else return res.status(400).json({message: `Please enter the phone number!`})
    }
    else if(error.message === "повторяющееся значение ключа нарушает ограничение уникальности \"Users_phone_key\"")
    {
        if(language === "ARM") return res.status(400).json({message: `Этот номер телефона уже используется, используйте другой!`})
        else if(language === "RUS") return res.status(400).json({message: `Այս հեռախոսահամարն արդեն օգտագործված է, օգտագործեք մեկ ուրիշը:`})
        else return res.status(400).json({message: `This phone number is alredy used, use another one!`})
    }
    else if(error.message === "notNull Violation: Please enter the password!")
    {
        if(language === "ARM") return res.status(400).json({message: `Խնդրում ենք մուտքագրել գաղտնաբառը!`})
        else if(language === "RUS") return res.status(400).json({message: `Пожалуйста, введите пароль!`})
        else return res.status(400).json({message: `Please enter the password!`})
    }
    else {
        if(language === "ARM"){
            console.log(error.message);
            return res.status(500).json({message: `Սերվերի սխալ: ${error.name}`})
        }
        else if(language === "RUS"){
            console.log(error.message);
            return res.status(500).json({message: `Ошибка сервера: ${error.name}`})
        }
        else {
            console.log(error.message);
            return res.status(500).json({message: `Server error: ${error.name}`})
        }
    }
    }
}
const loginUser = async (req, res) => {
    const user = await Users.findOne({ where: {email: req.body.email}})
    const language = user.language;
    try {
    if(req.body.email && req.body.password){
        if(await Users.findOne({where: {email: req.body.email}})){
            const info = await Users.findOne({where: {email: req.body.email}});
            bcrypt.compare(req.body.password, info.password, (err, result) => {
                if(err) {
                    if(language === "ARM") return res.status(400).json({message: `Գաղտնաբառը սխալ է!`});
                    else if(language === "RUS") return res.status(400).json({message: `Неправильный пароль!`});
                    else return res.status(400).json({message: `The password is incorrect!`});
                }
                else {
                    if(language === "ARM"){
                        if(result){
                            const accessToken = jwt.sign({ email: info.email }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24h'});
                            return res.status(200).json({message: `Դուք հաջողությամբ մուտք եք գործել!`, token: accessToken});
                        } else return res.status(400).json({message: `Գաղտնաբառը սխալ է!`});
                    }
                    else if(language === "RUS"){
                        if(result){
                            const accessToken = jwt.sign({ email: info.email }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24h'});
                            return res.status(200).json({message: `Вы успешно входите в систему!`, token: accessToken});
                        } else return res.status(400).json({message: `Неправильный пароль!`});
                    }
                    else {
                        if(result){
                            const accessToken = jwt.sign({ email: info.email }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '24h'});
                            return res.status(200).json({message: `You are successfully logging in!`, token: accessToken});
                        } else return res.status(400).json({message: `The password is incorrect!`});
                    }
            }
            })
            
        }else {
            if(language === "ARM") return res.status(404).json({message: `Օգտատերը չի գտնվել!!`});
            else if(language === "RUS") return res.status(404).json({message: `Пользователь не найден!`});
            else return res.status(404).json({message: `User not found!`});
        } 
    }else {
        if(language === "ARM") return res.status(400).json({message: `Մուտքագրեք էլ․ հասցեն և գաղտնաբառը։`});
        else if(language === "RUS") return res.status(400).json({message: `Введите адрес электронной почты и пароль!`});
        else return res.status(400).json({message: `Enter the email and password!`});
    }
        
    } catch (error) {
        if(language === "ARM"){
            console.log(error.message);
            return res.status(500).json({message: `Սերվերի սխալ: ${error.name}`})
        }
        else if(language === "RUS"){
            console.log(error.message);
            return res.status(500).json({message: `Ошибка сервера: ${error.name}`})
        }
        else {
            console.log(error.message);
            return res.status(500).json({message: `Server error: ${error.name}`})
        }
    }
}
module.exports = {
    createUser,
    getUser,
    removeUser,
    updateUser,
    loginUser
}