package com.example.application.ui.pages;

import com.example.application.ui.Utils;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LoginPage {
    private static final Logger LOGGER = LoggerFactory.getLogger(LoginPage.class);

    @FindBy(xpath = "//*[@id=\"vaadinLoginFormWrapper\"]//section/h2")
    private WebElement loginHeader;

    @FindBy(xpath = "//*[@id=\"input-vaadin-text-field-7\"]")
    private WebElement usernameInputField;

    @FindBy(xpath = "//*[@id=\"input-vaadin-password-field-8\"]")
    private WebElement passwordInputField;

    @FindBy(xpath = "//*[@id=\"vaadinLoginFormWrapper\"]/vaadin-button[1]")
    private WebElement loginButton;

    @FindBy(xpath = "//*[@id=\"vaadinLoginFormWrapper\"]/p/a")
    private WebElement navigateToRegisterButton;

    public LoginPage() {
        WebDriver driver = Utils.getDriver();
        driver.get("http://localhost:8080/login");

        LOGGER.info("Initializing web elements for login page.");

        PageFactory.initElements(driver, this);
    }

    public void navigateToRegister() {
        Utils.getWait().until(ExpectedConditions.elementToBeClickable(navigateToRegisterButton));
        navigateToRegisterButton.click();
    }

    public void refreshPage() {
        LOGGER.info("Refresh login page.");

        WebDriver driver = Utils.getDriver();
        driver.get("http://localhost:8080/login");
        PageFactory.initElements(driver, this);
    }

    public void login(String username, String password) {
        LOGGER.info("Perform login.");

        Utils.getWait().until(ExpectedConditions.elementToBeClickable(loginButton));

        usernameInputField.sendKeys(username);
        passwordInputField.sendKeys(password);
        loginButton.click();
    }
}
