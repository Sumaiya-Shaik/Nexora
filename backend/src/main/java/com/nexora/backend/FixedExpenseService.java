
package com.nexora.backend;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class FixedExpenseService {

    private final FixedExpenseRepository fixedExpenseRepository;
    private final FixedExpenseOccurrenceRepository occurrenceRepository;

    public FixedExpenseService(
            FixedExpenseRepository fixedExpenseRepository,
            FixedExpenseOccurrenceRepository occurrenceRepository) {

        this.fixedExpenseRepository = fixedExpenseRepository;
        this.occurrenceRepository = occurrenceRepository;
    }

    public List<FixedExpenseOccurrence> generateMonthlyExpenses(
            String email, String yearMonth) {

        YearMonth month = YearMonth.parse(yearMonth);

        List<FixedExpense> fixedExpenses =
                fixedExpenseRepository.findByUserEmail(email);

        for (FixedExpense fixed : fixedExpenses) {

            if (!fixed.isActive()) {
                continue;
            }

            boolean alreadyGenerated =
                    occurrenceRepository
                    .findByUserEmailAndFixedExpenseIdAndYearMonth(
                            email, fixed.getId(), yearMonth)
                    .isPresent();

            if (alreadyGenerated) {
                continue;
            }

            int dueDay = Math.min(
                    fixed.getDueDay(),
                    month.lengthOfMonth()
            );

            LocalDate dueDate = month.atDay(dueDay);

            FixedExpenseOccurrence occurrence =
                    new FixedExpenseOccurrence();

            occurrence.setUserEmail(email);
            occurrence.setFixedExpenseId(fixed.getId());
            occurrence.setTitle(fixed.getTitle());
            occurrence.setAmount(fixed.getAmount());
            occurrence.setCategory(fixed.getCategory());
            occurrence.setYearMonth(yearMonth);
            occurrence.setDueDate(dueDate.toString());
            occurrence.setStatus("PENDING");

            occurrenceRepository.save(occurrence);
        }

        return occurrenceRepository
                .findByUserEmailAndYearMonth(email, yearMonth);
    }
}
