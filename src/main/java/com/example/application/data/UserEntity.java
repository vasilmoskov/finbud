package com.example.application.data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Document("user")
public class UserEntity extends AbstractEntity<UserEntity> {

    private String username;

    private String name;

    @JsonIgnore
    private String password;

    private Set<Role> roles;

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

    public String getPassword() {
        return password;
    }

    public UserEntity setPassword(String password) {
        this.password = password;
        return this;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public UserEntity setRoles(Set<Role> roles) {
        this.roles = roles;
        return this;
    }
}
