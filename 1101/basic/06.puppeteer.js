const puppeteer = require('puppeteer');

(async () => {
    try {
        //headless:false  有界面浏览器
        //defaultViewport 调整浏览器窗口的大小
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: {
                width: 1200,
                height: 800
            },
            //每一个操作放慢250ms
            slowMo:250
        });
        //打开一个新的页面
        const page = await browser.newPage();
        //访问sobooks ，{ timeout: 0 }设置打开网页的超时时间，不写默认是3s
        await page.goto('https://sobooks.cc/', { timeout: 0 });
        //截屏
        await page.screenshot({ path: 'sobooks.png' });


        //page.$$eval 查询所有符合条件的页面元素(可以进行dom操作)   
        //page.$$(selector) 只能获取元素，不能获取具体内容，返回ElementHandle
        //注意：该方法不要用await，否则后面的page.on('console')方法不会执行
        page.$$eval('#cardslist .card .card-item h3 a', (elements) => {
            elements.map(item => {
                console.log(item.innerHTML);
            })
        });

        //1.打开一个新的页面
        //2.模拟点击页面按钮
        //3.输入框获取焦点，输入内容并点击按钮
        //4.mouse move keyboard  page.
        //5.page.waitForSelector(selector[, options])
        //6.elementHandle.getProperty(propertyName)
        //7.请求拦截器拦截无效请求
        //8.browser.pages() 返回所有页面

        page.on('console', (...args) => {
            console.log(args)
        })
    }
    catch (e) {
        console.log(e);
    }

    //   await browser.close();
})();