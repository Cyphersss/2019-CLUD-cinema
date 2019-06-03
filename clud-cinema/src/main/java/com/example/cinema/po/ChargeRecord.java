package com.example.cinema.po;

import java.sql.Timestamp;

public class ChargeRecord {
    /**
     * 充值记录id
     */
    private int id;
    /**
     * 用户id
     */
    private int userId;
    /**
     * 充值金额
     */
    private double chargeAmount;
    /**
     * 实际到账金额
     */
    private double actualAmount;
    /**
     * 充值时间
     */
    private Timestamp chargeTime;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public double getActualAmount() {
        return actualAmount;
    }

    public int getUserId() {
        return userId;
    }

    public double getChargeAmount() {
        return chargeAmount;
    }

    public Timestamp getChargeTime() {
        return chargeTime;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public void setChargeAmount(double chargeAmount) {
        this.chargeAmount = chargeAmount;
    }

    public void setActualAmount(double actualAmount) {
        this.actualAmount = actualAmount;
    }

    public void setChargeTime(Timestamp chargeTime) {
        this.chargeTime = chargeTime;
    }
}

