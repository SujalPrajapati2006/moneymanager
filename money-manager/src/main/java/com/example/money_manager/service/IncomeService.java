package com.example.money_manager.service;

import com.example.money_manager.dto.request.IncomeDTO;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface IncomeService {

    IncomeDTO addIncome(IncomeDTO dto);
    List<IncomeDTO> getCurrentMonthIncomesForCurrentUser();
    void deleteIncome(Long incomeId);
    List<IncomeDTO> getLatest5IncomesForCurrentUser();
    BigDecimal getTotalIncomeForCurrentUser();
    List<IncomeDTO> filterIncomes(LocalDate startDate, LocalDate endDate, String keyword, Sort sort);
}
