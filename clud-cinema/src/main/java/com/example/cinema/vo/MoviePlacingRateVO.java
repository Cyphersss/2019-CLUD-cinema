package com.example.cinema.vo;

import com.example.cinema.po.MoviePlacingRate;

/**
 * @author czy
 * @date 2019/5/15
 */

public class MoviePlacingRateVO {
    private Integer movieId;

    private String name;
    /*
    上座率
     */
    private Double placingRate;

    public MoviePlacingRateVO(MoviePlacingRate moviePlacingRate) {
        this.movieId = moviePlacingRate.getMovieId();
        this.name = moviePlacingRate.getName();
        this.placingRate = moviePlacingRate.getPlacingRate();
    }

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

    public void setPlacingRate(Double placingRate) {
        this.placingRate = placingRate;
    }

}
