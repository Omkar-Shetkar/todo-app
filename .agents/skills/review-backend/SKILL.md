---
name: review-backend
description: Review Spring Boot applications for architectural anti-patterns, performance bottlenecks, security vulnerabilities, and departures from modern Spring idiomatic practices.
---

# Skill: Spring Boot Application Review Guide

## Overview
This skill provides a systematic, highly structured approach to conducting comprehensive code and security reviews for **Spring Boot Applications** (Java/Kotlin). Use this guide to identify architectural anti-patterns, performance bottlenecks, security vulnerabilities, and departures from modern Spring idiomatic practices.

---

## Quick Reference Checklist

| Category | High-Priority Checks |
| :--- | :--- |
| **Architecture** | Layer separation, DTO usage, stateless services, domain isolation |
| **Configuration** | `@ConfigurationProperties`, externalized secrets, profile management |
| **Data & JPA** | N+1 query prevention, transaction boundaries, index verification |
| **Security** | Authentication/Authorization, CORS/CSRF, input validation, secret leaks |
| **Resilience & Ops** | Actuator exposure, exception handling, logging, micrometer metrics |
| **Testing** | `@DataJpaTest`/`@WebMvcTest` slicing, testcontainers, mock isolation |

---

## Phase 1: Architecture & Structural Cleanliness

### 1.1 Layer Separation & Boundary Enforcement
- **Controller Layer (`@RestController` / `@Controller`)**:
  - Should only handle HTTP concern translation (request parsing, response mapping, header handling, status codes).
  - **Violation**: Business logic, database queries, or raw entity manipulation inside controller methods.
- **Service Layer (`@Service`)**:
  - Encapsulates domain business logic and transaction boundaries (`@Transactional`).
  - Should not accept HTTP objects (e.g., `HttpServletRequest`, `ResponseEntity`) or expose lower-level persistence implementation details.
- **Data Access Layer (`@Repository` / Spring Data Repositories)**:
  - Exclusively handles persistence operations and query execution.

### 1.2 DTO Pattern & Entity Leakage
- **Entity Exposure**: Never expose JPA `@Entity` classes directly in API endpoints (`@GetMapping`, `@PostMapping`).
  - *Risk*: Mass-assignment vulnerabilities, accidental recursive JSON serialization (`Infinite recursion` via bidirectional relationships), leaking internal schema data.
- **DTO Usage**:
  - Use Java 16+ **Records** or strict DTO classes for request/response payloads.
  - Implement explicit mapping using mapping frameworks (e.g., **MapStruct**) or dedicated mapping functions.

```java
// BAD: Leaking entity directly
@GetMapping("/{id}")
public User getUser(@PathVariable Long id) {
    return userRepository.findById(id).orElseThrow();
}

// GOOD: Returning immutable DTO (Record)
@GetMapping("/{id}")
public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
    return userService.findById(id)
            .map(userMapper::toResponse)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
}
```

---

## Phase 2: Configuration & Dependency Injection

### 2.1 Dependency Injection Best Practices
- **Constructor Injection**: **Mandatory**. Do not use field injection (`@Autowired` on field attributes).
  - *Why*: Enables immutability (`final` fields), simplifies unit testing without reflection, prevents circular dependencies at compile/startup time.
- **Explicit Bean Scope**: Verify non-singleton beans (e.g., `@Scope("prototype")`, `@RequestScope`) are intentionally designed for statefulness.

```java
// BAD: Field Injection
@Service
public class OrderService {
    @Autowired
    private PaymentClient paymentClient;
}

// GOOD: Constructor Injection (Lombok or explicit)
@Service
@RequiredArgsConstructor
public class OrderService {
    private final PaymentClient paymentClient;
}
```

### 2.2 Type-Safe Configuration Properties
- **Replace `@Value` with `@ConfigurationProperties`**: Group related properties into immutable type-safe records/classes.
- Validate configuration beans using standard JSR-380 annotations (`@Validated`, `@NotNull`, `@Min`).

```java
@ConfigurationProperties(prefix = "app.payment")
@Validated
public record PaymentProperties(
    @NotNull URI gatewayUrl,
    @Min(1) int timeoutSeconds,
    @NotEmpty String apiKey
) {}
```

---

## Phase 3: Data Access, JPA & Transaction Management

### 3.1 N+1 Query Prevention
- Inspect `@OneToMany` and `@ManyToMany` relationships. Ensure default fetch strategies are understood (`FetchType.LAZY` vs `FetchType.EAGER`).
- Verify queries fetching collections use **Entity Graphs** (`@EntityGraph`), **Fetch Joins** (`JOIN FETCH`), or DTO Projections to eliminate N+1 select cascades.

