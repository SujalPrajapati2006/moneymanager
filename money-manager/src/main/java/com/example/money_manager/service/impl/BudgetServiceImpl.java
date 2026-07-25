package com.example.money_manager.service.impl;

import com.example.money_manager.dto.request.BudgetDTO;
import com.example.money_manager.entity.BudgetEntity;
import com.example.money_manager.entity.CategoryEntity;
import com.example.money_manager.entity.ProfileEntity;
import com.example.money_manager.exception.ResourceNotFoundException;
import com.example.money_manager.repository.BudgetRepository;
import com.example.money_manager.repository.CategoryRepository;
import com.example.money_manager.repository.ExpenseRepository;
import com.example.money_manager.service.BudgetService;
import com.example.money_manager.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final ExpenseRepository expenseRepository;
    private final ProfileService profileService;

    @Override
    public BudgetDTO saveOrUpdateBudget(BudgetDTO dto) {
        ProfileEntity profile = profileService.getCurrentProfile();

        if (dto.getCategoryId() == null) {
            throw new IllegalArgumentException("Category ID is required for setting budget");
        }

        CategoryEntity category = categoryRepository.findByIdAndProfileId(dto.getCategoryId(), profile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found or access denied"));

        if (!"expense".equalsIgnoreCase(category.getType())) {
            throw new IllegalArgumentException("Budgets can only be set for Expense categories");
        }

        String targetMonth = dto.getMonth();
        if (targetMonth == null || targetMonth.trim().isEmpty()) {
            targetMonth = YearMonth.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
        } else {
            targetMonth = targetMonth.trim();
        }

        Optional<BudgetEntity> existingOpt = budgetRepository.findByProfileIdAndCategoryIdAndMonth(
                profile.getId(), category.getId(), targetMonth
        );

        BudgetEntity budget;
        if (existingOpt.isPresent()) {
            budget = existingOpt.get();
            budget.setMonthlyLimit(dto.getMonthlyLimit());
        } else {
            budget = BudgetEntity.builder()
                    .category(category)
                    .profile(profile)
                    .monthlyLimit(dto.getMonthlyLimit())
                    .month(targetMonth)
                    .build();
        }

        budget = budgetRepository.save(budget);

        return toDTO(budget);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BudgetDTO> getBudgetsForMonth(String month) {
        ProfileEntity profile = profileService.getCurrentProfile();
        String targetMonth = month;
        if (targetMonth == null || targetMonth.trim().isEmpty()) {
            targetMonth = YearMonth.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
        } else {
            targetMonth = targetMonth.trim();
        }

        List<BudgetEntity> budgets = budgetRepository.findByProfileIdAndMonth(profile.getId(), targetMonth);
        return budgets.stream().map(this::toDTO).toList();
    }

    @Override
    public void deleteBudget(Long budgetId) {
        ProfileEntity profile = profileService.getCurrentProfile();
        BudgetEntity budget = budgetRepository.findByIdAndProfileId(budgetId, profile.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found or access denied"));
        budgetRepository.delete(budget);
    }

    private BudgetDTO toDTO(BudgetEntity entity) {
        YearMonth ym = YearMonth.parse(entity.getMonth(), DateTimeFormatter.ofPattern("yyyy-MM"));
        LocalDate startDate = ym.atDay(1);
        LocalDate endDate = ym.atEndOfMonth();

        BigDecimal spent = expenseRepository.findTotalExpenseByProfileIdAndCategoryIdAndDateBetween(
                entity.getProfile().getId(),
                entity.getCategory().getId(),
                startDate,
                endDate
        );

        if (spent == null) {
            spent = BigDecimal.ZERO;
        }

        return BudgetDTO.builder()
                .id(entity.getId())
                .categoryId(entity.getCategory().getId())
                .categoryName(entity.getCategory().getName())
                .categoryIcon(entity.getCategory().getIcon())
                .monthlyLimit(entity.getMonthlyLimit())
                .month(entity.getMonth())
                .totalSpent(spent)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
