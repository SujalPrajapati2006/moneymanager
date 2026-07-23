package com.example.money_manager.config;

import com.example.money_manager.security.JwtRequestFilter;
import com.example.money_manager.service.impl.AppUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final AppUserDetailsService appUserDetailsService;
    private final JwtRequestFilter jwtRequestFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http){
                 http.cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/status", "/health", "/register", "/activate", "/login").permitAll()
                        .anyRequest().authenticated())
                .exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authException) ->
                        response.sendError(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized")
                ))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                     .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @org.springframework.beans.factory.annotation.Value("${money.manager.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(List.of(
            "http://localhost:5173",
            "https://*.vercel.app",
            "https://*.amplifyapp.com",
            frontendUrl
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(appUserDetailsService);

        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration config
    ) throws Exception {
        return config.getAuthenticationManager();
    }
}
