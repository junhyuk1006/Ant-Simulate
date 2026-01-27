package com.example.antsimulate.stockdata.batch;

import java.time.Duration;
import java.util.concurrent.Semaphore;

public class SimpleRateLimiter {
    private final Semaphore semaphore = new Semaphore(1);

    public void acquire(){
        try{
            semaphore.acquire();
            Thread.sleep(Duration.ofSeconds(10).toMillis());
        } catch (InterruptedException e){
            Thread.currentThread().interrupt();
        } finally {
            semaphore.release();
        }
    }
}
