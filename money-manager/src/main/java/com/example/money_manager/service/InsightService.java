package com.example.money_manager.service;

import com.example.money_manager.dto.response.InsightDTO;

public interface InsightService {
    InsightDTO generateInsightsForCurrentUser(Long accountId);
}
