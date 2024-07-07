package com.example.application.services;

import com.example.application.data.UserEntity;
import com.example.application.repository.UserRepository;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public Optional<UserEntity> get(Long id) {
        return repository.findById(id);
    }

    public UserEntity update(UserEntity entity) {
        return repository.save(entity);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public Page<UserEntity> list(Pageable pageable) {
        return repository.findAll(pageable);
    }

    // TODO: is it needed?
//    public Page<UserEntity> list(Pageable pageable, Specification<UserEntity> filter) {
//        return repository.findAll(filter, pageable);
//    }

    public int count() {
        return (int) repository.count();
    }

}
