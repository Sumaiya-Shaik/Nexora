
package com.nexora.backend;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
        "https://nexora-one-weld.vercel.app"

})
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseRepository expenseRepository;

    public ExpenseController(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @GetMapping
    public List<Expense> getExpenses(@RequestParam String email) {
        return expenseRepository.findByUserEmail(email);
    }

    @PostMapping
    public ResponseEntity<Expense> addExpense(
            @RequestBody Expense expense) {

        if (expense.getUserEmail() == null ||
            expense.getUserEmail().isBlank() ||
            expense.getTitle() == null ||
            expense.getTitle().isBlank() ||
            expense.getAmount() <= 0) {
            return ResponseEntity.badRequest().build();
        }

        Expense savedExpense = expenseRepository.save(expense);
        return ResponseEntity.ok(savedExpense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(
            @PathVariable String id) {

        if (!expenseRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        expenseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
