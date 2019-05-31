package com.example.cinema.po;

/**
 * @author czy
 * @date 2019/5/15
 */

public class MoviePlacingRate {
    private Integer movieId;
    private String name;
    /*
    上座率
     */
    private Double placingRate;

    public Integer getMovieId() {
        return movieId;
    }

    public void setMovieId(Integer movieId) {
        this.movieId = movieId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPlacingRate() {
        return placingRate;
    }

    public void setPlacingRate(double placingRate) {
        this.placingRate = placingRate;
    }



}
