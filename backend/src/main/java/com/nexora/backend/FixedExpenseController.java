
package com.nexora.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
        "https://nexora-one-weld.vercel.app"

})
@RestController
@RequestMapping("/api/fixed-expenses")
public class FixedExpenseController {

    private final FixedExpenseRepository repository;

    public FixedExpenseController(FixedExpenseRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<FixedExpense> getFixedExpenses(
            @RequestParam String email) {
        return repository.findByUserEmail(email);
    }

    @PostMapping
    public ResponseEntity<FixedExpense> addFixedExpense(
            @RequestBody FixedExpense expense) {

        if (expense.getUserEmail() == null ||
            expense.getUserEmail().isBlank() ||
            expense.getTitle() == null ||
            expense.getTitle().isBlank() ||
            expense.getAmount() <= 0 ||
            expense.getDueDay() < 1 ||
            expense.getDueDay() > 31) {
            return ResponseEntity.badRequest().build();
        }

        expense.setActive(true);
        return ResponseEntity.ok(repository.save(expense));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FixedExpense> updateFixedExpense(
            @PathVariable String id,
            @RequestBody FixedExpense updated) {

        return repository.findById(id)
            .map(existing -> {
                existing.setTitle(updated.getTitle());
                existing.setAmount(updated.getAmount());
                existing.setCategory(updated.getCategory());
                existing.setDueDay(updated.getDueDay());

                return ResponseEntity.ok(repository.save(existing));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<FixedExpense> updateStatus(
            @PathVariable String id,
            @RequestParam boolean active) {

        return repository.findById(id)
            .map(existing -> {
                existing.setActive(active);
                return ResponseEntity.ok(repository.save(existing));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFixedExpense(
            @PathVariable String id) {

        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
