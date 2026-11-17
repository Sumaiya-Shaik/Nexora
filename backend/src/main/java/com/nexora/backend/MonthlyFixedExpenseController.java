
package com.nexora.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.List;

@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174",
        "https://nexora-one-weld.vercel.app"

})
@RestController
@RequestMapping("/api/fixed-expenses/monthly")
public class MonthlyFixedExpenseController {

    private final FixedExpenseService service;

    public MonthlyFixedExpenseController(FixedExpenseService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<FixedExpenseOccurrence>> getMonthlyExpenses(
            @RequestParam String email,
            @RequestParam String month) {

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            YearMonth.parse(month);
        } catch (DateTimeParseException | NullPointerException e) {
            return ResponseEntity.badRequest().build();
        }

        List<FixedExpenseOccurrence> expenses =
                service.generateMonthlyExpenses(email, month);

        return ResponseEntity.ok(expenses);
    }
}
