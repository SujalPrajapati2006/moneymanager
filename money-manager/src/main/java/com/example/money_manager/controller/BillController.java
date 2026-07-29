package com.example.money_manager.controller;

import com.example.money_manager.dto.request.BillDTO;
import com.example.money_manager.service.BillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bills")
@RequiredArgsConstructor
public class BillController {

    private final BillService billService;

    @GetMapping
    public ResponseEntity<List<BillDTO>> getBills() {
        return ResponseEntity.ok(billService.getBillsForCurrentUser());
    }

    @PostMapping
    public ResponseEntity<BillDTO> addBill(@RequestBody BillDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(billService.addBill(dto));
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<BillDTO> markAsPaid(
            @PathVariable Long id,
            @RequestParam(required = false) Long accountId,
            @RequestParam(defaultValue = "false") Boolean createExpense
    ) {
        return ResponseEntity.ok(billService.markBillAsPaid(id, accountId, createExpense));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable Long id) {
        billService.deleteBill(id);
        return ResponseEntity.noContent().build();
    }
}
