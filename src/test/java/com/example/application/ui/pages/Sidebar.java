package com.example.application.ui.pages;

import com.example.application.ui.Utils;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class Sidebar {

    @FindBy(xpath = "//*[@id=\"outlet\"]/vaadin-app-layout/div/header/vaadin-side-nav/vaadin-side-nav-item[1]")
    private WebElement chartsElement;

    @FindBy(xpath = "//*[@id=\"outlet\"]/vaadin-app-layout/div/header/vaadin-side-nav/vaadin-side-nav-item[2]")
    private WebElement incomesElement;

    @FindBy(xpath = "//*[@id=\"outlet\"]/vaadin-app-layout/div/header/vaadin-side-nav/vaadin-side-nav-item[3]")
    private WebElement expensesElement;

    public Sidebar() {
        WebDriver driver = Utils.getDriver();
        PageFactory.initElements(driver, this);
    }

    public void navigateToIncomes() {
        Utils.getWait().until(ExpectedConditions.visibilityOf(incomesElement));
        incomesElement.click();
    }

    public void navigateToExpenses() {
        Utils.getWait().until(ExpectedConditions.visibilityOf(expensesElement));
        expensesElement.click();
    }
}
