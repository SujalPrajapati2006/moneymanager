package com.example.money_manager.service.impl;

import com.example.money_manager.dto.request.AccountDTO;
import com.example.money_manager.entity.AccountEntity;
import com.example.money_manager.entity.ExpenseEntity;
import com.example.money_manager.entity.IncomeEntity;
import com.example.money_manager.entity.ProfileEntity;
import com.example.money_manager.exception.ResourceNotFoundException;
import com.example.money_manager.exception.UnauthorizedException;
import com.example.money_manager.repository.AccountRepository;
import com.example.money_manager.repository.ExpenseRepository;
import com.example.money_manager.repository.IncomeRepository;
import com.example.money_manager.service.AccountService;
import com.example.money_manager.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final ProfileService profileService;


    @Override
    @Transactional
    public AccountDTO createAccount(AccountDTO dto) {
        ProfileEntity profile = profileService.getCurrentProfile();
        AccountEntity account = AccountEntity.builder()
                .name(dto.getName())
                .type(dto.getType() != null ? dto.getType().toLowerCase() : "cash")
                .profile(profile)
                .build();
        account = accountRepository.save(account);
        return toDTO(account);
    }

    @Override
    public List<AccountDTO> getAccountsForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<AccountEntity> accounts = accountRepository.findByProfileIdOrderByIdAsc(profile.getId());
        if (accounts.isEmpty()) {
            createDefaultAccountForProfile(profile);
            accounts = accountRepository.findByProfileIdOrderByIdAsc(profile.getId());
        }
        return accounts.stream().map(this::toDTO).toList();
    }

    @Override
    @Transactional
    public AccountDTO updateAccount(Long accountId, AccountDTO dto) {
        ProfileEntity profile = profileService.getCurrentProfile();
        AccountEntity account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        if (!account.getProfile().getId().equals(profile.getId())) {
            throw new UnauthorizedException("Unauthorized to update this account");
        }
        account.setName(dto.getName());
        if (dto.getType() != null) {
            account.setType(dto.getType().toLowerCase());
        }
        account = accountRepository.save(account);
        return toDTO(account);
    }

    @Override
    @Transactional
    public void deleteAccount(Long accountId, Long reassignAccountId) {
        ProfileEntity profile = profileService.getCurrentProfile();
        AccountEntity accountToDelete = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        if (!accountToDelete.getProfile().getId().equals(profile.getId())) {
            throw new UnauthorizedException("Unauthorized to delete this account");
        }

        if (reassignAccountId != null) {
            AccountEntity targetAccount = accountRepository.findById(reassignAccountId)
                    .orElseThrow(() -> new ResourceNotFoundException("Target reassign account not found"));
            if (!targetAccount.getProfile().getId().equals(profile.getId())) {
                throw new UnauthorizedException("Unauthorized target account");
            }

            reassignTransactions(accountId, targetAccount);
        } else {
            deleteTransactionsForAccount(accountId);
        }

        accountRepository.delete(accountToDelete);
    }

    @Override
    public AccountEntity getAccountEntityForCurrentUser(Long accountId) {
        ProfileEntity profile = profileService.getCurrentProfile();
        if (accountId != null) {
            AccountEntity account = accountRepository.findById(accountId)
                    .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
            if (!account.getProfile().getId().equals(profile.getId())) {
                throw new UnauthorizedException("Unauthorized account access");
            }
            return account;
        }
        List<AccountEntity> list = accountRepository.findByProfileIdOrderByIdAsc(profile.getId());
        if (list.isEmpty()) {
            createDefaultAccountForProfile(profile);
            list = accountRepository.findByProfileIdOrderByIdAsc(profile.getId());
        }
        return list.get(0);
    }

    @Override
    @Transactional
    public void createDefaultAccountForProfile(ProfileEntity profile) {
        if (accountRepository.findByProfileIdAndName(profile.getId(), "Cash").isEmpty()) {
            AccountEntity defaultAccount = AccountEntity.builder()
                    .name("Cash")
                    .type("cash")
                    .profile(profile)
                    .build();
            accountRepository.save(defaultAccount);
        }
    }

    private void reassignTransactions(Long oldAccountId, AccountEntity newAccount) {
        List<IncomeEntity> incomes = incomeRepository.findAll().stream()
                .filter(i -> i.getAccount() != null && i.getAccount().getId().equals(oldAccountId))
                .toList();
        for (IncomeEntity income : incomes) {
            income.setAccount(newAccount);
            incomeRepository.save(income);
        }

        List<ExpenseEntity> expenses = expenseRepository.findAll().stream()
                .filter(e -> e.getAccount() != null && e.getAccount().getId().equals(oldAccountId))
                .toList();
        for (ExpenseEntity expense : expenses) {
            expense.setAccount(newAccount);
            expenseRepository.save(expense);
        }
    }

    private void deleteTransactionsForAccount(Long accountId) {
        List<IncomeEntity> incomes = incomeRepository.findAll().stream()
                .filter(i -> i.getAccount() != null && i.getAccount().getId().equals(accountId))
                .toList();
        incomeRepository.deleteAll(incomes);

        List<ExpenseEntity> expenses = expenseRepository.findAll().stream()
                .filter(e -> e.getAccount() != null && e.getAccount().getId().equals(accountId))
                .toList();
        expenseRepository.deleteAll(expenses);
    }

    private AccountDTO toDTO(AccountEntity entity) {
        BigDecimal totalIncome = accountRepository.findTotalIncomeByAccountId(entity.getId());
        BigDecimal totalExpense = accountRepository.findTotalExpenseByAccountId(entity.getId());
        BigDecimal balance = totalIncome.subtract(totalExpense);

        return AccountDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .type(entity.getType())
                .balance(balance)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
