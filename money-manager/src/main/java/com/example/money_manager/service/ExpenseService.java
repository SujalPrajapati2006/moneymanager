package com.example.money_manager.service;

import com.example.money_manager.dto.request.ExpenseDTO;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseService {

    ExpenseDTO addExpense(ExpenseDTO dto);
    List<ExpenseDTO> getCurrentMonthExpensesForCurrentUser();
    void deleteExpense(Long expenseId);
    List<ExpenseDTO> getLatest5ExpensesForCurrentUser();
    BigDecimal getTotalExpenseForCurrentUser();
    List<ExpenseDTO> filterExpenses(LocalDate startDate, LocalDate endDate, String keyword, Sort sort);
    List<ExpenseDTO> getExpensesForUserOnDate(Long profileId, LocalDate date);
}
