package com.example.cinema.blImpl.management.hall;

import com.example.cinema.bl.management.HallService;
import com.example.cinema.data.management.HallMapper;
import com.example.cinema.po.Hall;
import com.example.cinema.vo.HallVO;
import com.example.cinema.vo.ResponseVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * @author fjj
 * @date 2019/4/12 2:01 PM
 */
@Service
public class HallServiceImpl implements HallService, HallServiceForBl {
    @Autowired
    private HallMapper hallMapper;

    @Override
    public ResponseVO searchAllHall() {
        try {
            return ResponseVO.buildSuccess(hallList2HallVOList(hallMapper.selectAllHall()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseVO.buildFailure("失败");
        }
    }

    @Override
    public Hall getHallById(int id) {
        try {
            return hallMapper.selectHallById(id);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }
/*
    @Override
    public Hall getHallByName(String name){
        try{
            return hallMapper.selectHallByName(name);
        }catch(Exception e){
            e.printStackTrace();
            return null;
        }
    }*/

    @Override
    public ResponseVO insertHall(Hall hall){
        try{
            boolean hasError=false;
            List<HallVO> li=hallList2HallVOList(hallMapper.selectAllHall());
            for (HallVO item:li){
                if (item.getName().equals(hall.getName())){
                    hasError=true;
                }
            }
            if (hasError){
                return ResponseVO.buildFailure("影厅名已存在");
            }
            hallMapper.insertHall(hall.getName(),hall.getColumn(),hall.getRow());
            return ResponseVO.buildSuccess();
        }catch (Exception e) {
            e.printStackTrace();
            return ResponseVO.buildFailure("失败");
        }
    }

    @Override
    public ResponseVO updateHall(String name,int column,int row,String oldName){
        try{
            hallMapper.updateHall(name,column,row,oldName);
            return ResponseVO.buildSuccess();
        }catch (Exception e){
            e.printStackTrace();
            return ResponseVO.buildFailure("失败");
        }
    }

    @Override
    public ResponseVO deleteHall(String oldName){
        try{
            hallMapper.deleteHall(oldName);
            return ResponseVO.buildSuccess();
        }catch (Exception e){
            e.printStackTrace();
            return ResponseVO.buildFailure("失败");
        }
    }


    private List<HallVO> hallList2HallVOList(List<Hall> hallList){
        List<HallVO> hallVOList = new ArrayList<>();
        for(Hall hall : hallList){
            hallVOList.add(new HallVO(hall));
        }
        return hallVOList;
    }

}
