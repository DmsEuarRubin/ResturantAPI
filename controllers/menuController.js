const { Menu, Categorys, Food, Users, orderFood } = require("../models");
const Sequelize = require('sequelize');
const getUserEmail = require("../lib/getUserEmail");

Menu.hasMany(Categorys, {
    foreignKey: "menuFK",
    as: "categorys"
})
Categorys.belongsTo(Menu, {
    foreignKey: "menuFK",
    as: "menu"
})
Categorys.hasMany(Food, {
    foreignKey: "category_id",
    as: "food"
})
Food.belongsTo(Categorys, {
    foreignKey: "category_id",
    as: "category"
})
const getInfo = async (req, res) => {
    const useremail = getUserEmail(req, res);
    const user = await Users.findOne({ where: {email: useremail}})
    const language = user.language;
    try {
        if(await Menu.findOne({where:{id: req.params.id}})) {
    await Menu.findOne({
        attributes: [
            'title',
        ],
        include: [{
            model: Categorys,
            attributes: ['title', 'color'],
            as: 'categorys',
                include: [{
                    model: Food,
                    attributes: [
                        'title',
                        'description',
                        [Sequelize.literal("COALESCE(ROUND((SELECT AVG(value) FROM (SELECT unnest(raiting) AS value) AS r), 2), 0)"), 'raiting'],
                        [Sequelize.literal(`CONCAT(CAST(SUBSTRING(price, '\\d+\\.?\\d*') AS NUMERIC) ${language === "ENG" ? "" : `* ${language === "ARM" ? 480 : 86}`}, ${language === "ARM" ? "'֏'" : (language === "RUS" ? "'₽'" : "'$'")})`), 'price']                        
                    ],
                    as: 'food'
                }]
        }],
        where: {id: req.params.id}}).then(data => { 
            return res.status(200).json(data);
        })
    }else {
        if(language === "ARM") return res.status(400).json({message: `Մենյուն գոյություն չունի`});
        else if(language === "RUS") return res.status(400).json({message: `Меню не существует`});
        else return res.status(400).json({message: `Menu does not exist`});
    }
} 
    catch (error) {
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
const addRate = async (req, res) => {
    const useremail = getUserEmail(req, res);
    const user = await Users.findOne({ where: {email: useremail}})
    const language = user.language;
    try {
        const food = await Food.findOne({ where: { title: req.body.title } });
        const userEmail = getUserEmail(req, res);
        const user = await Users.findOne({ where: { email: userEmail } });
        if(food){
            const raitedUser = food.raitedUsers || [];
            const raitings = food.raiting || [];

            if(!raitedUser.some(userr => userr === user.id)){
                await raitedUser.push(user.id);
                await raitings.push(req.body.raiting)
                await Food.update({ raitedUsers: raitedUser, raiting: raitings}, {where: { title: req.body.title }}).then(() => {
                    if(language === "ARM") return res.status(201).json({message: `Դուք ուղարկել եք ${req.body.raiting} վարկանիշը ${req.body.title} ին`})
                    else if(language === "RUS") return res.status(201).json({message: `Вы отправили ${req.body.raiting} рейтинг к ${req.body.title}`})
                    else return res.status(201).json({message: `You sent a ${req.body.raiting} rating to ${req.body.title}`})
                })
            } else {
                if(language === "ARM") return res.status(400).json({ message: `Դուք արդեն գնահատել եք այս սնունդը!`});
                else if(language === "RUS") return res.status(400).json({ message: `Вы уже оценили эту еду!`});
                else return res.status(400).json({ message: `You already rated this food!`})
            }
            
        } else {
            if(language === "ARM") return res.status(404).json({ message: `Սնունդը չի գտնվել!`})
            else if(language === "RUS") return res.status(404).json({ message: `Еда не найдена!`})
            else return res.status(404).json({ message: `The food not found!`})
        }
    } catch (error) {
        if(language === "ARM"){
            console.log(error);
            if(error.message === `WHERE parameter "title" has invalid "undefined" value`)
                return res.status(400).json({message: `Խնդրում եմ, մուտքագրեք սննդի անվանումը!`})
            else if(error.message === `Validation error: Validation isIn on raiting failed`)
                return res.status(400).json({message: `Մուտքագրեք ճիշտ վարկանիշը [1,2,3,4,5]!`})
            else return res.status(500).json({message: `Սերվերի սխալ: ${error.name}`})
        }
        else if(language === "RUS"){
            console.log(error);
            if(error.message === `WHERE parameter "title" has invalid "undefined" value`)
                return res.status(400).json({message: `Введите название блюда, пожалуйста!`})
            else if(error.message === `Validation error: Validation isIn on raiting failed`)
                return res.status(400).json({message: `Введите действительный рейтинг [1,2,3,4,5]!`})
            else return res.status(500).json({message: `Ошибка сервера: ${error.name}`})
        }
        else {
            console.log(error);
            if(error.message === `WHERE parameter "title" has invalid "undefined" value`)
                return res.status(400).json({message: `Enter the food title please!`})
            else if(error.message === `Validation error: Validation isIn on raiting failed`)
                return res.status(400).json({message: `Enter the valid rating [1,2,3,4,5]!`})
            else return res.status(500).json({message: `Server error: ${error.name}`})
        }
    }
}
const orderFoods = async (req, res) => {
    const useremail = getUserEmail(req, res);
    const user = await Users.findOne({ where: {email: useremail}})
    const language = user.language;
    try {
        const useremail = getUserEmail(req, res);
        const user = await Users.findOne({ where: {email: useremail}})

        const foody = await Food.findOne({where: {title: req.body.food}})

        await orderFood.create({
            address: req.body.address,
            food: +foody.id,
            userEmail: useremail,
            user_id: user.id,
            boughtData: new Date()
        }).then(data => {
            if(language === "ARM") return res.status(200).json({message: `Սնունդը հաջողությամբ գնվել է և շուտով կառաքվի ${data.address} հասցե, և ձեր գնման ID-ն ${data.id} է`})
            else if(language === "RUS") return res.status(200).json({message: `Еда успешно куплена и скоро будет доставлена ​​по адресу: ${data.address} и ваш идентификатор покупки ${data.id}`})
            else return res.status(200).json({message: `The food has been successfully purchased and will soon be delivered to the address: ${data.address} and your purchase id is ${data.id}`})
        
        })
    } catch (error) {
        const foods = ['Nachos', 'Seaweed salad', 'Chili', 'Pizza margherita', 'Kung Pao Chicken', 'Sweet and Sour Pork', 'Peking Roast Duck', 'Mapo Tofu', 
        'Bulgogi', 'Korean stew', 'Boliche', 'Tamales', 'Yuca Con Mojo', 'Chicken Tikka Masala', 'Butter Chicken', 'Tandoori Chicken', 'Biryani', 'Dal Makhani', 
        'Kimchi', 'Bibimbap', 'Red rice cakes', 'Picadillo', 'Ropa Vieja', 'Delicious baked moussaka', 'Fasolatha', 'Sesame-covered', 'Juicy stuffed yemista', 
        'loukoumades', 'Tacos', 'Discada', 'Shredded Dried Beef or Pork', 'Huevos Rancheros', 'Chilaquiles', 'Sesame chicken'];

        if(error.message === "notNull Violation: orderFood.address cannot be null")
        {
            if(language === "ARM") return res.status(400).json({message: `Մուտքագրեք հասցեն!`})
            else if(language === "RUS") return res.status(400).json({message: `Введите адрес!`})
            else return res.status(400).json({message: `Enter the address!`})
        }
        else if(error.message === "notNull Violation: orderFood.food cannot be null"){
            
            if(language === "ARM") return res.status(400).json({message: `Մուտքագրեք սննդի անունը!`, foods: foods})
            else if(language === "RUS") return res.status(400).json({message: `Введите название блюда!`, foods: foods})
            else return res.status(400).json({message: `Enter the food name!`, foods: foods})
        }
        else if(error.message === "Validation error: Validation isIn on food failed"){
            if(language === "ARM") return res.status(400).json({message: `Մուտքագրեք ճիշտ սննդի անվանումը:`, foods: foods})
            else if(language === "RUS") return res.status(400).json({message: `Введите правильное название продукта!`, foods: foods})
            else return res.status(400).json({message: `Enter the valid food name!`, foods: foods})
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
const orderRate = async (req, res) => {
    const useremail = getUserEmail(req, res);
    const user = await Users.findOne({ where: {email: useremail}})
    const language = user.language;
    try {
        const useremail = getUserEmail(req, res);
        const orderID = req.body.orderID;

        if(language === "ARM"){
            if(orderID && req.body.raiting){
                if(await orderFood.findOne({where: {id: orderID, userEmail: useremail, deliveryRaiting: null, isDelivered: false}}))
                {
                    await orderFood.update({deliveryRaiting: req.body.raiting}, {where: {id: orderID}});
                    return res.status(200).json({message: `Դուք տալիս եք ${req.body.raiting} գնահատական ​${orderID}​ պատվերի համար:`})
                }else return res.status(400).json({message: `Պատվերը գոյություն չունի, կամ դուք արդեն գնահատում եք նրան:`})
            } else return res.status(400).json({message: `Սխալ orderID or raiting`})
        }
        else if(language === "RUS"){
            if(orderID && req.body.raiting){
                if(await orderFood.findOne({where: {id: orderID, userEmail: useremail, deliveryRaiting: null, isDelivered: false}}))
                {
                    await orderFood.update({deliveryRaiting: req.body.raiting}, {where: {id: orderID}});
                    return res.status(200).json({message: `Вы дали ${req.body.raiting} рейтинг для заказа ${orderID}.`})
                }else return res.status(400).json({message: `Ордена не существует, или вы уже его оценили!`})
            } else return res.status(400).json({message: `Неверный orderID или raiting`})
        }
        else {
            if(orderID && req.body.raiting){
                if(await orderFood.findOne({where: {id: orderID, userEmail: useremail, deliveryRaiting: null, isDelivered: false}}))
                {
                    await orderFood.update({deliveryRaiting: req.body.raiting}, {where: {id: orderID}});
                    return res.status(200).json({message: `You give ${req.body.raiting} ratings for an order ${orderID}`})
                }else return res.status(400).json({message: `Order does not exist, or you already rate him!`})
            } else return res.status(400).json({message: `Invalid orderID or raiting`})
        }

    } catch (error) {
        if(language === "ARM"){
            console.log(error.message);
            if (error.message === "Validation error: Validation isIn on deliveryRaiting failed")
                return res.status(400).json({message: `Մուտքագրեք ճիշտ թվեր: [1, 2, 3, 4, 5]`})
            else return res.status(500).json({message: `Սերվերի սխալ: ${error.name}`})
        }
        else if(language === "RUS"){
            console.log(error.message);
            if (error.message === "Validation error: Validation isIn on deliveryRaiting failed")
                return res.status(400).json({message: `Введите действительные цифры: [1, 2, 3, 4, 5]`})
            else return res.status(500).json({message: `Ошибка сервера: ${error.name}`})
        }
        else {
            console.log(error.message);
            if (error.message === "Validation error: Validation isIn on deliveryRaiting failed")
                return res.status(400).json({message: `Enter the valid numbers: [1, 2, 3, 4, 5]`})
            else return res.status(500).json({message: `Server error: ${error.name}`})
        }

    }
}
const getOrder = async (req, res) => {
    const useremail = getUserEmail(req, res);
    const user = await Users.findOne({ where: {email: useremail}})
    const language = user.language;
    try {
        const info = await orderFood.findAll({where: { user_id: user.id, isDelivered: false }});

        for(let i = 0; i < info.length; i++){
            const getID = await Food.findOne({where: {id: info[i].food}});
            info[i].food = getID.title;
        }
        return res.status(200).json({orders: info})
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
const orderDelivred = async (req, res) => {
    const useremail = getUserEmail(req, res);
    const user = await Users.findOne({ where: {email: useremail}})
    const language = user.language;
    try {
        const useremail = getUserEmail(req, res);
        const orderID = req.body.orderID;
        
        if(language === "ARM"){
            if(orderID){
                if(await orderFood.findOne({where: {id: orderID, userEmail: useremail, isDelivered: false}}))
                {
                    await orderFood.update({isDelivered: true}, {where: {id:orderID}});
                    return res.status(200).json({message: `Պատվերը հաջողությամբ հաստատվեց!`})
                }else return res.status(400).json({message: `Դուք թույլտվություն չունեք!`})
            } else return res.status(400).json({message: `Սխալ orderID`})
        }
        else if(language === "RUS"){
            if(orderID){
                if(await orderFood.findOne({where: {id: orderID, userEmail: useremail, isDelivered: false}}))
                {
                    await orderFood.update({isDelivered: true}, {where: {id:orderID}});
                    return res.status(200).json({message: `Заказ успешно подтвержден!`})
                }else return res.status(400).json({message: `У вас нет разрешений!`})
            } else return res.status(400).json({message: `Неверный orderID`})
        }
        else {
            if(orderID){
                if(await orderFood.findOne({where: {id: orderID, userEmail: useremail, isDelivered: false}}))
                {
                    await orderFood.update({isDelivered: true}, {where: {id:orderID}});
                    return res.status(200).json({message: `Order is successfully confirmed!`})
                }else return res.status(400).json({message: `You don't have permissions!`})
            } else return res.status(400).json({message: `Invalid orderID`})
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
    getInfo,
    addRate,
    orderFoods,
    orderRate,
    getOrder,
    orderDelivred
}