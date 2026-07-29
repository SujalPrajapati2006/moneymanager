package com.example.money_manager.service.impl;

import com.example.money_manager.dto.request.BillDTO;
import com.example.money_manager.dto.request.ExpenseDTO;
import com.example.money_manager.entity.BillEntity;
import com.example.money_manager.entity.CategoryEntity;
import com.example.money_manager.entity.ProfileEntity;
import com.example.money_manager.exception.ResourceNotFoundException;
import com.example.money_manager.exception.UnauthorizedException;
import com.example.money_manager.repository.BillRepository;
import com.example.money_manager.repository.CategoryRepository;
import com.example.money_manager.service.BillService;
import com.example.money_manager.service.ExpenseService;
import com.example.money_manager.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BillServiceImpl implements BillService {

    private final BillRepository billRepository;
    private final CategoryRepository categoryRepository;
    private final ProfileService profileService;
    private final ExpenseService expenseService;

    @Override
    public BillDTO addBill(BillDTO dto) {
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity category = null;

        if (dto.getCategoryId() != null) {
            category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        }

        BillEntity entity = BillEntity.builder()
                .name(dto.getName())
                .amount(dto.getAmount())
                .dueDate(dto.getDueDate())
                .isPaid(false)
                .category(category)
                .profile(profile)
                .build();

        entity = billRepository.save(entity);
        return toDTO(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BillDTO> getBillsForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        return billRepository.findByProfileIdOrderByIsPaidAscDueDateAsc(profile.getId())
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BillDTO> getUpcoming3UnpaidBillsForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        return billRepository.findUpcomingUnpaidBills(profile.getId(), PageRequest.of(0, 3))
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public BillDTO markBillAsPaid(Long billId, Long accountId, Boolean createExpense) {
        ProfileEntity profile = profileService.getCurrentProfile();
        BillEntity bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found"));

        if (!bill.getProfile().getId().equals(profile.getId())) {
            throw new UnauthorizedException("You are not authorized to access this bill");
        }

        bill.setIsPaid(true);
        bill = billRepository.save(bill);

        // Optionally create matching Expense entry
        if (Boolean.TRUE.equals(createExpense) && accountId != null && bill.getCategory() != null) {
            ExpenseDTO expenseDTO = ExpenseDTO.builder()
                    .name(bill.getName())
                    .amount(bill.getAmount())
                    .date(LocalDate.now())
                    .categoryId(bill.getCategory().getId())
                    .accountId(accountId)
                    .icon(bill.getCategory().getIcon())
                    .build();
            expenseService.addExpense(expenseDTO);
        }

        return toDTO(bill);
    }

    @Override
    public void deleteBill(Long billId) {
        ProfileEntity profile = profileService.getCurrentProfile();
        BillEntity bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found"));

        if (!bill.getProfile().getId().equals(profile.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this bill");
        }

        billRepository.delete(bill);
    }

    private BillDTO toDTO(BillEntity entity) {
        return BillDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .amount(entity.getAmount())
                .dueDate(entity.getDueDate())
                .isPaid(entity.getIsPaid())
                .categoryId(entity.getCategory() != null ? entity.getCategory().getId() : null)
                .categoryName(entity.getCategory() != null ? entity.getCategory().getName() : null)
                .categoryIcon(entity.getCategory() != null ? entity.getCategory().getIcon() : null)
                .profileId(entity.getProfile().getId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
