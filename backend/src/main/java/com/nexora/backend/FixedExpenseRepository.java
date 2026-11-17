
package com.nexora.backend;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FixedExpenseRepository
        extends MongoRepository<FixedExpense, String> {

    List<FixedExpense> findByUserEmail(String userEmail);

}
