package com.example.cinema.controller.management;

import com.example.cinema.bl.management.HallService;
import com.example.cinema.po.Hall;
import com.example.cinema.vo.ResponseVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**影厅管理
 * @author fjj
 * @date 2019/4/12 1:59 PM
 */
@RestController
public class HallController {
    @Autowired
    private HallService hallService;

    @RequestMapping(value = "hall/all", method = RequestMethod.GET)
    public ResponseVO searchAllHall(){
        return hallService.searchAllHall();
    }

    @GetMapping(value = "hall/insert")
    public ResponseVO insertHall(String name,int row,int column){
        Hall hall=new Hall();
        hall.setName(name);
        hall.setColumn(column);
        hall.setRow(row);
        return hallService.insertHall(hall);
    }

    @GetMapping(value = "hall/update")
    public ResponseVO updateHall(String name,int row,int column,String oldName){
        return hallService.updateHall(name,row,column,oldName);
    }

    @GetMapping(value = "hall/delete")
    public ResponseVO deleteHall(String oldName){
        return hallService.deleteHall(oldName);
    }
}
