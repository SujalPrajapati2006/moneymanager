package com.example.money_manager.service.impl;

import com.example.money_manager.dto.request.ExpenseDTO;
import com.example.money_manager.dto.request.IncomeDTO;
import com.example.money_manager.dto.request.RecentTransactionDTO;
import com.example.money_manager.entity.ProfileEntity;
import com.example.money_manager.service.BudgetService;
import com.example.money_manager.service.DashboardService;
import com.example.money_manager.service.ExpenseService;
import com.example.money_manager.service.IncomeService;
import com.example.money_manager.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.stream.Stream.concat;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {
    private final IncomeService incomeService;
    private final ExpenseService expenseService;
    private final ProfileService profileService;
    private final BudgetService budgetService;

    @Override
    public Map<String, Object> getDashboardData() {
        return getDashboardData(null);
    }

    @Override
    public Map<String, Object> getDashboardData(Long accountId) {
        ProfileEntity profile = profileService.getCurrentProfile();

        Map<String, Object> returnValue = new LinkedHashMap<>();
        List<IncomeDTO> latestIncomes = incomeService.getLatest5IncomesForCurrentUser();
        List<ExpenseDTO> latestExpenses = expenseService.getLatest5ExpensesForCurrentUser();

        if (accountId != null) {
            latestIncomes = latestIncomes.stream()
                    .filter(i -> accountId.equals(i.getAccountId()))
                    .toList();
            latestExpenses = latestExpenses.stream()
                    .filter(e -> accountId.equals(e.getAccountId()))
                    .toList();
        }

        List<RecentTransactionDTO> recentTransactions = concat(latestIncomes.stream().map(income ->
                        RecentTransactionDTO.builder()
                                .id(income.getId())
                                .profileId(profile.getId())
                                .icon(income.getIcon())
                                .name(income.getName())
                                .amount(income.getAmount())
                                .date(income.getDate())
                                .createdAt(income.getCreatedAt())
                                .updatedAt(income.getUpdatedAt())
                                .type("income")
                                .build()),
                latestExpenses.stream().map(expense ->
                        RecentTransactionDTO.builder()
                                .id(expense.getId())
                                .profileId(profile.getId())
                                .icon(expense.getIcon())
                                .name(expense.getName())
                                .amount(expense.getAmount())
                                .date(expense.getDate())
                                .createdAt(expense.getCreatedAt())
                                .updatedAt(expense.getUpdatedAt())
                                .type("expense")
                                .build()))
                .sorted((a, b) -> {
                    int cmp = b.getDate().compareTo(a.getDate());
                    if (cmp == 0 && a.getCreatedAt() != null && b.getCreatedAt() != null) {
                        return b.getCreatedAt().compareTo(a.getCreatedAt());
                    }
                    return cmp;
                }).collect(Collectors.toList());

        String currentMonth = YearMonth.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));

        BigDecimal totalIncome = incomeService.getTotalIncomeForCurrentUser();
        BigDecimal totalExpense = expenseService.getTotalExpenseForCurrentUser();

        if (accountId != null) {
            totalIncome = latestIncomes.stream().map(IncomeDTO::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
            totalExpense = latestExpenses.stream().map(ExpenseDTO::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        returnValue.put("totalBalance", totalIncome.subtract(totalExpense));
        returnValue.put("totalIncome", totalIncome);
        returnValue.put("totalExpense", totalExpense);
        returnValue.put("recent5Expenses", latestExpenses);
        returnValue.put("recent5Incomes", latestIncomes);
        returnValue.put("recentTransactions", recentTransactions);
        returnValue.put("budgets", budgetService.getBudgetsForMonth(currentMonth));
        return returnValue;
    }
}
