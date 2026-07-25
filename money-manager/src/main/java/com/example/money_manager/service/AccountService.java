package com.example.money_manager.service;

import com.example.money_manager.dto.request.AccountDTO;
import com.example.money_manager.entity.AccountEntity;
import com.example.money_manager.entity.ProfileEntity;

import java.util.List;

public interface AccountService {

    AccountDTO createAccount(AccountDTO dto);

    List<AccountDTO> getAccountsForCurrentUser();

    AccountDTO updateAccount(Long accountId, AccountDTO dto);

    void deleteAccount(Long accountId, Long reassignAccountId);

    AccountEntity getAccountEntityForCurrentUser(Long accountId);

    void createDefaultAccountForProfile(ProfileEntity profile);
}
