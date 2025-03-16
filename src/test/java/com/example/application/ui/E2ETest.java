package com.example.application.ui;

import com.example.application.Application;
import com.example.application.ui.pages.ExpensesPage;
import com.example.application.ui.pages.IncomesPage;
import com.example.application.ui.pages.LoginPage;
import com.example.application.ui.pages.RegisterPage;
import com.example.application.ui.pages.Sidebar;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.util.Random;

import static org.junit.jupiter.api.Assertions.assertEquals;

class E2ETest {

    private ConfigurableApplicationContext context;

    @BeforeEach
    void setup() {
        Utils.initDriver();

        context = SpringApplication.run(Application.class);
    }

    @AfterEach
    void tearDown() {
        Utils.closeDriver();

        if (context != null) {
            context.close();
        }
    }

    @Test
    void testApp() {
        RegisterPage registerPage = new RegisterPage(false);

        String username = generateUsername();

        registerPage.register(username, username, username, "test", "test");

        LoginPage loginPage = new LoginPage();
        loginPage.login(username, "test");

        Sidebar sidebar = new Sidebar();

        sidebar.navigateToIncomes();

        IncomesPage incomesPage = new IncomesPage(true);

        assertEquals("Incomes", incomesPage.getHeaderText());

        String incomeAmount = "1000.50";
        String incomeCurrency = "лв.";
        String incomeCategory = "Salary";

        incomesPage.addIncome(incomeAmount, incomeCurrency, incomeCategory);

        assertEquals(incomeAmount, incomesPage.getAmountAtFirstRow());
        assertEquals(incomeCurrency, incomesPage.getCurrencyAtFirstRow());
        assertEquals(incomeCategory, incomesPage.getCategoryAtFirstRow());

        sidebar.navigateToExpenses();

        ExpensesPage expensesPage = new ExpensesPage(true);

        assertEquals("Expenses", expensesPage.getHeaderText());

        String expenseAmount = "100.90";
        String expenseCurrency = "$";
        String expenseCategory = "Groceries";

        expensesPage.addExpense(expenseAmount, expenseCurrency, expenseCategory);

        assertEquals(expenseAmount, expensesPage.getAmountAtFirstRow());
        assertEquals(expenseCurrency, expensesPage.getCurrencyAtFirstRow());
        assertEquals(expenseCategory, expensesPage.getCategoryAtFirstRow());
    }

    private String generateUsername() {
        Random random = new Random();

        int suffix = random.nextInt(10000) + 1;

        return "user" + suffix;
    }
}
