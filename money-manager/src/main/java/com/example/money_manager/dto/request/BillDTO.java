package com.example.money_manager.dto.request;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BillDTO {
    private Long id;
    private String name;
    private BigDecimal amount;
    private LocalDate dueDate;
    private Boolean isPaid;

    private Long categoryId;
    private String categoryName;
    private String categoryIcon;

    private Long profileId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
