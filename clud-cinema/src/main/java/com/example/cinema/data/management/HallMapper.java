package com.example.cinema.data.management;

import com.example.cinema.po.Hall;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @author fjj
 * @date 2019/4/11 3:46 PM
 */
@Mapper
public interface HallMapper {
    /**
     * 查询所有影厅信息
     * @return
     */
    List<Hall> selectAllHall();

    /**
     * 根据id查询影厅
     * @return
     */
    Hall selectHallById(@Param("hallId") int hallId);

    Hall selectHallByName(@Param("hallName") String hallName);

    void insertHall(@Param("name") String name,@Param("column") int column ,@Param("row") int row);

    void updateHall(@Param("name") String name,@Param("column") int column ,@Param("row") int row ,@Param("oldName") String oldName );

    void deleteHall(@Param("oldName") String oldName);
}
