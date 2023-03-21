

const Crawler = require('crawler');
const fs = require('fs')


const c = new Crawler({
    //每次请求爬取的时间间隔
    rateLimit: 2000,
    //最大连接数量
    maxConnections: 10,
    //爬取成功的回调函数（通用）
    callback: (error, res, done) => {
        if (error) {
            console.log(error);
        } else {
            const $ = res.$;
            const $searchList = $('.search-list>div');
            console.log($searchList);
            const categoryArr = []
            $searchList.map((index,item)=>{
                // console.log($(item).find('.pic-pack-outer>h3').text())
                const name = $(item).find('.pic-pack-outer>h3').text();
                const sore = $(item).find('.pic-pack-outer>i').text();
                const content = $(item).find('.pic-pack-outer>p').text();
                const img = $(item).find('.pic-pack-outer>img').attr('src');
                if(name){
                   const data = {
                    moviesName: name,
                    sore,
                    content,
                    img,
                  } 
                  categoryArr.push(data)
                } 
            })
            // resolve()
            // console.log(categoryArr);
            fs.createWriteStream("data/1.txt", categoryArr).write(JSON.stringify(categoryArr));
        }
        done();
    }
});

//大片首页
c.queue('https://www.1905.com/vod/list/n_1/o4p1.html');
//微电影 系列电影
// c.queue(['https://www.1905.com/vod/list/n_1_c_922/o4p1.html','https://www.1905.com/vod/list/n_2/o3p1.html']);
//纪录片
// c.queue([{
//     uri: 'https://www.1905.com/vod/list/c_927/o3p1.html',
//     jQuery: true,
//     //自定义参数：可以在callback中的res.options.parameter中获取
//     parameter: '参数',
//     //自定义爬取的回调函数
//     callback: (error, res, done) => {
//         if (error) {
//             console.log(error);
//         } else {
//             console.log(res.options.parameter)
//             const $ = res.$;
//             const $searchList = $('.search-list>div');
//             $searchList.map((index,item)=>{
//                 console.log($(item).find('.pic-pack-outer>img').attr('src'))
//             })
//         }
//         done();
//     }
// }]);


// //下载文件
// const c2 = new Crawler({
//     //设置encoding为null，不会将服务器返回内容用字符串进行编码
//     encoding: null,
//     jQuery: false,
//     callback: (err, res, done) => {
//         if (err) {
//             console.error(err.stack);
//         } else {
//             fs.createWriteStream("data\\"+res.options.filename).write(res.body);
//         }
//         done();
//     }
// });

// c2.queue({
//     uri: 'https://image11.m1905.cn/uploadfile/2019/0401/thumb_1_150_203_20190401021843670441.jpg',
//     filename: 'thumb_1_150_203_20190401021843670441.jpg'
// });




//通过起始地址获取所有分类地址
//通过分类地址获取分类地址下的所有影片
//通过影片地址获取影片的详情数据