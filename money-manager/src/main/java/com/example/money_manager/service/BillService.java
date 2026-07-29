package com.example.money_manager.service;

import com.example.money_manager.dto.request.BillDTO;
import java.util.List;

public interface BillService {
    BillDTO addBill(BillDTO dto);
    List<BillDTO> getBillsForCurrentUser();
    List<BillDTO> getUpcoming3UnpaidBillsForCurrentUser();
    BillDTO markBillAsPaid(Long billId, Long accountId, Boolean createExpense);
    void deleteBill(Long billId);
}
