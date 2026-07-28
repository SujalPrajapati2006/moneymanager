package com.example.money_manager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InsightDTO {
    private boolean hasSufficientData;
    private List<String> insights;
}
