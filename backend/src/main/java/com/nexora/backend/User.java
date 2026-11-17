
package com.nexora.backend;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.LinkedHashMap;
import java.util.Map;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;
    private String preferredName;
    private String email;
    private String password;

    // Onboarding information
    private String userType;
    private String livingSituation;
    private boolean onboardingCompleted = false;

    // Financial information
    private double monthlyIncome;
    private Map<String, Double> monthlyExpenses = new LinkedHashMap<>();

    public User() {
    }

    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.preferredName = name;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPreferredName() {
        return preferredName;
    }

    public void setPreferredName(String preferredName) {
        this.preferredName = preferredName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getLivingSituation() {
        return livingSituation;
    }

    public void setLivingSituation(String livingSituation) {
        this.livingSituation = livingSituation;
    }

    public boolean isOnboardingCompleted() {
        return onboardingCompleted;
    }

    public void setOnboardingCompleted(boolean onboardingCompleted) {
        this.onboardingCompleted = onboardingCompleted;
    }

    public double getMonthlyIncome() {
        return monthlyIncome;
    }

    public void setMonthlyIncome(double monthlyIncome) {
        this.monthlyIncome = monthlyIncome;
    }

    public Map<String, Double> getMonthlyExpenses() {
        return monthlyExpenses;
    }

    public void setMonthlyExpenses(Map<String, Double> monthlyExpenses) {
        this.monthlyExpenses = monthlyExpenses;
    }
}
