package com.example.money_manager.service.impl;

import com.example.money_manager.dto.response.InsightDTO;
import com.example.money_manager.entity.ExpenseEntity;
import com.example.money_manager.entity.IncomeEntity;
import com.example.money_manager.entity.ProfileEntity;
import com.example.money_manager.repository.ExpenseRepository;
import com.example.money_manager.repository.IncomeRepository;
import com.example.money_manager.service.InsightService;
import com.example.money_manager.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InsightServiceImpl implements InsightService {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final ProfileService profileService;

    @Override
    public InsightDTO generateInsightsForCurrentUser(Long accountId) {
        ProfileEntity profile = profileService.getCurrentProfile();

        // 1. Fetch all expenses and incomes for user
        List<ExpenseEntity> allExpenses = expenseRepository.findByProfileIdOrderByDateDesc(profile.getId());
        List<IncomeEntity> allIncomes = incomeRepository.findByProfileIdOrderByDateDesc(profile.getId());

        // Filter by accountId if provided
        if (accountId != null) {
            allExpenses = allExpenses.stream()
                    .filter(e -> e.getAccount() != null && accountId.equals(e.getAccount().getId()))
                    .toList();
            allIncomes = allIncomes.stream()
                    .filter(i -> i.getAccount() != null && accountId.equals(i.getAccount().getId()))
                    .toList();
        }

        YearMonth currentYearMonth = YearMonth.now();
        YearMonth m1 = currentYearMonth.minusMonths(1);
        YearMonth m2 = currentYearMonth.minusMonths(2);
        YearMonth m3 = currentYearMonth.minusMonths(3);

        // Calculate unique prior months with transaction history
        Set<YearMonth> priorMonthsWithData = new HashSet<>();
        for (ExpenseEntity e : allExpenses) {
            YearMonth ym = YearMonth.from(e.getDate());
            if (ym.isBefore(currentYearMonth)) {
                priorMonthsWithData.add(ym);
            }
        }
        for (IncomeEntity i : allIncomes) {
            YearMonth ym = YearMonth.from(i.getDate());
            if (ym.isBefore(currentYearMonth)) {
                priorMonthsWithData.add(ym);
            }
        }

        List<ExpenseEntity> currentMonthExpenses = allExpenses.stream()
                .filter(e -> YearMonth.from(e.getDate()).equals(currentYearMonth))
                .toList();

        // If user has zero expenses in current month and no historical data
        if (currentMonthExpenses.isEmpty() && priorMonthsWithData.isEmpty()) {
            return InsightDTO.builder()
                    .hasSufficientData(false)
                    .insights(List.of("Keep logging transactions — we'll start showing spending insights once you have a bit more history."))
                    .build();
        }

        List<String> generatedInsights = new ArrayList<>();

        // Helper maps for category spend
        Map<String, BigDecimal> currentCatSpend = new HashMap<>();
        for (ExpenseEntity e : currentMonthExpenses) {
            String catName = e.getCategory() != null ? e.getCategory().getName() : "Other";
            currentCatSpend.put(catName, currentCatSpend.getOrDefault(catName, BigDecimal.ZERO).add(e.getAmount()));
        }

        // -------------------------------------------------------------
        // Rule 1: Category Spike Detection (>25% over 3-month average)
        // (Only applicable if there are at least 2 prior months of data)
        // -------------------------------------------------------------
        if (priorMonthsWithData.size() >= 2) {
            List<ExpenseEntity> prior3MonthExpenses = allExpenses.stream()
                    .filter(e -> {
                        YearMonth ym = YearMonth.from(e.getDate());
                        return ym.equals(m1) || ym.equals(m2) || ym.equals(m3);
                    })
                    .toList();

            Map<String, Map<YearMonth, BigDecimal>> categoryMonthlySpend = new HashMap<>();
            for (ExpenseEntity e : prior3MonthExpenses) {
                String catName = e.getCategory() != null ? e.getCategory().getName() : "Other";
                YearMonth ym = YearMonth.from(e.getDate());
                categoryMonthlySpend.putIfAbsent(catName, new HashMap<>());
                Map<YearMonth, BigDecimal> monthMap = categoryMonthlySpend.get(catName);
                monthMap.put(ym, monthMap.getOrDefault(ym, BigDecimal.ZERO).add(e.getAmount()));
            }

            String spikeInsight = null;
            double maxPctIncrease = 0.0;

            for (Map.Entry<String, BigDecimal> entry : currentCatSpend.entrySet()) {
                String catName = entry.getKey();
                BigDecimal currentAmount = entry.getValue();

                Map<YearMonth, BigDecimal> priorMonthsMap = categoryMonthlySpend.get(catName);
                if (priorMonthsMap != null && priorMonthsMap.size() >= 2) {
                    BigDecimal priorSum = priorMonthsMap.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
                    BigDecimal priorAvg = priorSum.divide(BigDecimal.valueOf(priorMonthsMap.size()), 2, RoundingMode.HALF_UP);

                    if (priorAvg.compareTo(BigDecimal.ZERO) > 0) {
                        BigDecimal increaseRatio = currentAmount.subtract(priorAvg).divide(priorAvg, 4, RoundingMode.HALF_UP);
                        double pctIncrease = increaseRatio.doubleValue() * 100;

                        if (pctIncrease >= 25.0 && pctIncrease > maxPctIncrease) {
                            maxPctIncrease = pctIncrease;
                            spikeInsight = String.format(
                                    "You spent %d%% more on %s this month (%s) compared to your 3-month average (%s).",
                                    Math.round(pctIncrease),
                                    catName,
                                    formatCurrency(currentAmount),
                                    formatCurrency(priorAvg)
                            );
                        }
                    }
                }
            }

            if (spikeInsight != null) {
                generatedInsights.add(spikeInsight);
            }
        }

        // -------------------------------------------------------------
        // Rule 2: Top Expense Category This Month
        // -------------------------------------------------------------
        Optional<Map.Entry<String, BigDecimal>> topCategory = currentCatSpend.entrySet().stream()
                .max(Map.Entry.comparingByValue());

        if (topCategory.isPresent() && topCategory.get().getValue().compareTo(BigDecimal.ZERO) > 0) {
            generatedInsights.add(String.format(
                    "%s is your top expense category this month at %s.",
                    topCategory.get().getKey(),
                    formatCurrency(topCategory.get().getValue())
            ));
        }

        // -------------------------------------------------------------
        // Rule 3: Largest Single Expense Transaction This Month
        // -------------------------------------------------------------
        Optional<ExpenseEntity> maxExpense = currentMonthExpenses.stream()
                .max(Comparator.comparing(ExpenseEntity::getAmount));

        if (maxExpense.isPresent()) {
            ExpenseEntity e = maxExpense.get();
            String formattedDate = formatDate(e.getDate());
            generatedInsights.add(String.format(
                    "Your largest single expense this month was '%s' at %s on %s.",
                    e.getName(),
                    formatCurrency(e.getAmount()),
                    formattedDate
            ));
        }

        // -------------------------------------------------------------
        // Rule 4: Total Income vs Expense 3-Month Savings Trend
        // -------------------------------------------------------------
        if (priorMonthsWithData.size() >= 2) {
            BigDecimal expM1 = getMonthlyTotalExpenses(allExpenses, m1);
            BigDecimal expM2 = getMonthlyTotalExpenses(allExpenses, m2);
            BigDecimal expM3 = getMonthlyTotalExpenses(allExpenses, m3);

            BigDecimal incM1 = getMonthlyTotalIncomes(allIncomes, m1);
            BigDecimal incM2 = getMonthlyTotalIncomes(allIncomes, m2);
            BigDecimal incM3 = getMonthlyTotalIncomes(allIncomes, m3);

            BigDecimal savingsM1 = incM1.subtract(expM1);
            BigDecimal savingsM2 = incM2.subtract(expM2);
            BigDecimal savingsM3 = incM3.subtract(expM3);

            if (savingsM1.compareTo(savingsM2) > 0 && savingsM2.compareTo(savingsM3) > 0) {
                generatedInsights.add("Your monthly net savings have been steadily increasing over the last 3 months.");
            } else if (expM1.compareTo(expM2) < 0 && expM2.compareTo(expM3) < 0) {
                generatedInsights.add("Your total monthly expenses have consistently decreased over the last 3 months.");
            }
        }

        return InsightDTO.builder()
                .hasSufficientData(true)
                .insights(generatedInsights.isEmpty() ? List.of("Keep logging transactions to see personalized spending trends.") : generatedInsights)
                .build();
    }

    private BigDecimal getMonthlyTotalExpenses(List<ExpenseEntity> expenses, YearMonth ym) {
        return expenses.stream()
                .filter(e -> YearMonth.from(e.getDate()).equals(ym))
                .map(ExpenseEntity::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal getMonthlyTotalIncomes(List<IncomeEntity> incomes, YearMonth ym) {
        return incomes.stream()
                .filter(i -> YearMonth.from(i.getDate()).equals(ym))
                .map(IncomeEntity::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String formatCurrency(BigDecimal amount) {
        if (amount == null) amount = BigDecimal.ZERO;
        NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
        return formatter.format(amount);
    }

    private String formatDate(LocalDate date) {
        if (date == null) return "";
        int day = date.getDayOfMonth();
        String suffix = getDayOfMonthSuffix(day);
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM");
        return day + suffix + " " + date.format(monthFormatter);
    }

    private String getDayOfMonthSuffix(int n) {
        if (n >= 11 && n <= 13) {
            return "th";
        }
        return switch (n % 10) {
            case 1 -> "st";
            case 2 -> "nd";
            case 3 -> "rd";
            default -> "th";
        };
    }
}
