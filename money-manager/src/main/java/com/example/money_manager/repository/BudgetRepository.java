package com.example.money_manager.repository;

import com.example.money_manager.entity.BudgetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<BudgetEntity, Long> {
    Optional<BudgetEntity> findByProfileIdAndCategoryIdAndMonth(Long profileId, Long categoryId, String month);

    @Query("""
        SELECT b
        FROM BudgetEntity b
        JOIN FETCH b.category
        JOIN FETCH b.profile
        WHERE b.profile.id = :profileId
        AND b.month = :month
        """)
    List<BudgetEntity> findByProfileIdAndMonth(@org.springframework.data.repository.query.Param("profileId") Long profileId, @org.springframework.data.repository.query.Param("month") String month);

    List<BudgetEntity> findByProfileId(Long profileId);
    Optional<BudgetEntity> findByIdAndProfileId(Long id, Long profileId);
}
