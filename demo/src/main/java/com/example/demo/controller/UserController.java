package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.mapper.UserMapper;
import com.example.demo.vo.Page;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    @Resource
    UserMapper userMapper;
    @GetMapping("/all")
    public List<User> getUser(){
        return userMapper.findAll();
    }
    @PostMapping("/params")
    public String addUser(@RequestBody User user){
        userMapper.save(user);
        return "success";
    }
    @PutMapping("/update")
    public String updateUser(@RequestBody User user){
        userMapper.updateById(user);
        return "success";
    }
    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable("id") Long id){
        userMapper.deleteById(id);
        return "success";
    }
    @GetMapping("/info/{id}")
    public User findById(@PathVariable("id") Long id){
        return userMapper.findById(id);
    }
    @GetMapping("/infoPage")
    public Page<User> findByPage(@RequestParam(defaultValue = "1") Integer pageNum, @RequestParam(defaultValue = "10") Integer pageSize){
        Integer offset = (pageNum -1) * pageSize;
        List<User> userData = userMapper.findByPage(offset,pageSize);
        Page<User> page = new Page<>();
        page.setData(userData);
        Integer total = userMapper.countUser();
        page.setTotal(total);
        page.setPageNum(pageNum);
        page.setPageSize(pageSize);
        return page;
    }
}
