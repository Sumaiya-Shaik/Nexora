
      // Automatically sync onboarding expenses to Fixed Expenses
      const recurringExpenses = [
        {
          key: 'accommodation',
          title: 'Monthly Accommodation',
          category: 'Rent'
        },
        {
          key: 'food',
          title: 'Monthly Food & Groceries',
          category: 'Food'
        },
        {
          key: 'ordering',
          title: 'Zomato / Swiggy',
          category: 'Food'
        },
        {
          key: 'travel',
          title: 'Monthly Travel & Transport',
          category: 'Travel'
        },
        {
          key: 'shopping',
          title: 'Monthly Shopping',
          category: 'Other'
        },
        {
          key: 'subscriptions',
          title: 'Monthly Subscriptions',
          category: 'Subscriptions'
        },
        {
          key: 'other',
          title: 'Other Monthly Expenses',
          category: 'Other'
        }
      ].filter(item => financialData.expenses[item.key] > 0)

      try {
        const fixedResponse = await axios.get(
          'https://nexora-g387.onrender.com/api/fixed-expenses',
          { params: { email } }
        )

        const existingExpenses = fixedResponse.data || []

        for (const item of recurringExpenses) {
          const existing = existingExpenses.find(
            expense => expense.title === item.title
          )

          const payload = {
            userEmail: email,
            title: item.title,
            amount: financialData.expenses[item.key],
            category: item.category,
            dueDay: 1
          }

          if (existing) {
            await axios.put(
              `https://nexora-g387.onrender.com/api/fixed-expenses/${existing.id}`,
              payload
            )
          } else {
            await axios.post(
              'https://nexora-g387.onrender.com/api/fixed-expenses',
              payload
            )
          }
        }
      } catch (fixedError) {
        console.error('Recurring expense sync error:', fixedError)
        alert('Your profile was saved, but some expenses could not be synced.')
      }
      export default FinancialDetails;
