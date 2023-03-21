const Crawler = require('crawler');

const c = new Crawler({
    //每次请求爬取的时间间隔
    rateLimit: 2000,
    //最大连接数量
    maxConnections: 10,
});

/*
注意点：
    1.需要使用fiddler抓包工具分析接口
    2.借助postman来测试请求
    3.借助浏览器来登录注销查看接口地址

主要流程：
    1.调用登录接口(post请求)，获取用户登录的cookie信息
    2.根据登录后的cookie，调用user/profile接口，获取用户信息(包含uuid)
    3.在获取订单数据的时候，调用auth接口，根据uuid获取访问的tocken凭证
    4.根据tocken凭证和uuid，调用order接口，获取用户对应的订单信息
*/

//模拟登录的方法：返回登录之后的cookies信息
function doLogin() {
    return new Promise((resolve, reject) => {
        c.direct({
            uri: 'https://www.vfinemusic.com/v1/users/login',
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                "email": "mazg1987@163.com",
                "phone": "",
                "password": "abcd1234",
                "device_id": "vf1621510105960-39532"
            }),
            //自定义爬取的回调函数
            callback: (error, res) => {
                if (error) {
                    console.log(error);
                    reject(error)
                } else {
                    resolve(res.headers['set-cookie'])
                }
            }
        })
    })
}

let userInfo = {}
//根据cookies获取用户信息(里面包含uuid，后面在获取订单数据的时候需要根据uuid来生成tocken，再根据tocken获取订单数据)
function getUserId(cookies) {
    console.log(cookies);
    return new Promise((resolve, reject) => {
        c.direct({
            jQuery: false,
            uri: 'https://www.vfinemusic.com/v1/users/profile',
            headers: {
                "Cookie": `${cookies[0]};${cookies[1]}`,
            },
            //自定义爬取的回调函数
            callback: (error, res) => {
                if (error) {
                    reject(error)
                } else {
                    console.log(JSON.parse(res.body))
                    userInfo = JSON.parse(res.body)
                    resolve(JSON.parse(res.body))
                }
            }
        })
    })
}


//根据用户信息获取access_tocken
function getAcceccTocken(uuid) {
    return new Promise((resolve, reject) => {
        c.direct({
            jQuery: false,
            uri: `https://www.vfinemusic.com/php/v1/auth/?user_id=${uuid}`,
            //自定义爬取的回调函数
            callback: (error, res) => {
                if (error) {
                    reject(error)
                } else {
                    console.log(JSON.parse(res.body))
                    resolve(JSON.parse(res.body).access_token)
                }
            }
        })
    })
}


//根据access_tocken获取用户的订单数据
function getOrderList(tocken) {
    return new Promise((resolve, reject) => {
        c.direct({
            jQuery: false,
            uri: 'https://www.vfinemusic.com/php/v1/get_charge_orders/',
            qs: {
                user_id: userInfo.uuid,
                page: 1,
                access_token: tocken
            },
            //自定义爬取的回调函数
            callback: (error, res) => {
                if (error) {
                    reject(error)
                } else {
                    console.log(JSON.parse(res.body))
                    resolve(JSON.parse(res.body))
                }
            }
        })
    })
}



doLogin()
    .then((cookies) => {
        return getUserId(cookies)
    })
    .then((userInfo) => {
        return getAcceccTocken(userInfo.uuid)
    })
    .then((tocken)=>{
        return getOrderList(tocken)
    })

