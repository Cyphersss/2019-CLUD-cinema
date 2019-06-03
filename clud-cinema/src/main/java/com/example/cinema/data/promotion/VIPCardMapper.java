package com.example.cinema.data.promotion;

import com.example.cinema.po.ChargeRecord;
import com.example.cinema.po.VIPCard;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * Created by liying on 2019/4/14.
 */
@Mapper
public interface VIPCardMapper {

    int insertOneCard(VIPCard vipCard);

    int insertChargeRecord(ChargeRecord chargeRecord);

    VIPCard selectCardById(int id);

    void updateCardBalance(@Param("id") int id,@Param("balance") double balance);

    VIPCard selectCardByUserId(int userId);

    List<ChargeRecord> selectRecordsByUserId(int userId);



}
