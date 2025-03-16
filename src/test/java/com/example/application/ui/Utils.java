package com.example.application.ui;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.time.temporal.ChronoUnit;

public class Utils {
    private static final Logger LOGGER = LoggerFactory.getLogger(Utils.class);

    private static WebDriver driver;

    private static WebDriverWait wait;

    private Utils() {}

    public static WebDriver getDriver() {
        if (driver == null) {
            initDriver();
        }

        return driver;
    }

    public static void initDriver() {
        String driverPath = System.getenv("WEBDRIVER_PATH");

        LOGGER.info("Chrome driver path: {}", driverPath);

        System.setProperty("webdriver.chrome.driver", driverPath);

        ChromeOptions options = new ChromeOptions();

        String osName = System.getProperty("os.name").toLowerCase();

        LOGGER.info("Operating System: {}", osName);

        if (osName.equals("linux")) {
            LOGGER.info("Setting Options for Linux Execution");

            options.addArguments("--no-sandbox");
            options.addArguments("--headless");
            options.addArguments("--disable-gpu");
            options.addArguments("--disable-dev-shm-usage");
            options.addArguments("--user-data-dir=/tmp/chrome-user-data");
            options.addArguments("--remote-allow-origins=*");
        }

        driver = new ChromeDriver(options);

        driver.manage().window().maximize();
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(30));
    }

    public static WebDriverWait getWait() {
        if (wait == null) {
            wait = new WebDriverWait(getDriver(), Duration.of(120, ChronoUnit.SECONDS));
        }

        return wait;
    }

    public static void closeDriver() {
        if (driver != null) {
            driver.quit();
            driver = null;
        }
    }
}
