package com.example.money_manager.service;

import com.example.money_manager.dto.request.ExpenseDTO;
import com.example.money_manager.dto.request.IncomeDTO;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

public interface ExcelService {

    void writeIncomesToExcel(OutputStream os, List<IncomeDTO> incomes) throws IOException;
    void writeExpensesToExcel(OutputStream os, List<ExpenseDTO> expenses) throws IOException;
}
