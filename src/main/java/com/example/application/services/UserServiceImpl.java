package com.example.application.services;

import com.example.application.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository repository;

    public UserServiceImpl(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public boolean usernameExists(String username) {
        return repository.existsByUsername(username);
    }
}
