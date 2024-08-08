package com.danstep.model.dto;

import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
public class Score {
    private int bad;
    private int good;
    private int great;
    private int perfect;
    private int health;

    // Getters and setters

    @Override
    public String toString() {
        return "Score{" +
                "bad=" + bad +
                ", good=" + good +
                ", great=" + great +
                ", perfect=" + perfect +
                ", health=" + health +
                '}';
    }
}
