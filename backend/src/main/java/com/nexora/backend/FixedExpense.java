
package com.nexora.backend;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "fixed_expenses")
public class FixedExpense {

    @Id
    private String id;

    private String userEmail;
    private String title;
    private double amount;
    private String category;
    private int dueDay;
    private boolean active = true;

    public FixedExpense() {
    }

    public String getId() {
        return id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getDueDay() {
        return dueDay;
    }

    public void setDueDay(int dueDay) {
        this.dueDay = dueDay;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
