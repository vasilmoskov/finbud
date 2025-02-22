package com.example.application.services;

import com.example.application.data.Role;
import com.example.application.data.UserEntity;
import com.example.application.dto.RegisterUserDto;
import com.example.application.exception.UsernameAlreadyExistsException;
import com.example.application.repository.UserRepository;
import com.example.application.security.AuthenticatedUser;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.Endpoint;

import java.util.Optional;
import java.util.Set;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Endpoint
@AnonymousAllowed
public class UserEndpoint {

    private final AuthenticatedUser authenticatedUser;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public UserEndpoint(UserRepository userRepository, AuthenticatedUser authenticatedUser) {
        this.authenticatedUser = authenticatedUser;
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public Optional<UserEntity> getAuthenticatedUser() {
        return authenticatedUser.get();
    }

    public void register(RegisterUserDto dto) {
        if (userRepository.existsByUsername(dto.getUsername())) {
            throw new UsernameAlreadyExistsException("Username already exists!");
        }

        String hashedPassword = passwordEncoder.encode(dto.getPassword());

        UserEntity user = new UserEntity()
                .setUsername(dto.getUsername())
                .setName(dto.getFirstName())
                .setPassword(hashedPassword)
                .setRoles(Set.of(Role.USER));

        this.userRepository.save(user);
    }

}
