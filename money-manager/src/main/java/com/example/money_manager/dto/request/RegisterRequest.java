package com.example.money_manager.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "fullName is required")
    private String fullName;

    @NotBlank(message = "email is required")
    @Email(message = "email should be valid")
    private String email;

    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&^#()_+\\-=\\[\\]{};':\"\\\\|,.<>/?]).{6,10}$",
            message = "Password must be 6 to 10 characters long and contain at least one uppercase letter, at least one lowercase letter, at least one digit, and at least one special character."
    )
    private String password;

    private String profileImageUrl;
}
