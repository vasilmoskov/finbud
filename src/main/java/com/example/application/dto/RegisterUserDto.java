package com.example.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RegisterUserDto {
    @NotBlank(message = "Please enter a first name.")
    private String firstName;

    @NotBlank(message = "Please enter a last name.")
    private String lastName;

    @NotBlank(message = "Please enter a username.")
    private String username;

    @NotBlank(message = "Please enter an email.")
    @Email(message = "Please enter a valid email.")
    private String email;

    @NotBlank(message = "Please enter a password.")
    private String password;

    @NotBlank(message = "Please enter a confirm password.")
    private String confirmPassword;

    private String profilePicture;

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

    public String getEmail() {
        return email;
    }

    public RegisterUserDto setEmail(String email) {
        this.email = email;
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

    public String getProfilePicture() {
        return profilePicture;
    }

    public RegisterUserDto setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
        return this;
    }
}
