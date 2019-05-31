package com.example.cinema.blImpl.sales;

import com.example.cinema.bl.sales.TicketService;
import com.example.cinema.blImpl.management.hall.HallServiceForBl;
import com.example.cinema.blImpl.management.schedule.ScheduleServiceForBl;
import com.example.cinema.data.promotion.ActivityMapper;
import com.example.cinema.data.promotion.CouponMapper;
import com.example.cinema.data.promotion.VIPCardMapper;
import com.example.cinema.data.sales.TicketMapper;
import com.example.cinema.data.user.AccountMapper;
import com.example.cinema.po.*;
import com.example.cinema.vo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by liying on 2019/4/16.
 */
@Service
public class TicketServiceImpl implements TicketService {

    @Autowired
    TicketMapper ticketMapper;
    @Autowired
    ScheduleServiceForBl scheduleService;
    @Autowired
    HallServiceForBl hallService;
    @Autowired
    CouponMapper couponMapper;
    @Autowired
    ActivityMapper activityMapper;
    @Autowired
    VIPCardMapper vipCardMapper;

    @Override
    @Transactional
    public ResponseVO addTicket(TicketForm ticketForm) {
        try{
            int userID=ticketForm.getUserId();
            int scheduleID=ticketForm.getScheduleId();
            List<SeatForm> seats=ticketForm.getSeats();
            int len=seats.size();
            List<Ticket> answer=new ArrayList<Ticket>();
            for (int i=0;i<len;i++){
                Ticket ticket=new Ticket();
                ticket.setUserId(userID);
                ticket.setScheduleId(scheduleID);
                ticket.setRowIndex(seats.get(i).getRowIndex());
                ticket.setColumnIndex(seats.get(i).getColumnIndex());
                ticket.setState(0);
                ticket.setTime(new Timestamp(System.currentTimeMillis()));
                answer.add(ticket);
            }
            ticketMapper.insertTickets(answer);
            //
            TicketWithCouponVO ticketWithCouponVO=new TicketWithCouponVO();
            List<TicketVO> ticketVOs=new ArrayList<TicketVO>();
            double total=0;
            List<Coupon> coupons=new ArrayList<Coupon>();
            List<Activity> activities=new ArrayList<Activity>();
            for(SeatForm seatForm:seats){
                Ticket ticket=ticketMapper.selectTicketByScheduleIdAndSeat(scheduleID,seatForm.getColumnIndex(),seatForm.getRowIndex());
                ticketVOs.add(ticket.getVO());
            }
            ScheduleItem scheduleItem=scheduleService.getScheduleItemById(scheduleID);
            total=seats.size()*scheduleItem.getFare();
            coupons=couponMapper.selectCouponByUser(userID);
            activities=activityMapper.selectActivitiesByMovie(scheduleItem.getMovieId());
            ticketWithCouponVO.setTicketVOList(ticketVOs);
            ticketWithCouponVO.setTotal(total);
            ticketWithCouponVO.setCoupons(coupons);
            ticketWithCouponVO.setActivities(activities);


            //
            return ResponseVO.buildSuccess(ticketWithCouponVO);
        }
        catch(Exception e){
            e.printStackTrace();
            return ResponseVO.buildFailure("失败");
        }
    }

    @Override
    @Transactional
    public ResponseVO completeTicket(List<Integer> id, int couponId) {
        try {
            Ticket ticket=ticketMapper.selectTicketById(id.get(0));
            int userId=ticket.getUserId();
            int scheduleId=ticket.getScheduleId();
            ScheduleItem scheduleItem=scheduleService.getScheduleItemById(scheduleId);
            Integer movieId=scheduleItem.getMovieId();
            //总价
            double fare=scheduleItem.getFare();
            int num=id.size();
            double total=num*fare;
            double payAmount;
            Timestamp timestamp=ticket.getTime();
            //使用优惠券
            if (couponId!=0){
                Coupon coupon=couponMapper.selectById(couponId);

                double targetAmount=coupon.getTargetAmount();
                double discountAmount=coupon.getDiscountAmount();
                Timestamp startTimeCoupon=coupon.getStartTime();
                Timestamp endTimeCoupon=coupon.getEndTime();
                boolean isRequiredTimeCoupon=(startTimeCoupon.before(timestamp) && endTimeCoupon.after(timestamp)) || startTimeCoupon.equals(timestamp) || endTimeCoupon.equals(timestamp);
                boolean isRequiredAmountCoupon=(total>=targetAmount);

                if(isRequiredTimeCoupon && isRequiredAmountCoupon){
                    payAmount=total-discountAmount;
                    couponMapper.deleteCouponUser(couponId,userId);
                }
                else{
                    payAmount=total;
                }
            }
            else{
                payAmount=total;
            }
            for(Integer ticketId:id) {
                ticket=ticketMapper.selectTicketById(ticketId);
                ticketMapper.updateTicketState(ticketId,1);
            }
            //activity
            List<Activity> activities=activityMapper.selectActivitiesByMovie(movieId);
            for(Activity activity:activities){
                Timestamp startTimeActivity=activity.getStartTime();
                Timestamp endTimeActivity=activity.getEndTime();
                boolean isRequiredActivity=(startTimeActivity.before(timestamp) && endTimeActivity.after(timestamp)) || startTimeActivity.equals(timestamp) || endTimeActivity.equals(timestamp);
                if(isRequiredActivity){
                    Coupon couponReturnUser=activity.getCoupon();
                    int couponReturnUserId=couponReturnUser.getId();
                    couponMapper.insertCouponUser(couponReturnUserId,userId);
                }
            }
            return ResponseVO.buildSuccess();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseVO.buildFailure("失败");
        }
    }

