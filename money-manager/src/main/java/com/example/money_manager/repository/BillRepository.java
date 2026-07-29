package com.example.money_manager.repository;

import com.example.money_manager.entity.BillEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BillRepository extends JpaRepository<BillEntity, Long> {

    @Query("""
    SELECT b
    FROM BillEntity b
    LEFT JOIN FETCH b.category
    WHERE b.profile.id = :profileId
    ORDER BY b.isPaid ASC, b.dueDate ASC
    """)
    List<BillEntity> findByProfileIdOrderByIsPaidAscDueDateAsc(@Param("profileId") Long profileId);

    @Query("""
    SELECT b
    FROM BillEntity b
    LEFT JOIN FETCH b.category
    WHERE b.profile.id = :profileId
      AND b.isPaid = false
    ORDER BY b.dueDate ASC
    """)
    List<BillEntity> findUpcomingUnpaidBills(@Param("profileId") Long profileId, Pageable pageable);
}
