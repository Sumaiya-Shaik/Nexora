
package com.nexora.backend;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ExpenseRepository extends MongoRepository<Expense, String> {

    List<Expense> findByUserEmail(String userEmail);

}
