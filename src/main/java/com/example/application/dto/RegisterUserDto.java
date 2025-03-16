package com.example.application.dto;

import jakarta.validation.constraints.NotBlank;

public class RegisterUserDto {
    private String firstName;

    private String lastName;

    @NotBlank(message = "Please enter a username.")
    private String username;

    @NotBlank(message = "Please enter a password.")
    private String password;

    @NotBlank(message = "Please enter a confirm password.")
    private String confirmPassword;

    public String getFirstName() {
        return firstName;
    }

    public RegisterUserDto setFirstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public String getLastName() {
        return lastName;
    }

    public RegisterUserDto setLastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public String getUsername() {
        return username;
    }

    public RegisterUserDto setUsername(String username) {
        this.username = username;
        return this;
    }

    public String getPassword() {
        return password;
    }

    public RegisterUserDto setPassword(String password) {
        this.password = password;
        return this;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public RegisterUserDto setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
        return this;
    }
}
