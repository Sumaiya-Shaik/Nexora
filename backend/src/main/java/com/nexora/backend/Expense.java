
package com.nexora.backend;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "expenses")
public class Expense {

    @Id
    private String id;

    private String userEmail;
    private String title;
    private double amount;
    private String category;
    private String date;

    public Expense() {
    }

    public Expense(String userEmail, String title,
                   double amount, String category, String date) {
        this.userEmail = userEmail;
        this.title = title;
        this.amount = amount;
        this.category = category;
        this.date = date;
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

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
