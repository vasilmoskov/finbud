package com.example.application.ui.pages;

import com.example.application.ui.Utils;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExpensesPage {
    private static final Logger LOGGER = LoggerFactory.getLogger(ExpensesPage.class);

    @FindBy(xpath = "//*[@id=\"outlet\"]/vaadin-app-layout/h1")
    private WebElement pageHeader;

    @FindBy(xpath = "//*[@id=\"outlet\"]/vaadin-app-layout/vaadin-button[1]")
    private WebElement addExpenseButton;

    @FindBy(xpath = "//*[@id=\"outlet\"]/vaadin-app-layout/vaadin-button[2]")
    private WebElement showFiltersButton;

    @FindBy(xpath = "//*[@id=\"outlet\"]/vaadin-app-layout/vaadin-button[3]")
    private WebElement clearFiltersButton;

    @FindBy(xpath = "//*[@id=\"resizerContainer\"]")
    private WebElement addExpenseDialog;

    @FindBy(xpath = "//*[@id=\"overlay\"]/h2")
    private WebElement addExpenseDialogTitle;

    @FindBy(xpath = "//*[@id=\"amount-input-field\"]")
    private WebElement amountField;

    @FindBy(xpath = "//*[@id=\"overlay\"]/vaadin-vertical-layout/vaadin-select[1]/vaadin-select-value-button")
    private WebElement currencyDropDownButton;

    @FindBy(xpath = "/html/body/vaadin-select-overlay/vaadin-select-list-box/vaadin-select-item[1]")
    private WebElement bgnCurrencyElement;

    @FindBy(xpath = "/html/body/vaadin-select-overlay/vaadin-select-list-box/vaadin-select-item[2]")
    private WebElement dollarCurrencyElement;

    @FindBy(xpath = "/html/body/vaadin-select-overlay/vaadin-select-list-box/vaadin-select-item[3]")
    private WebElement euroCurrencyElement;

    @FindBy(xpath = "/html/body/vaadin-select-overlay/vaadin-select-list-box/vaadin-select-item[4]")
    private WebElement poundCurrencyElement;

    @FindBy(xpath = "//*[@id=\"overlay\"]/vaadin-vertical-layout/vaadin-select[2]/vaadin-select-value-button")
    private WebElement categoryDropDownButton;

    @FindBy(xpath = "/html/body/vaadin-select-overlay/vaadin-select-list-box/vaadin-select-item[1]")
    private WebElement otherCategoryElement;

    @FindBy(xpath = "/html/body/vaadin-select-overlay/vaadin-select-list-box/vaadin-select-item[2]")
    private WebElement rentCategoryElement;

    @FindBy(xpath = "/html/body/vaadin-select-overlay/vaadin-select-list-box/vaadin-select-item[3]")
    private WebElement groceriesCategoryElement;

    @FindBy(xpath = "/html/body/vaadin-select-overlay/vaadin-select-list-box/vaadin-select-item[3]")
    private WebElement healthCareCategoryElement;

    @FindBy(xpath = "//*[@id=\"overlay\"]/div/vaadin-button[2]")
    private WebElement dialogAddButton;

    @FindBy(xpath = "//*[@id=\"outlet\"]/vaadin-app-layout/vaadin-grid")
    private WebElement expensesGrid;

    @FindBy(xpath = "//*[@id=\"outlet\"]/vaadin-app-layout/vaadin-grid/vaadin-grid-cell-content[16]")
    private WebElement amountColumnAtFirstRow;

    @FindBy(xpath = "//*[@id=\"outlet\"]/vaadin-app-layout/vaadin-grid/vaadin-grid-cell-content[17]")
    private WebElement currencyColumnAtFirstRow;

    @FindBy(xpath = "//*[@id=\"outlet\"]/vaadin-app-layout/vaadin-grid/vaadin-grid-cell-content[18]")
    private WebElement categoryColumnAtFirstRow;

    public ExpensesPage(boolean isPageLoaded) {
        WebDriver driver = Utils.getDriver();

        if (!isPageLoaded) {
            driver.get("http://localhost:8080/expense");
        }

        LOGGER.info("Initializing web elements for expenses page.");

        PageFactory.initElements(driver, this);
    }

    public String getHeaderText() {
        Utils.getWait().until(ExpectedConditions.visibilityOf(pageHeader));
        return pageHeader.getText();
    }

    public void addExpense(String amount, String currency, String category) {
        LOGGER.info("Perform add expense.");

        Utils.getWait().until(ExpectedConditions.elementToBeClickable(addExpenseButton));

        LOGGER.info("Click add expense button.");
        addExpenseButton.click();

        LOGGER.info("Set amount.");
        amountField.sendKeys(amount);

        selectCurrency(currency);
        selectCategory(category);

        clickSubmitButton();
    }

    private void selectCurrency(String currency) {
        LOGGER.info("Select currency.");

        Utils.getWait().until(ExpectedConditions.elementToBeClickable(currencyDropDownButton));

        currencyDropDownButton.click();

        switch (currency) {
            case "лв.":
                bgnCurrencyElement.click();
                break;
            case "€":
                euroCurrencyElement.click();
                break;
            case "$":
                dollarCurrencyElement.click();
                break;
            case "£":
                poundCurrencyElement.click();
                break;
            default:
                break;
        }

    }

    private void selectCategory(String category) {
        LOGGER.info("Select category.");

        Utils.getWait().until(ExpectedConditions.elementToBeClickable(categoryDropDownButton));

        categoryDropDownButton.click();

        switch (category) {
            case "Other":
                otherCategoryElement.click();
                break;
            case "Rent":
                rentCategoryElement.click();
                break;
            case "Groceries":
                groceriesCategoryElement.click();
                break;
            case "Healthcare":
                healthCareCategoryElement.click();
                break;
            default:
                break;
        }
    }

    private void clickSubmitButton() {
        LOGGER.info("Click submit button.");

        Utils.getWait().until(ExpectedConditions.elementToBeClickable(dialogAddButton));
        dialogAddButton.click();
    }

    public String getAmountAtFirstRow() {
        Utils.getWait().until(ExpectedConditions.visibilityOf(amountColumnAtFirstRow));
        return amountColumnAtFirstRow.getText();
    }

    public String getCurrencyAtFirstRow() {
        Utils.getWait().until(ExpectedConditions.visibilityOf(currencyColumnAtFirstRow));
        return currencyColumnAtFirstRow.getText();
    }

    public String getCategoryAtFirstRow() {
        Utils.getWait().until(ExpectedConditions.visibilityOf(categoryColumnAtFirstRow));
        return categoryColumnAtFirstRow.getText();
    }
}