### 3.2 Transaction Boundary Management
- **`@Transactional` Scope**: Ensure `@Transactional` is placed on service methods, not controllers or repository interfaces.
- **Read-Only Transactions**: Apply `@Transactional(readOnly = true)` for query-only methods (optimizes ORM flush modes and database connection routing).
- **Self-Invocation Issue**: Verify `@Transactional` methods are called from external beans. Direct internal calls (`this.method()`) bypass the Spring AOP proxy.

```java
@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository repository;

    @Transactional(readOnly = true)
    public AccountDto getAccount(Long id) {
        return repository.findById(id).map(AccountDto::from).orElseThrow();
    }

    @Transactional
    public void transfer(Long sourceId, Long targetId, BigDecimal amount) {
        // Business logic execution
    }
}
```

---

## Phase 4: Security Practice Audit (Spring Security)

### 4.1 Authentication & Authorization
- **SecurityFilterChain Configuration**: Validate explicitly defined security filter chains over default fallback configurations.
- **RBAC Enforcement**: Verify method-level security (`@PreAuthorize("hasRole('ADMIN')")` or `@PreAuthorize("hasAuthority('SCOPE_read')")`) is enabled via `@EnableMethodSecurity`.
- **Public Endpoint Minimization**: Ensure `permitAll()` is restricted exclusively to public paths (health checks, public docs, auth endpoints).

### 4.2 Security Headers, CSRF, and CORS
- **CSRF Protection**: Stateful web applications with session cookies MUST have CSRF enabled. Stateless REST APIs using Bearer tokens (JWT) can safely disable CSRF (`csrf.disable()`).
- **CORS Configuration**: Ensure explicit origin wildcards (`*`) are disabled in production configurations.
- **Security Headers**: Verify inclusion of default security headers (HSTS, Content-Security-Policy, X-Frame-Options).

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable) // Allowed ONLY for stateless APIs
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health", "/api/v1/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
            .build();
    }
}
```

### 4.3 Input Validation & Sanitization
- Validate all incoming request payloads using `jakarta.validation` annotations (`@Valid`, `@NotNull`, `@Size`, `@Pattern`).
- Ensure SQL Injection (SQLi) protection by enforcing parameterized JPA/JPQL queries or Spring Data method name derivation. Avoid string concatenation in native queries (`@Query(nativeQuery = true)`).

### 4.4 Secret Management
- Check repository for hardcoded secrets, API keys, passwords, or certificates in `application.yml` or `application.properties`.
- Ensure environment variable resolution or secret managers (HashiCorp Vault, AWS Secrets Manager, Kubernetes Secrets) are utilized.

---

## Phase 5: Error Handling & Observability

### 5.1 Global Exception Handling
- Implement a centralized `@RestControllerAdvice` handling domain exceptions and mapping them to standardized response structures (e.g., **RFC 7807 Problem Details**).
- Avoid exposing internal stack traces or internal implementation details (e.g., SQL state errors) to end clients.

```java
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleNotFound(ResourceNotFoundException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
        problem.setTitle("Resource Not Found");
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }
}
```

### 5.2 Logging & Monitoring
- **Structured Logging**: Ensure logs output structured formats (JSON) in non-local environments.
- **No Sensitive Data**: Verify loggers sanitize sensitive user data (PII, tokens, credentials, credit card details).
- **Actuator Security**: Ensure sensitive Spring Boot Actuator endpoints (e.g., `/actuator/env`, `/actuator/heapdump`, `/actuator/beans`) are secured or restricted to internal access.

---

## Phase 6: Code Quality, Concurrency & Performance

### 6.1 Modern Java / Kotlin Practices
- Encourage the use of Java 17/21+ idioms: pattern matching, text blocks, switch expressions, sealed classes, records, and virtual threads (`spring.threads.virtual.enabled=true` in Spring Boot 3.2+).
- Leverage `Optional` correctly: return `Optional` from search methods, but do not use `Optional` for method arguments or class fields.

### 6.2 Resource & Connection Management
- Configure HikariCP connection pool settings explicitly for production throughput.
- Ensure proper non-blocking I/O or virtual threads when interacting with long-running downstream external APIs (e.g., using `WebClient` or `RestClient` instead of legacy `RestTemplate`).

---

## Code Review Execution Workflow

1. **Static Analysis**: Run automated scanners (SonarQube, SpotBugs, Dependency-Check, Snyk) to establish baseline security and vulnerability reports.
2. **Architecture Check**: Verify code placement, package structure, and layer boundaries.
3. **Security Inspection**: Scan controller endpoints, security configurations, and credential usage.
4. **Data Layer Verification**: Audit JPA queries, repository methods, entity mappings, and transaction boundaries.
5. **Observability Review**: Ensure proper exception handling, logging, and metrics instrumentation.
6. **Report Generation**: Categorize findings by severity (**Critical**, **Major**, **Minor**, **Informational**) with actionable remediation code snippets.