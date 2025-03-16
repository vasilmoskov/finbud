package com.example.application.ui.pages;

import com.example.application.ui.Utils;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RegisterPage {
    private static final Logger LOGGER = LoggerFactory.getLogger(RegisterPage.class);

    @FindBy(xpath = "//*[@id=\"overlay\"]/h2")
    private WebElement pageHeader;

    @FindBy(xpath = "//*[@id=\"input-vaadin-text-field-16\"]")
    private WebElement firstNameField;

    @FindBy(xpath = "//*[@id=\"input-vaadin-text-field-17\"]")
    private WebElement lastNameField;

    @FindBy(xpath = "//*[@id=\"input-vaadin-text-field-18\"]")
    private WebElement usernameField;

    @FindBy(xpath = "//*[@id=\"input-vaadin-password-field-19\"]")
    private WebElement passwordField;

    @FindBy(xpath = "//*[@id=\"input-vaadin-password-field-20\"]")
    private WebElement confirmPasswordField;

    @FindBy(xpath = "//*[@id=\"overlay\"]/div/vaadin-button[2]")
    private WebElement registerButton;

    public RegisterPage(boolean isPageLoaded) {
        WebDriver driver = Utils.getDriver();

        if (!isPageLoaded) {
            driver.get("http://localhost:8080/register");
        }

        LOGGER.info("Initializing web elements for register page.");

        PageFactory.initElements(driver, this);
    }

    public void register(String firstName, String lastName, String username, String password, String confirmPassword) {
        LOGGER.info("Perform register.");

        firstNameField.sendKeys(firstName);
        lastNameField.sendKeys(lastName);
        usernameField.sendKeys(username);
        passwordField.sendKeys(password);
        confirmPasswordField.sendKeys(confirmPassword);
        registerButton.click();
    }
}
