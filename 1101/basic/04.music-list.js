const Crawler = require('crawler');
const path = require('path')
const fs = require('fs')

const c = new Crawler({
    //每次请求爬取的时间间隔
    rateLimit: 2000,
    //最大连接数量
    maxConnections: 10,
});


//模拟登录的方法：返回登录之后的cookies信息
function getMusicList() {
    const musics = []
    return new Promise((resolve, reject) => {
        c.queue({
            jQuery: false,
            uri: 'https://www.vfinemusic.com/v1/works',
            qs: {
                format: 'json',
                page: 1,
                page_size: 24,
                status: "ONLINE"
            },
            //自定义爬取的回调函数
            callback: (error, res) => {
                if (error) {
                    reject(error)
                } else {
                    const results = JSON.parse(res.body).results;
                    results.map((item) => {
                        musics.push({
                            name: item.name,
                            producer: item.producer.name,
                            url: item.preview
                        })
                    })
                    resolve(musics)
                }
            }
        })
    })
}


const c2 = new Crawler({
    //设置encoding为null，不会将服务器返回内容用字符串进行编码
    encoding: null,
    jQuery: false,

});

function downLoadOneMusic(url, name) {
    const extname = path.extname(url);
    return new Promise((resolve, reject) => {
        c2.queue({
            uri: url,
            filename: name + extname,
            callback: (err, res, done) => {
                if (err) {
                    reject(err);
                } else {
                    fs.createWriteStream("data\\musics\\" + res.options.filename).write(res.body);
                    resolve()
                }
                done();
            }
        });
    })
}

async function downLoadAllMusic(musics) {
    for (let i = 0; i < musics.length; i++) {
        let result = await downLoadOneMusic(musics[i].url, musics[i].name);
        console.log("下载" + musics[i].name + "完毕")
    }
    return "下载完毕"
}


getMusicList()
    .then((musics) => {
        console.log(musics)
        return downLoadAllMusic(musics)
    })