package com.example.money_manager.service.scheduler;

import com.example.money_manager.entity.ExpenseEntity;
import com.example.money_manager.entity.IncomeEntity;
import com.example.money_manager.repository.ExpenseRepository;
import com.example.money_manager.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@EnableScheduling
@RequiredArgsConstructor
@Slf4j
public class RecurringTransactionScheduler {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;

    @Scheduled(cron = "0 0 1 * * ?")
    @Scheduled(initialDelay = 10000, fixedRate = 24 * 60 * 60 * 1000)
    @Transactional
    public void processRecurringTransactions() {
        LocalDate today = LocalDate.now();
        log.info("Processing recurring transactions for date: {}", today);

        processExpenses(today);
        processIncomes(today);
    }

    private void processExpenses(LocalDate today) {
        List<ExpenseEntity> dueExpenses = expenseRepository.findByIsRecurringTrueAndNextDueDateLessThanEqual(today);
        for (ExpenseEntity recurringExpense : dueExpenses) {
            LocalDate dueDate = recurringExpense.getNextDueDate();

            if (recurringExpense.getRecurrenceEndDate() != null && dueDate.isAfter(recurringExpense.getRecurrenceEndDate())) {
                recurringExpense.setIsRecurring(false);
                expenseRepository.save(recurringExpense);
                continue;
            }

            ExpenseEntity generatedExpense = ExpenseEntity.builder()
                    .name(recurringExpense.getName())
                    .icon(recurringExpense.getIcon())
                    .amount(recurringExpense.getAmount())
                    .date(dueDate)
                    .isRecurring(false)
                    .category(recurringExpense.getCategory())
                    .profile(recurringExpense.getProfile())
                    .build();
            expenseRepository.save(generatedExpense);

            LocalDate newNextDueDate = calculateNextDueDate(dueDate, recurringExpense.getRecurrenceFrequency());
            if (recurringExpense.getRecurrenceEndDate() != null && newNextDueDate.isAfter(recurringExpense.getRecurrenceEndDate())) {
                recurringExpense.setIsRecurring(false);
            }
            recurringExpense.setNextDueDate(newNextDueDate);
            expenseRepository.save(recurringExpense);
            log.info("Auto-generated recurring expense '{}' for date {}", recurringExpense.getName(), dueDate);
        }
    }

    private void processIncomes(LocalDate today) {
        List<IncomeEntity> dueIncomes = incomeRepository.findByIsRecurringTrueAndNextDueDateLessThanEqual(today);
        for (IncomeEntity recurringIncome : dueIncomes) {
            LocalDate dueDate = recurringIncome.getNextDueDate();

            if (recurringIncome.getRecurrenceEndDate() != null && dueDate.isAfter(recurringIncome.getRecurrenceEndDate())) {
                recurringIncome.setIsRecurring(false);
                incomeRepository.save(recurringIncome);
                continue;
            }

            IncomeEntity generatedIncome = IncomeEntity.builder()
                    .name(recurringIncome.getName())
                    .icon(recurringIncome.getIcon())
                    .amount(recurringIncome.getAmount())
                    .date(dueDate)
                    .isRecurring(false)
                    .category(recurringIncome.getCategory())
                    .profile(recurringIncome.getProfile())
                    .build();
            incomeRepository.save(generatedIncome);

            LocalDate newNextDueDate = calculateNextDueDate(dueDate, recurringIncome.getRecurrenceFrequency());
            if (recurringIncome.getRecurrenceEndDate() != null && newNextDueDate.isAfter(recurringIncome.getRecurrenceEndDate())) {
                recurringIncome.setIsRecurring(false);
            }
            recurringIncome.setNextDueDate(newNextDueDate);
            incomeRepository.save(recurringIncome);
            log.info("Auto-generated recurring income '{}' for date {}", recurringIncome.getName(), dueDate);
        }
    }

    private LocalDate calculateNextDueDate(LocalDate date, String frequency) {
        if (date == null || frequency == null) return date != null ? date.plusMonths(1) : LocalDate.now().plusMonths(1);
        return switch (frequency.toLowerCase()) {
            case "weekly" -> date.plusWeeks(1);
            case "monthly" -> date.plusMonths(1);
            case "yearly" -> date.plusYears(1);
            default -> date.plusMonths(1);
        };
    }
}
