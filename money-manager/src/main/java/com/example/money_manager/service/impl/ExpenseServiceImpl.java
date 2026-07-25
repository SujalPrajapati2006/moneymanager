package com.example.money_manager.service.impl;

import com.example.money_manager.dto.request.ExpenseDTO;
import com.example.money_manager.entity.AccountEntity;
import com.example.money_manager.entity.CategoryEntity;
import com.example.money_manager.entity.ExpenseEntity;
import com.example.money_manager.entity.ProfileEntity;
import com.example.money_manager.exception.ResourceNotFoundException;
import com.example.money_manager.exception.UnauthorizedException;
import com.example.money_manager.repository.CategoryRepository;
import com.example.money_manager.repository.ExpenseRepository;
import com.example.money_manager.service.AccountService;
import com.example.money_manager.service.ExpenseService;
import com.example.money_manager.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExpenseServiceImpl implements ExpenseService {

    private final CategoryRepository categoryRepository;
    private final ExpenseRepository expenseRepository;
    private final ProfileService profileService;
    private final AccountService accountService;

    // Adds a new expense to the database
    @Transactional
    public ExpenseDTO addExpense(ExpenseDTO dto) {
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        ExpenseEntity newExpense = toEntity(dto, profile, category);
        newExpense = expenseRepository.save(newExpense);
        return toDTO(newExpense);
    }

    // Retrieves all expenses for current month/based on the start date and end date
    public List<ExpenseDTO> getCurrentMonthExpensesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        LocalDate now = LocalDate.now();
        LocalDate startDate = now.withDayOfMonth(1);
        LocalDate endDate = now.withDayOfMonth(now.lengthOfMonth());
        List<ExpenseEntity> list = expenseRepository.findByProfileIdAndDateBetween(profile.getId(), startDate, endDate);
        return list.stream().map(this::toDTO).toList();
    }

    //delete expense by id for current user
    @Transactional
    public void deleteExpense(Long expenseId) {
        ProfileEntity profile = profileService.getCurrentProfile();
        ExpenseEntity entity = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        if (!entity.getProfile().getId().equals(profile.getId())) {
            throw new UnauthorizedException("Unauthorized to delete this expense");
        }
        expenseRepository.delete(entity);
    }

    // Get latest 5 expenses for current user
    public List<ExpenseDTO> getLatest5ExpensesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<ExpenseEntity> list = expenseRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
        return list.stream().map(this::toDTO).toList();
    }

    // Get total expenses for current user
    public BigDecimal getTotalExpenseForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        BigDecimal total = expenseRepository.findTotalExpenseByProfileId(profile.getId());
        return total != null ? total: BigDecimal.ZERO;
    }

    //filter expenses
    public List<ExpenseDTO> filterExpenses(LocalDate startDate, LocalDate endDate, String keyword, Sort sort) {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<ExpenseEntity> list = expenseRepository.findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(profile.getId(), startDate, endDate, keyword, sort);
        return list.stream().map(this::toDTO).toList();
    }

    //Notifications
    public List<ExpenseDTO> getExpensesForUserOnDate(Long profileId, LocalDate date) {
        List<ExpenseEntity> list = expenseRepository.findByProfileIdAndDate(profileId, date);
        return list.stream().map(this::toDTO).toList();
    }

    //helper methods
    private ExpenseEntity toEntity(ExpenseDTO dto, ProfileEntity profile, CategoryEntity category) {
        boolean isRecurring = Boolean.TRUE.equals(dto.getIsRecurring());
        LocalDate txDate = dto.getDate() != null ? dto.getDate() : LocalDate.now();
        LocalDate nextDue = isRecurring ? (dto.getNextDueDate() != null ? dto.getNextDueDate() : calculateNextDueDate(txDate, dto.getRecurrenceFrequency())) : null;

        AccountEntity account = accountService.getAccountEntityForCurrentUser(dto.getAccountId());

        return ExpenseEntity.builder()
                .name(dto.getName())
                .icon(dto.getIcon())
                .amount(dto.getAmount())
                .date(txDate)
                .isRecurring(isRecurring)
                .recurrenceFrequency(isRecurring ? dto.getRecurrenceFrequency() : null)
                .nextDueDate(nextDue)
                .recurrenceEndDate(isRecurring ? dto.getRecurrenceEndDate() : null)
                .profile(profile)
                .category(category)
                .account(account)
                .build();
    }

    private LocalDate calculateNextDueDate(LocalDate date, String frequency) {
        if (date == null || frequency == null) return null;
        return switch (frequency.toLowerCase()) {
            case "weekly" -> date.plusWeeks(1);
            case "monthly" -> date.plusMonths(1);
            case "yearly" -> date.plusYears(1);
            default -> date.plusMonths(1);
        };
    }

    private ExpenseDTO toDTO(ExpenseEntity entity) {
        return ExpenseDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .icon(entity.getIcon())
                .categoryId(entity.getCategory() != null ? entity.getCategory().getId(): null)
                .categoryName(entity.getCategory() != null ? entity.getCategory().getName(): "N/A")
                .accountId(entity.getAccount() != null ? entity.getAccount().getId() : null)
                .accountName(entity.getAccount() != null ? entity.getAccount().getName() : "Cash")
                .amount(entity.getAmount())
                .date(entity.getDate())
                .isRecurring(entity.getIsRecurring())
                .recurrenceFrequency(entity.getRecurrenceFrequency())
                .nextDueDate(entity.getNextDueDate())
                .recurrenceEndDate(entity.getRecurrenceEndDate())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
