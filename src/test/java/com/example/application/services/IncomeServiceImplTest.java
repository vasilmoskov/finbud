package com.example.application.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.example.application.data.CurrencyCode;
import com.example.application.data.DocumentEntity;
import com.example.application.data.IncomeCategory;
import com.example.application.data.IncomeEntity;
import com.example.application.data.Role;
import com.example.application.data.UserEntity;
import com.example.application.dto.TransactionDto;
import com.example.application.repository.DocumentRepository;
import com.example.application.repository.IncomeRepository;
import com.example.application.security.AuthenticatedUser;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class IncomeServiceImplTest {
    @Mock
    private IncomeRepository incomeRepository;

    @Mock
    private DocumentRepository documentRepository;

    @Mock
    private AuthenticatedUser authenticatedUser;

    @InjectMocks
    private IncomeServiceImpl incomeService;

    private UserEntity user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        user = createUser();
    }

    @Test
    void testGetAll() {
        IncomeEntity incomeEntity = createIncome();
        when(authenticatedUser.get()).thenReturn(Optional.of(user));
        when(incomeRepository.findAllByUser(any(UserEntity.class))).thenReturn(List.of(incomeEntity));

        List<TransactionDto> result = incomeService.getAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(incomeRepository, times(1)).findAllByUser(any(UserEntity.class));
    }

    @Test
    void testAddIncome() {
        when(authenticatedUser.get()).thenReturn(Optional.of(user));
        when(incomeRepository.save(any(IncomeEntity.class))).thenReturn(createIncome());

        TransactionDto result = incomeService.addIncome(BigDecimal.TEN, "$", "Salary", "document", false);

        assertNotNull(result);
        verify(incomeRepository, times(1)).save(any(IncomeEntity.class));
        verify(documentRepository, times(1)).save(any(DocumentEntity.class));
    }

    @Test
    void testEditIncome() {
        IncomeEntity incomeEntity = createIncome();
        when(incomeRepository.findById(anyString())).thenReturn(Optional.of(incomeEntity));
        when(incomeRepository.save(any(IncomeEntity.class))).thenReturn(incomeEntity);

        TransactionDto result = incomeService.editIncome("1", BigDecimal.TEN, "$", "Salary", "document", false);

        assertNotNull(result);
        verify(incomeRepository, times(1)).findById(anyString());
        verify(incomeRepository, times(1)).save(any(IncomeEntity.class));
        verify(documentRepository, times(1)).delete(any(DocumentEntity.class));
        verify(documentRepository, times(1)).save(any(DocumentEntity.class));
    }

    @Test
    void testDeleteIncome() {
        doNothing().when(incomeRepository).deleteById(anyString());

        incomeService.deleteIncome("1");

        verify(incomeRepository, times(1)).deleteById(anyString());
    }

    @Test
    void testDeleteIncomeDocument() {
        IncomeEntity incomeEntity = createIncome();
        when(incomeRepository.findById(anyString())).thenReturn(Optional.of(incomeEntity));
        doNothing().when(documentRepository).deleteById(anyString());

        incomeService.deleteIncomeDocument("1");

        verify(incomeRepository, times(1)).findById(anyString());
        verify(documentRepository, times(1)).deleteById(anyString());
        verify(incomeRepository, times(1)).save(any(IncomeEntity.class));
    }

    @Test
    void testGetAllIncomesByDatesBetween() {
        IncomeEntity incomeEntity = createIncome();
        when(authenticatedUser.get()).thenReturn(Optional.of(user));
        when(incomeRepository.findAllByUserAndDateBetween(any(UserEntity.class), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(List.of(incomeEntity));

        List<TransactionDto> result = incomeService.getAllIncomesByDatesBetween("2023-01-01", "2023-12-31");

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(incomeRepository, times(1)).findAllByUserAndDateBetween(any(UserEntity.class), any(LocalDateTime.class), any(LocalDateTime.class));
    }

    private IncomeEntity createIncome() {
         return new IncomeEntity()
                .setAmount(BigDecimal.valueOf(1000))
                .setCurrency(CurrencyCode.BGN)
                .setCategory(IncomeCategory.SALARY)
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