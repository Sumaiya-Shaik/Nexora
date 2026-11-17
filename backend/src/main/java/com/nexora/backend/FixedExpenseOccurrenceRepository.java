
package com.nexora.backend;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface FixedExpenseOccurrenceRepository
        extends MongoRepository<FixedExpenseOccurrence, String> {

    List<FixedExpenseOccurrence> findByUserEmailAndYearMonth(
            String userEmail, String yearMonth);

    Optional<FixedExpenseOccurrence> findByUserEmailAndFixedExpenseIdAndYearMonth(
            String userEmail, String fixedExpenseId, String yearMonth);
}
