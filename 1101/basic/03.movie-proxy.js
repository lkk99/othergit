

const Crawler = require('crawler');
const fs = require('fs')

const c = new Crawler({
    //每次请求爬取的时间间隔
    rateLimit: 2000,
    //最大连接数量
    maxConnections: 10
});


c.queue({
    uri: 'https://www.1905.com/vod/list/n_1/o4p1.html',
    limiter: 'proxy_1',
    proxy: 'http://1.181.48.68:3128',
    //爬取成功的回调函数（通用）
    callback: (error, res, done) => {
        if (error) {
            console.log(error);
        } else {
            const $ = res.$;
            const $searchList = $('.search-list>div');
            $searchList.map((index, item) => {
                console.log($(item).find('.pic-pack-outer>h3').text(),"proxy_1")
            })
        }
        done();
    }
})
c.queue({
    uri: 'https://www.1905.com/vod/list/n_1_c_922/o4p1.html',
    limiter: 'proxy_2',
    proxy: 'http://129.204.182.65:9999',
    //爬取成功的回调函数（通用）
    callback: (error, res, done) => {
        if (error) {
            console.log(error);
        } else {
            const $ = res.$;
            const $searchList = $('.search-list>div');
            $searchList.map((index, item) => {
                console.log($(item).find('.pic-pack-outer>h3').text(),"proxy_2")
            })
        }
        done();
    }
})
c.queue({
    uri: 'https://www.1905.com/vod/list/n_2/o3p1.html',
    limiter: 'proxy_3',
    proxy: 'http://113.195.202.183:9999',
    //爬取成功的回调函数（通用）
    callback: (error, res, done) => {
        if (error) {
            console.log(error);
        } else {
            const $ = res.$;
            const $searchList = $('.search-list>div');
            $searchList.map((index, item) => {
                console.log($(item).find('.pic-pack-outer>h3').text(),"proxy_3")
            })
        }
        done();
    }
})
c.queue({
    uri: 'https://www.1905.com/vod/list/c_927/o3p1.html',
    limiter: 'proxy_4',
    proxy: 'http://120.222.17.151:3128',
    //爬取成功的回调函数（通用）
    callback: (error, res, done) => {
        if (error) {
            console.log(error);
        } else {
            const $ = res.$;
            const $searchList = $('.search-list>div');
            $searchList.map((index, item) => {
                console.log($(item).find('.pic-pack-outer>h3').text(),"proxy_4")
            })
        }
        done();
    }
})