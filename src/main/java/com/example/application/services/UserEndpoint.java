package com.example.application.services;

import com.example.application.data.UserEntity;
import com.example.application.security.AuthenticatedUser;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.Endpoint;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;

@Endpoint
@AnonymousAllowed
public class UserEndpoint {

    @Autowired
    private AuthenticatedUser authenticatedUser;

    public Optional<UserEntity> getAuthenticatedUser() {
        return authenticatedUser.get();
    }
}
