package com.example.money_manager.controller;

import com.example.money_manager.dto.request.BudgetDTO;
import com.example.money_manager.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    public ResponseEntity<BudgetDTO> saveOrUpdateBudget(@RequestBody BudgetDTO budgetDTO) {
        BudgetDTO saved = budgetService.saveOrUpdateBudget(budgetDTO);
        return ResponseEntity.status(HttpStatus.OK).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<BudgetDTO>> getBudgets(@RequestParam(required = false) String month) {
        List<BudgetDTO> list = budgetService.getBudgetsForMonth(month);
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.noContent().build();
    }
}
