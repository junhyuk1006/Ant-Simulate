package com.example.antsimulate.kiwoom.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KiwoomQuoteDto {
    private String symbol;
    private Long price;
    private String time;
}
