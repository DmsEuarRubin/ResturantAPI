const { reservation, Users } = require("../models");
const getUserEmail = require("../lib/getUserEmail");
const { Op } = require("sequelize");

(async () => {
    const expiredReservations = await reservation.findAll({where: { expireTime: { [Op.lt]: new Date() } }});

    for(let i = 0; i < expiredReservations.length; i++)
        await reservation.update({boughtUserID: null, expireTime: null, isFree: true}, {where: {resturantName: expiredReservations[i].dataValues.resturantName, isFree: false, tableNum: expiredReservations[i].dataValues.tableNum, partySize: expiredReservations[i].dataValues.partySize}})
})()
const buyReservation = async (req, res) => {
    const useremail = getUserEmail(req, res);
    const user = await Users.findOne({ where: {email: useremail}})
    const language = user.language;
    try {
        if(req.body.reservationDays >= 1 && req.body.reservationDays <= 4) {
            if(await reservation.findOne({where: {resturantName: req.body.resturantName, isFree: true, tableNum: req.body.tableNum, partySize: req.body.partySize}})){
                const userEmail = getUserEmail(req, res);
                const user = await Users.findOne({ where: { email: userEmail } });
                const expiretime = new Date();
                expiretime.setDate(expiretime.getDate() + Math.round(req.body.reservationDays));

                await reservation.update({boughtUserID: user.id, expireTime: expiretime, isFree: false}, {where: {resturantName: req.body.resturantName, isFree: true, tableNum: req.body.tableNum, partySize: req.body.partySize}})
                if(language === "ARM") return res.status(200).json({message: `Դուք հաջողությամբ գնել եք սեղան!`})
                else if(language === "RUS") return res.status(200).json({message: `Вы успешно приобрели столик!`})
                else return res.status(200).json({message: `You have successfully purchased table!`})
                
            } else {
                if(language === "ARM") return res.status(400).json({message: `Սեղանը գոյություն չունի կամ արդեն գնված է!`})
                else if(language === "RUS") return res.status(400).json({message: `Стола не существует или уже куплен!`})
                else return res.status(400).json({message: `The table does not exist or has already been bought!`})
            }
        } else {
            if(language === "ARM") return res.status(400).json({message: `Դուք չեք կարող սեղան պատվիրել այս ժամանակահատվածի համար՝ reservationDays = 1-4 օր`})
            else if(language === "RUS") return res.status(400).json({message: `Вы не можете зарезервировать столик на этот период времени: reservationDays = 1-4 дня.`})
            else return res.status(400).json({message: `You cannot reserve a table for this period of time: reservationDays = 1-4 days`})
           
        }
    } catch (error) {
        if(error.message === `WHERE parameter "resturantName" has invalid "undefined" value`){
            if(language === "ARM") return res.status(400).json({message: `Մուտքագրեք ռեստորանի անունը!`})
            else if(language === "RUS") return res.status(400).json({message: `Введите название ресторана!`})
            else return res.status(400).json({message: `Enter the resturantName!`})
        }
            
        else if(error.message === `WHERE parameter "tableNum" has invalid "undefined" value`){
                if(language === "ARM") return res.status(400).json({message: `Մուտքագրեք tableNum`})
                else if(language === "RUS") return res.status(400).json({message: `Введите tableNum`})
                else return res.status(400).json({message: `Enter the tableNum`})
            
        }
        else if(error.message === `WHERE parameter "partySize" has invalid "undefined" value`)
        {
            if(language === "ARM") return res.status(400).json({message: `Մուտքագրեք  partySize: [small, medium, big]`})
            else if(language === "RUS") return res.status(400).json({message: `Введите partySize: [small, medium, big]`})
            else return res.status(400).json({message: `Enter the partySize: [small, medium, big]`})
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
const findReservation = async (req, res) => {
    const useremail = getUserEmail(req, res);
    const user = await Users.findOne({ where: {email: useremail}})
    const language = user.language;
    try {
        await reservation.findAll({where: {partySize: req.body.partySize, isFree: true}}).then(data => {
            for(let i = 0; i < data.length; i++)
            {
                data[i] = {
                    resturantName: data[i].resturantName,
                    tableNum: data[i].tableNum,
                    partySize: data[i].partySize
                }
            }
            if(language === "ARM") return res.status(200).json({message: `Գտնվել են վերապահումներ: ${data.length}`, reservations: data})
            else if(language === "RUS") return res.status(200).json({message: `Бронирования найдены: ${data.length}`, reservations: data})
            else return res.status(200).json({message: `Reservations found: ${data.length}`, reservations: data})
        })
    } catch (error) {
        if(language === "ARM"){
            if(error.message === `WHERE parameter "partySize" has invalid "undefined" value`)
            return res.status(400).json({message: `Մուտքագրեք partySize: [small, medium, big]`})
        console.log(error.message)
        return res.status(500).json({message: `Սերվերի սխալ: ${error.name}`})
        }
        else if(language === "RUS"){
            if(error.message === `WHERE parameter "partySize" has invalid "undefined" value`)
            return res.status(400).json({message: `Введите partySize: [small, medium, big]`})
        console.log(error.message)
        return res.status(500).json({message: `Ошибка сервера: ${error.name}`})
        }
        else {
            if(error.message === `WHERE parameter "partySize" has invalid "undefined" value`)
            return res.status(400).json({message: `Enter the partySize: [small, medium, big]`})
        console.log(error.message)
        return res.status(500).json({message: `Server error: ${error.name}`})
        }
        
    }
}
module.exports = {
    buyReservation,
    findReservation
}