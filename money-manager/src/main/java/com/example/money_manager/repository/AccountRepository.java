package com.example.money_manager.repository;

import com.example.money_manager.entity.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<AccountEntity, Long> {

    List<AccountEntity> findByProfileIdOrderByIdAsc(Long profileId);

    Optional<AccountEntity> findByProfileIdAndName(Long profileId, String name);

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM IncomeEntity i WHERE i.account.id = :accountId")
    BigDecimal findTotalIncomeByAccountId(@Param("accountId") Long accountId);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM ExpenseEntity e WHERE e.account.id = :accountId")
    BigDecimal findTotalExpenseByAccountId(@Param("accountId") Long accountId);

    @Query("SELECT COUNT(i) FROM IncomeEntity i WHERE i.account.id = :accountId")
    long countIncomesByAccountId(@Param("accountId") Long accountId);

    @Query("SELECT COUNT(e) FROM ExpenseEntity e WHERE e.account.id = :accountId")
    long countExpensesByAccountId(@Param("accountId") Long accountId);
}
