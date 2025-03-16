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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.util.Random;

import static org.junit.jupiter.api.Assertions.assertEquals;

class E2ETest {
    private static final Logger LOGGER = LoggerFactory.getLogger(E2ETest.class);

//    private ConfigurableApplicationContext context;

    @BeforeEach
    void setup() {
        Utils.initDriver();

//        LOGGER.info("Starting application.");

//        context = SpringApplication.run(Application.class);

        LOGGER.info("Application is started.");
    }

    @AfterEach
    void tearDown() {
        Utils.closeDriver();
//
//        if (context != null) {
//            context.close();
//        }
    }

    @Test
    void testApp() {
        LOGGER.info("Step 0: Navigate to register");

        LoginPage loginPage = new LoginPage();
        loginPage.navigateToRegister();

        LOGGER.info("Step 1: Register");
        RegisterPage registerPage = new RegisterPage();

        String username = generateUsername();

        registerPage.register(username, username, username, "test", "test");

        loginPage.refreshPage();
        LOGGER.info("Step 2: Login");

        loginPage.login(username, "test");

        Sidebar sidebar = new Sidebar();

        LOGGER.info("Step 3: Navigate to incomes");
        sidebar.navigateToIncomes();

        IncomesPage incomesPage = new IncomesPage(true);

        assertEquals("Incomes", incomesPage.getHeaderText());

        String incomeAmount = "1000.50";
        String incomeCurrency = "лв.";
        String incomeCategory = "Salary";

        LOGGER.info("Step 4: Add income");
        incomesPage.addIncome(incomeAmount, incomeCurrency, incomeCategory);

        LOGGER.info("Step 5: Verify income is added");
        assertEquals(incomeAmount, incomesPage.getAmountAtFirstRow());
        assertEquals(incomeCurrency, incomesPage.getCurrencyAtFirstRow());
        assertEquals(incomeCategory, incomesPage.getCategoryAtFirstRow());

        LOGGER.info("Step 6: Navigate to expenses");
        sidebar.navigateToExpenses();

        ExpensesPage expensesPage = new ExpensesPage(true);

        assertEquals("Expenses", expensesPage.getHeaderText());

        String expenseAmount = "100.90";
        String expenseCurrency = "$";
        String expenseCategory = "Groceries";

        LOGGER.info("Step 7: Add expense");
        expensesPage.addExpense(expenseAmount, expenseCurrency, expenseCategory);

        LOGGER.info("Step 8: Verify expense is added");
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
