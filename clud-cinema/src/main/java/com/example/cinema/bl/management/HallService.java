package com.example.cinema.bl.management;

import com.example.cinema.po.Hall;
import com.example.cinema.vo.ResponseVO;

/**
 * @author fjj
 * @date 2019/4/12 2:01 PM
 */
public interface HallService {
    /**
     * 搜索所有影厅
     * @return
     */
    ResponseVO searchAllHall();

    ResponseVO insertHall(Hall hall);

    ResponseVO updateHall(String name,int column,int row,String oldName);

    ResponseVO deleteHall(String oldName);
}

