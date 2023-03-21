package com.example.demo.mapper;

import com.example.demo.entity.User;
import com.example.demo.vo.Page;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserMapper {
    @Select("select * from user")
    List<User> findAll();


    @Update("INSERT INTO user(name, age) VALUES (#{name},#{age})")
    @Transactional
    void save(User user);

    @Update("update user set name=#{name}, age=#{age} where id=#{id}")
    @Transactional
    void updateById(User user);

    @Delete("delete from user where id = #{id}")
    void deleteById(Long id);
    @Select("select * from user where id = #{id}")
    User findById(Long id);
    @Select("select * from user limit #{offset},#{pageSize}")
    List<User> findByPage(Integer offset, Integer pageSize);
    @Select("select count(id) from user")
    Integer countUser();
}
