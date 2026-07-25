package com.example.money_manager.controller;

import com.example.money_manager.dto.request.AccountDTO;
import com.example.money_manager.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<AccountDTO> createAccount(@RequestBody AccountDTO dto) {
        AccountDTO created = accountService.createAccount(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<AccountDTO>> getAccounts() {
        List<AccountDTO> list = accountService.getAccountsForCurrentUser();
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountDTO> updateAccount(@PathVariable Long id, @RequestBody AccountDTO dto) {
        AccountDTO updated = accountService.updateAccount(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(
            @PathVariable Long id,
            @RequestParam(required = false) Long reassignAccountId
    ) {
        accountService.deleteAccount(id, reassignAccountId);
        return ResponseEntity.noContent().build();
    }
}
