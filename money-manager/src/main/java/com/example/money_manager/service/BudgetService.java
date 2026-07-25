package com.example.money_manager.service;

import com.example.money_manager.dto.request.BudgetDTO;
import java.util.List;

public interface BudgetService {
    BudgetDTO saveOrUpdateBudget(BudgetDTO dto);
    List<BudgetDTO> getBudgetsForMonth(String month);
    void deleteBudget(Long budgetId);
}
