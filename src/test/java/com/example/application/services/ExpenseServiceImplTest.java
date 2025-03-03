package com.example.application.services;

import com.example.application.data.CurrencyCode;
import com.example.application.data.DocumentEntity;
import com.example.application.data.ExpenseCategory;
import com.example.application.data.ExpenseEntity;
import com.example.application.data.Role;
import com.example.application.data.UserEntity;
import com.example.application.dto.TransactionDto;
import com.example.application.repository.DocumentRepository;
import com.example.application.repository.ExpenseRepository;
import com.example.application.security.AuthenticatedUser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ExpenseServiceImplTest {
    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private AuthenticatedUser authenticatedUser;

    @InjectMocks
    private ExpenseServiceImpl expenseService;

    private UserEntity user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = createUser();
    }

    @Test
    void testGetAll() {
        ExpenseEntity expenseEntity = createExpense();
        when(authenticatedUser.get()).thenReturn(Optional.of(user));
        when(expenseRepository.findAllByUser(any(UserEntity.class))).thenReturn(List.of(expenseEntity));

        List<TransactionDto> result = expenseService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(expenseRepository, times(1)).findAllByUser(any(UserEntity.class));
    }

    @Test
    void testAddExpense() {
        when(authenticatedUser.get()).thenReturn(Optional.of(user));
        when(expenseRepository.save(any(ExpenseEntity.class))).thenReturn(createExpense());

        TransactionDto result = expenseService.addExpense(BigDecimal.TEN, "$", "Rent", "document", false);

        assertNotNull(result);
        verify(expenseRepository, times(1)).save(any(ExpenseEntity.class));
        verify(documentRepository, times(1)).save(any(DocumentEntity.class));
    }

    @Test
    void testEditExpense() {
        ExpenseEntity expenseEntity = createExpense();
        when(expenseRepository.findById(anyString())).thenReturn(Optional.of(expenseEntity));
        when(expenseRepository.save(any(ExpenseEntity.class))).thenReturn(expenseEntity);

        TransactionDto result = expenseService.editExpense("1", BigDecimal.TEN, "$", "Rent", "document", false);

        assertNotNull(result);
        verify(expenseRepository, times(1)).findById(anyString());
        verify(expenseRepository, times(1)).save(any(ExpenseEntity.class));
        verify(documentRepository, times(1)).delete(any(DocumentEntity.class));
        verify(documentRepository, times(1)).save(any(DocumentEntity.class));
    }

    @Test
    void testDeleteExpense() {
        doNothing().when(expenseRepository).deleteById(anyString());

        expenseService.deleteExpense("1");

        verify(expenseRepository, times(1)).deleteById(anyString());
    }

    @Test
    void testDeleteExpenseDocument() {
        ExpenseEntity expenseEntity = createExpense();
        when(expenseRepository.findById(anyString())).thenReturn(Optional.of(expenseEntity));
        doNothing().when(documentRepository).deleteById(anyString());

        expenseService.deleteExpenseDocument("1");

        verify(expenseRepository, times(1)).findById(anyString());
        verify(documentRepository, times(1)).deleteById(anyString());
        verify(expenseRepository, times(1)).save(any(ExpenseEntity.class));
    }

    @Test
    void testGetAllExpensesByDatesBetween() {
        ExpenseEntity expenseEntity = createExpense();
        when(authenticatedUser.get()).thenReturn(Optional.of(user));
        when(expenseRepository.findAllByUserAndDateBetween(any(UserEntity.class), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(List.of(expenseEntity));

        List<TransactionDto> result = expenseService.getAllExpensesByDatesBetween("2023-01-01", "2023-12-31");

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(expenseRepository, times(1)).findAllByUserAndDateBetween(any(UserEntity.class), any(LocalDateTime.class), any(LocalDateTime.class));
    }

    private ExpenseEntity createExpense() {
         return new ExpenseEntity()
                .setAmount(BigDecimal.valueOf(1000))
                .setCurrency(CurrencyCode.BGN)
                .setCategory(ExpenseCategory.RENT)
                .setUser(createUser())
                .setDate(LocalDateTime.now())
                .setDocument(createDocument());
    }

    private UserEntity createUser() {
        return new UserEntity()
                .setName("user")
                .setUsername("user")
                .setPassword("pass")
                .setRoles(Set.of(Role.USER));
    }

    private DocumentEntity createDocument() {
        return new DocumentEntity("doc")
                .setId("1");
    }
}