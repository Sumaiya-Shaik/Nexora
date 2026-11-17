
package com.nexora.backend;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "fixed_expense_occurrences")
public class FixedExpenseOccurrence {

    @Id
    private String id;

    private String userEmail;
    private String fixedExpenseId;
    private String title;
    private double amount;
    private String category;
    private String yearMonth;
    private String dueDate;
    private String status = "PENDING";
    private String paidDate;

    public FixedExpenseOccurrence() {
    }

    public String getId() { return id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getFixedExpenseId() { return fixedExpenseId; }
    public void setFixedExpenseId(String fixedExpenseId) {
        this.fixedExpenseId = fixedExpenseId;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getYearMonth() { return yearMonth; }
    public void setYearMonth(String yearMonth) {
        this.yearMonth = yearMonth;
    }

    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaidDate() { return paidDate; }
    public void setPaidDate(String paidDate) { this.paidDate = paidDate; }
}
