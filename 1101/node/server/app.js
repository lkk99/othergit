var express = require('express')
var path = require("path");
var app = express()
var uuid = require('node-uuid');
var moment = require('moment');
var fs = require('fs');

// 民族
var national =fs.readFileSync('national.json');
var arrNational= JSON.parse(national);

// 城市
var city =fs.readFileSync('city.json');
var arrCity= JSON.parse(city);


var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//允许跨域访问
/*
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:3000");  
    res.header("Access-Control-Allow-Credentials", "true");  
    res.header("Access-Control-Allow-Methods", "*");  
    res.header("Access-Control-Allow-Headers", "x-requested-with,Cache-Control,Pragma,Content-Type,Token, Content-Type");//这里“Access-Token”是我要传到后台的内容key  
    res.header("Access-Control-Expose-Headers", "*");  
    next();
});
*/

 app.all('*', function(req, res, next) {
 	res.header("Access-Control-Allow-Origin", "*");  
     res.header("Access-Control-Allow-Credentials", "true");  
     res.header("Access-Control-Allow-Methods", "*");  
     res.header("Access-Control-Allow-Headers", "x-requested-with,Cache-Control,Pragma,Content-Type,Token, Content-Type");//这里“Access-Token”是我要传到后台的内容key  
     res.header("Access-Control-Expose-Headers", "*");  
     next();
 });


//数据源
var list = [
  { id: '1', name: '奔驰', ctime: '2022-12-29 03:37:43' },
  { id: '2', name: '宝马', ctime: '2022-12-29 03:37:22' }
]
var arrDT = []
// arrNational 获取民族
app.get("/api/getNational",function(req,res){
	// console.log(req.query);
   	return res.status(200).json({
	   status: 0,
	   message: arrNational
	})
})
// arrCity 获取城市
app.get("/api/getCity",function(req,res){
	// console.log(req.query);
	// var parent_code = req.body.parent_code;
	// var code=req.body.code;
	// var name=req.body.name;
	var privince =[];
	var county =[];
	var city =[];
	arrCity.find((item)=>{
	  	if(item.type === 0){
	  		privince.push(item)
	  	}
	  })
	  // arrCity.find((item)=>{
	  // 	if(item.type === 1 && item.parent_code === code){
	  // 		county.push(item)
	  // 	}
	  // })
	  // arrCity.find((item)=>{
	  // 	if(item.type === 2 && item.parent_code === code){
	  // 		city.push(item)
	  // 	}
	  // })
   	return res.status(200).json({
	   status: 0,
	   message: { privince }
	})
})
/**
 * 将列表数据转换为树形数据
 */
 function tranListToTreeDate (list, code) {
  // 存放子节点的数据
  const arr = []
  // 遍历列表
  list.forEach(item => {
    // 如果当前项item的pid等于 code，说明当前项item是code的子节点(对象类型)
    if(item.parent_code === code) {
      // 找到当前项的子节点,如果没有，则会返回一个空数组
      const children = tranListToTreeDate(list, item.code)
      // 如果数组不为空，则表示当前项有子节点，且所有子节点都在 children 中
      if(children.length) {
        // 将当前项的所有子节点挂载到当前项的属性 children 下
        item.children = children;
      }
      // 将 code 匹配的所有子节点放到 arr 中
      arr.push(item);
    }
  })
  // 返回一个数组，子节点的数据（如果当前项没有子节点，会返回一个空数组）
  return arr
}

// const departs =  tranListToTreeDate(arrCity ,"0");

app.get("/api/getTreeCity",function(req,res){
	var treeData = tranListToTreeDate(arrCity ,"0");;

   	return res.status(200).json({
	   status: 0,
	   message: treeData
	})
})
app.post("/api/getCounty",function(req,res){
var parent_code = req.body.parent_code;
	var code=req.body.code;
	var name=req.body.name;
	var county =[];
	var city =[];
	arrCity.find((item)=>{
	  	if(item.type === 1 && item.parent_code === code){
	  		county.push(item)
	  	}
	  })
	  arrCity.find((item)=>{
	  	if(item.type === 2 && item.parent_code === code){
	  		city.push(item)
	  	}
	  })
	  return res.status(200).json({
	   status: 0,
	   message: { county, city }
	})
})
//获取品牌列表
app.get("/api/getnewslist",function(req,res){
	// console.log(req.query);
   	return res.status(200).json({
	   status: 0,
	   message: list
	})
})

//添加一个品牌
app.post("/api/news/new",function(req,res){
	var name = req.body.name;
	// console.log(req.body)
	var id;
	var ctime;
	// 生成唯一id
	id = uuid.v1();
	ctime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss') // 24 小时
	// ctime = moment(new Date()).format('YYYY-MM-DD HH:mm')  // 12小时
	// console.log(id)
	var obj = {
		id:id,
		name:name,
		ctime:ctime,
	}
	list.push(obj);
	return res.status(200).json({
	   status: 0,
	   message: "添加成功"
	})
})

//删除品牌
app.get("/api/news/del/:id",function(req,res){
	var id = req.params["id"];
	// console.log(req.params);
	
	var index = list.findIndex(item => {
		// console.log(item, id, item.id===id);
        if (item.id === id) {
					list.splice(index, 1)
          return true;
        }
    })
	return res.status(200).json({
	   status: 0,
	   message: "删除成功"
	})
})
//修改品牌
app.post("/api/news/update",function(req,res){
	// var id = req.params["id"];
	// console.log(req.params);
	var name = req.body.name;
	var id = req.body.id;
	if(list.length){
	 // var data = list.update({ id: id },{ $set: { id: id ,name: name } })
		var data = list.findIndex((item, index)=>{
			if(item.id === id){
				list[index].name=name
				return true;
			}
		})
	}
	return res.status(200).json({
	   status: 0,
	   message: list,
	});
})

//测试jsonp
app.get("/api/getscript",function(req,res){
	var data = {
      name: 'xjj',
      age: 18,
      gender: '女孩子'
    }

    var scriptStr = `${req.query.callback}(${JSON.stringify(data)})`
    // res.end 发送给 客户端， 客户端去把 这个 字符串，当作JS代码去解析执行
    res.end(scriptStr)
})

app.get("/api/dat",function(req,res){
	// var id;
	// var ctime;
	// // 生成唯一id
	// id = uuid.v1();
	// ctime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss') // 24 小时
	// // ctime = moment(new Date()).format('YYYY-MM-DD HH:mm')  // 12小时
	// // console.log(id)
	// var obj = {
	// 	id:id,
	// 	// name:name,
	// 	...dat,
	// 	ctime:ctime,
	// }
	// arrDT.push(obj);
	return res.status(200).json({
	   status: 0,
	   message: arrDT
	})
})
//添加数据
app.post("/api/add",function(req,res){
	// var name = req.body.name;
	var dat = req.body;
	// console.log(req.body)
	var id;
	var ctime;
	// 生成唯一id
	id = uuid.v1();
	ctime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss') // 24 小时
	// ctime = moment(new Date()).format('YYYY-MM-DD HH:mm')  // 12小时
	// console.log(id)
	var obj = {
		id:id,
		...dat,
		ctime:ctime,
	}
	const arrEmail = arrDT.map(user => user.email)
	if(arrEmail.includes(dat.email)){
			return res.status(200).json({
	   		status: -1,
	   		message: "添加失败,邮箱已存在"
			})
	}
	arrDT.push(obj);
	return res.status(200).json({
	   status: 0,
	   message: "添加成功"
	})
})
app.listen(4000,function(){
    console.log("4000服务器启动了")
})
