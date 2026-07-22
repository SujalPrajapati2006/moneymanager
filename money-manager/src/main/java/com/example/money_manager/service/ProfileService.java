package com.example.money_manager.service;

import com.example.money_manager.dto.request.AuthDTO;
import com.example.money_manager.dto.request.ProfileDTO;
import com.example.money_manager.entity.ProfileEntity;

import java.util.Map;

public interface ProfileService {

    ProfileDTO registerProfile(ProfileDTO request);
    boolean activateProfile(String activationToken);
    boolean isAccountActive(String email);
    Map<String, Object> authenticateAndGenerateToken(AuthDTO authDTO);
    ProfileEntity getCurrentProfile();
    ProfileDTO getPublicProfile(String email);
}
