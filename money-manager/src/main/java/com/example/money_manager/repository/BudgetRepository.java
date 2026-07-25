package com.example.money_manager.repository;

import com.example.money_manager.entity.BudgetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<BudgetEntity, Long> {
    Optional<BudgetEntity> findByProfileIdAndCategoryIdAndMonth(Long profileId, Long categoryId, String month);
    List<BudgetEntity> findByProfileIdAndMonth(Long profileId, String month);
    List<BudgetEntity> findByProfileId(Long profileId);
    Optional<BudgetEntity> findByIdAndProfileId(Long id, Long profileId);
}