    @Override
    public ResponseVO getBySchedule(int scheduleId) {
        try {
            List<Ticket> tickets = ticketMapper.selectTicketsBySchedule(scheduleId);
            ScheduleItem schedule=scheduleService.getScheduleItemById(scheduleId);
            Hall hall=hallService.getHallById(schedule.getHallId());
            int[][] seats=new int[hall.getRow()][hall.getColumn()];
            tickets.stream().forEach(ticket -> {
                seats[ticket.getRowIndex()][ticket.getColumnIndex()]=1;
            });
            ScheduleWithSeatVO scheduleWithSeatVO=new ScheduleWithSeatVO();
            scheduleWithSeatVO.setScheduleItem(schedule);
            scheduleWithSeatVO.setSeats(seats);
            return ResponseVO.buildSuccess(scheduleWithSeatVO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseVO.buildFailure("失败");
        }
    }

    @Override
    public ResponseVO getTicketByUser(int userId) {
        try {
            List<Ticket> tickets=ticketMapper.selectTicketByUser(userId);
            List<TicketWithScheduleVO> answer=new ArrayList<>();
            for(Ticket t:tickets){
                if (t.getState()==1 || t.getState()==2){
                    TicketWithScheduleVO ts=new TicketWithScheduleVO();
                    ts.setId(t.getId());
                    ts.setUserId(t.getUserId());
                    ts.setRowIndex(t.getRowIndex());
                    ts.setColumnIndex(t.getColumnIndex());
                    if (t.getState()==1){
                        ts.setState("已完成");
                    }
                    else {
                        ts.setState("已失效");
                    }
                    ts.setTime(t.getTime());
                    ScheduleItem sI=scheduleService.getScheduleItemById(t.getScheduleId());
                    ts.setSchedule(sI);
                    answer.add(ts);
                }
            }
            return ResponseVO.buildSuccess(answer);
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseVO.buildFailure("失败");
        }

    }

    @Override
    @Transactional
    public ResponseVO completeByVIPCard(List<Integer> id, int couponId) {
        try {
            Ticket ticket=ticketMapper.selectTicketById(id.get(0));
            int userId=ticket.getUserId();
            int scheduleId=ticket.getScheduleId();
            ScheduleItem scheduleItem=scheduleService.getScheduleItemById(scheduleId);
            Integer movieId=scheduleItem.getMovieId();
            //总价
            double fare=scheduleItem.getFare();
            int num=id.size();
            double total=num*fare;
            double payAmount;
            Timestamp timestamp=ticket.getTime();
            //使用优惠券
            if (couponId!=0){
                Coupon coupon=couponMapper.selectById(couponId);

                double targetAmount=coupon.getTargetAmount();
                double discountAmount=coupon.getDiscountAmount();
                Timestamp startTimeCoupon=coupon.getStartTime();
                Timestamp endTimeCoupon=coupon.getEndTime();
                boolean isRequiredTimeCoupon=(startTimeCoupon.before(timestamp) && endTimeCoupon.after(timestamp)) || startTimeCoupon.equals(timestamp) || endTimeCoupon.equals(timestamp);
                boolean isRequiredAmountCoupon=(total>=targetAmount);

                if(isRequiredTimeCoupon && isRequiredAmountCoupon){
                    payAmount=total-discountAmount;
                    couponMapper.deleteCouponUser(couponId,userId);
                }
                else{
                    payAmount=total;
                }
            }
            else {
                payAmount=total;
            }
            VIPCard vipCard=vipCardMapper.selectCardByUserId(userId);
            double balance=vipCard.getBalance();
            if(balance<payAmount) {
                return ResponseVO.buildFailure("失败");
            }
            else{
                vipCard.setBalance(balance-payAmount);
                vipCardMapper.updateCardBalance(vipCard.getId(),vipCard.getBalance());
                List<TicketVO> ticketVOs = new ArrayList<TicketVO>();
                for (Integer ticketId : id) {
                    ticket = ticketMapper.selectTicketById(ticketId);
                    ticketMapper.updateTicketState(ticketId, 1);
                }
                //activity
                List<Activity> activities = activityMapper.selectActivitiesByMovie(movieId);
                for (Activity activity : activities) {
                    Timestamp startTimeActivity = activity.getStartTime();
                    Timestamp endTimeActivity = activity.getEndTime();
                    boolean isRequiredActivity=(startTimeActivity.before(timestamp) && endTimeActivity.after(timestamp)) || startTimeActivity.equals(timestamp) || endTimeActivity.equals(timestamp);
                    if (isRequiredActivity) {
                        Coupon couponReturnUser = activity.getCoupon();
                        int couponReturnUserId = couponReturnUser.getId();
                        couponMapper.insertCouponUser(couponReturnUserId,userId);
                    }
                }
                return ResponseVO.buildSuccess();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseVO.buildFailure("失败");
        }
    }

    @Override
    public ResponseVO cancelTicket(List<Integer> id) {
        try{
            int len=id.size();
            for(int i=0;i<len;i++){
                int ticketID=id.get(i);
                ticketMapper.updateTicketState(ticketID,2);
            }
            return ResponseVO.buildSuccess();
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseVO.buildFailure("失败");
        }
    }



}
