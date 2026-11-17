
package com.nexora.backend;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

public Optional<User> updateProfile(
        String email,
        String preferredName,
        String userType,
        String livingSituation,
        double monthlyIncome,
        Map<String, Double> monthlyExpenses) {

    return userRepository.findByEmail(email).map(user -> {

        user.setPreferredName(preferredName);
        user.setUserType(userType);
        user.setLivingSituation(livingSituation);
        user.setMonthlyIncome(monthlyIncome);
        user.setMonthlyExpenses(monthlyExpenses);
        user.setOnboardingCompleted(true);

        return userRepository.save(user);
    });
}


    public User register(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    // Existing login verification
    public boolean login(String email, String password) {

        return userRepository.findByEmail(email)
                .map(user -> passwordEncoder.matches(
                        password, user.getPassword()))
                .orElse(false);
    }

    // Retrieve user only when the password is valid
    public Optional<User> authenticate(String email, String password) {

        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(
                        password, user.getPassword()));
    }

    // Find user profile using email
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
