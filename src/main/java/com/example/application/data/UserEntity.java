package com.example.application.data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Document("user")
public class UserEntity extends AbstractEntity<UserEntity> {

    private String username;
    private String name;
    @JsonIgnore
    private String hashedPassword;
    //TODO: check if annotations are needed when using Mongo
    @Enumerated(EnumType.STRING)
    @ElementCollection(fetch = FetchType.EAGER)
    private Set<Role> roles;
    //TODO: check if annotations are needed when using Mongo
//    @Lob
//    @Column(length = 1000000)
    private byte[] profilePicture;

    public String getUsername() {
        return username;
    }

    public UserEntity setUsername(String username) {
        this.username = username;
        return this;
    }

    public String getName() {
        return name;
    }

    public UserEntity setName(String name) {
        this.name = name;
        return this;
    }

    public String getHashedPassword() {
        return hashedPassword;
    }

    public UserEntity setHashedPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
        return this;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public UserEntity setRoles(Set<Role> roles) {
        this.roles = roles;
        return this;
    }

    public byte[] getProfilePicture() {
        return profilePicture;
    }

    public UserEntity setProfilePicture(byte[] profilePicture) {
        this.profilePicture = profilePicture;
        return this;
    }
}
