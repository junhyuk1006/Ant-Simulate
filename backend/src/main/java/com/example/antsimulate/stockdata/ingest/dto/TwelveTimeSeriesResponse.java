package com.example.antsimulate.stockdata.ingest.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TwelveTimeSeriesResponse {
    public Meta meta;
    public List<Value> values;
    public String status;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Meta {
        public String symbol;
        public String interval;
        public String exchange_timezone;
        public String exchange;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Value {
        public String datetime;
        public String open;
        public String high;
        public String low;
        public String close;
        public String volume;
    }
}
