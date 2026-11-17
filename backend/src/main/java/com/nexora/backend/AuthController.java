
package com.nexora.backend;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
        "https://nexora-one-weld.vercel.app"

})
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Registration API
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        try {
            User user = new User(
                request.name(),
                request.email(),
                request.password()
            );

            User savedUser = authService.register(user);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                    "message", "Registration successful!",
                    "id", savedUser.getId(),
                    "name", savedUser.getName(),
                    "email", savedUser.getEmail()
                )
            );

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                Map.of("message", e.getMessage())
            );
        }
    }

    // Login API
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        return authService.authenticate(
            request.email(),
            request.password()
        )
        .map(user -> {

            Map<String, Object> response = new LinkedHashMap<>();

            response.put("message", "Login successful!");
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("preferredName", user.getPreferredName());
            response.put("email", user.getEmail());
            response.put("userType", user.getUserType());
            response.put("livingSituation", user.getLivingSituation());
            response.put("monthlyIncome", user.getMonthlyIncome());
            response.put("monthlyExpenses", user.getMonthlyExpenses());
            response.put("onboardingCompleted", user.isOnboardingCompleted());

            return ResponseEntity.ok(response);

        })
        .orElseGet(() ->
            ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                Map.of("message", "Invalid email or password")
            )
        );
    }

    // Save onboarding and financial profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody ProfileRequest request) {

        if (request.email() == null || request.email().isBlank()) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Email is required")
            );
        }

        if (request.monthlyIncome() <= 0) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Income must be greater than zero")
            );
        }

        if (request.preferredName() == null ||
            request.preferredName().isBlank()) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Preferred name is required")
            );
        }

        return authService.updateProfile(
            request.email(),
            request.preferredName(),
            request.userType(),
            request.livingSituation(),
            request.monthlyIncome(),
            request.monthlyExpenses()
        )
        .map(user -> ResponseEntity.ok(
            Map.of(
                "message", "Profile saved successfully!",
                "id", user.getId(),
                "preferredName", user.getPreferredName(),
                "onboardingCompleted", user.isOnboardingCompleted()
            )
        ))
        .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(
            Map.of("message", "User not found")
        ));
    }

    public record RegisterRequest(
        String name,
        String email,
        String password
    ) {}

    public record LoginRequest(
        String email,
        String password
    ) {}

    public record ProfileRequest(
        String email,
        String preferredName,
        String userType,
        String livingSituation,
        double monthlyIncome,
        Map<String, Double> monthlyExpenses
    ) {}
}
