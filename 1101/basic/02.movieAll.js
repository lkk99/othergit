//1.通过起始地址获取所有分类地址
//2.通过分类地址获取分类地址下的所有影片地址
//3.通过每一个影片地址获取影片的详情数据


const Crawler = require('crawler');
const fs = require('fs')

const c = new Crawler({
    //每次请求爬取的时间间隔
    rateLimit: 100,
    //最大连接数量
    maxConnections: 10,
    //爬取成功的回调函数（通用）
    callback: (error, res, done) => {
        if (error) {
            console.log(error);
        } else {

        }
        done();
    }
});



//获取url下所有的分类数据
function getAllCategories(url) {
    return new Promise((resolve, reject) => {
        c.queue([{
            uri: url,
            jQuery: true,
            callback: (error, res, done) => {
                if (error) {
                    reject(error)
                } else {
                    const $ = res.$;
                    const $indexSearchR = $(".search-index-R");
                    const categoryArr = []
                    $indexSearchR.map((index, item) => {
                        const $item = $(item);
                        const $categories = $item.find("a");
                        $categories.map((index, category) => {
                            let href = $(category).attr('href');
                            if (href == "javascript:void(0);") {
                                href = $(category).attr('onclick').split("'")[1]
                            }
                            const categoryobj = {
                                name: $(category).text(),
                                href: href
                            }
                            categoryArr.push(categoryobj)
                        })
                    })
                    resolve(categoryArr)
                }
                done();
            }
        }]);
    })
}

//获取某一个分类下的影片信息
function getMovieByCategoriy(category) {
    return new Promise((resolve, reject) => {
        c.queue({
            uri: category.href,
            jQuery: true,
            callback: (error, res, done) => {
                if (error) {
                    reject(error)
                    return;
                }
                const $ = res.$;
                const $searchList = $(".search-list>div");
                const movies = []
                $searchList.map((index, item) => {
                    const name = $(item).find('.pic-pack-outer>h3').text()
                    const href = $(item).find('.pic-pack-outer').attr('href')
                    movies.push({
                        name,
                        href
                    })
                })
                resolve(movies)
                done();
            }
        })
    })
}

//获取所有分类下的影片信息  async修饰的方法会返回一个Promise
async function getAllMovieByCategories(categoryArr) {
    const allMovies = [];
    for (let i = 0; i < categoryArr.length; i++) {
        let category = categoryArr[i];
        let movies = await getMovieByCategoriy(category);
        console.log(movies)
        allMovies.push(...movies)
    }
    return allMovies;
}


//获取指定movie(一个)的影片信息
function getMovieMessage(movie){
    return new Promise((resolve, reject) => {
        c.queue({
            uri: movie.href,
            jQuery: true,
            callback: (error, res, done) => {
                if (error) {
                    reject(error)
                    return;
                }
                const $ = res.$;
                const $movieInfo = $('.playerBox-info-leftPart');
                const name = $movieInfo.find('.playerBox-info-title>.playerBox-info-cnName').text();
                const ename = $movieInfo.find('.playerBox-info-title>.playerBox-info-enName').text();
                const year = $movieInfo.find('.playerBox-info-title>.playerBox-info-year').text()
                const grade = $movieInfo.find('.playerBox-info-title .playerBox-info-grade').text()
                const intro = $movieInfo.find('.playerBox-info-intro>#playerBoxIntroCon').text()
                const movieInfo = {
                    name,
                    ename,
                    year,
                    grade,
                    intro
                }
                resolve(movieInfo)
                done();
            }
        })
    })
}

//获取所有电影的影片信息
async function getAllMovieMessageByMovies(movies){
    const allMovieMessages = [];
    for (let i = 0; i < movies.length; i++) {
        let movie = movies[i];
        let movieMsg = await getMovieMessage(movie);
        allMovieMessages.push(movieMsg)
        console.log(movieMsg)
    }
    return allMovieMessages;
}

//执行爬取网站请求
getAllCategories("https://www.1905.com/vod/list/n_1/o4p1.html")
    .then((res) => {
        return getAllMovieByCategories(res)
    })
    .then((res)=>{
        console.log(res,"8888888888888")
        return getAllMovieMessageByMovies(res)
    })
    .then((res)=>{
        console.log(res)
    })
