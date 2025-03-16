package com.example.application.ui.pages;

import com.example.application.ui.Utils;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Sidebar {
    private static final Logger LOGGER = LoggerFactory.getLogger(Sidebar.class);

    @FindBy(xpath = "//*[@id=\"outlet\"]/vaadin-app-layout/div/header/vaadin-side-nav/vaadin-side-nav-item[1]")
    private WebElement chartsElement;

    @FindBy(xpath = "//*[@id=\"outlet\"]/vaadin-app-layout/div/header/vaadin-side-nav/vaadin-side-nav-item[2]")
    private WebElement incomesElement;

    @FindBy(xpath = "//*[@id=\"outlet\"]/vaadin-app-layout/div/header/vaadin-side-nav/vaadin-side-nav-item[3]")
    private WebElement expensesElement;

    public Sidebar() {
        WebDriver driver = Utils.getDriver();

        LOGGER.info("Initializing web elements for sidebar.");

        PageFactory.initElements(driver, this);
    }

    public void navigateToIncomes() {
        LOGGER.info("Perform navigate to incomes.");

        Utils.getWait().until(ExpectedConditions.visibilityOf(incomesElement));
        incomesElement.click();
    }

    public void navigateToExpenses() {
        LOGGER.info("Perform navigate to expenses.");

        Utils.getWait().until(ExpectedConditions.visibilityOf(expensesElement));
        expensesElement.click();
    }
}
