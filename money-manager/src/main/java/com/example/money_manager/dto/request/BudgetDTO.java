package com.example.money_manager.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BudgetDTO {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String categoryIcon;
    private BigDecimal monthlyLimit;
    private String month;
    private BigDecimal totalSpent;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
