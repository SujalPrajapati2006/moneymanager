package com.example.money_manager.service;

import com.example.money_manager.dto.request.CategoryDTO;

import java.util.List;

public interface CategoryService {

    CategoryDTO saveCategory(CategoryDTO categoryDTO);
    List<CategoryDTO> getCategoriesForCurrentUser();
    List<CategoryDTO> getCategoriesByTypeForCurrentUser(String type);
    CategoryDTO updateCategory(Long categoryId, CategoryDTO dto);
}
