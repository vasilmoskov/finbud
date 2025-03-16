package com.example.application.ui.pages;

import com.example.application.ui.Utils;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class LoginPage {

    @FindBy(xpath = "//*[@id=\"vaadinLoginFormWrapper\"]//section/h2")
    private WebElement loginHeader;

    @FindBy(xpath = "//*[@id=\"input-vaadin-text-field-7\"]")
    private WebElement usernameInputField;

    @FindBy(xpath = "//*[@id=\"input-vaadin-password-field-8\"]")
    private WebElement passwordInputField;

    @FindBy(xpath = "//*[@id=\"vaadinLoginFormWrapper\"]/vaadin-button[1]")
    private WebElement loginButton;

    public LoginPage() {
        WebDriver driver = Utils.getDriver();
        driver.get("http://localhost:8080/login");
        PageFactory.initElements(driver, this);
    }

    public void login(String username, String password) {
        Utils.getWait().until(ExpectedConditions.elementToBeClickable(loginButton));

        usernameInputField.sendKeys(username);
        passwordInputField.sendKeys(password);
        loginButton.click();
    }
}
