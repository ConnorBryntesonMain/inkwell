# Analysis Model
## Model Overview
```mermaid
graph TD
    UC["Use Cases"] --> Scenario["Scenario-Based Model (who does what,when)"]
    UC --> Class["Class-Based Model (what data / entities exist)"]
    UC --> Functional["Functional Model (how data flows and transforms)"]
    UC --> Behavioral["Behavioral Model (what states an entity can be in)"]
```

---

## Scenario-Based Model

### Use Case Diagram

```mermaid
graph TD
    Visitor((Visitor)) --> UC1[Register Account]
    Visitor --> UC2[Log In]
    Reader((Reader)) --> UC3[Browse Feed]
    Reader --> UC4[Read Post]
    Author((Author)) --> UC5[Publish Post]
    Author -.extends.-> UC4
    Reader -.extends.-> UC2
    Author -.extends.-> UC2
```

---

## Class-Based Model

### Domain Class Diagram

```mermaid
classDiagram
    class User {
        +id
        +email
        +displayName
        +passwordHash
    +createdAt
    }
    class Post {
        +id
        +title
        +body
        +status
        +publishedAt
    }
    class Comment {
        +id
        +body
        +createdAt
    }   
    User "1" --> "*" Post : authors
    User "1" --> "*" Comment : writes
    Post "1" --> "*" Comment : has
```

---

## Functional Model

### Registration Data Flow

```mermaid
flowchart LR
    Visitor((Visitor)) -->|"registration form data"| Validate["Validate and Create Account"]
    Validate -->|"user record"| UserStore[(User Store)]
    Validate -->|"access + refresh tokens"| Visitor
```

---

## Behavioral Model

### Post State Diagram

```mermaid
stateDiagram-v2
    [*] --> Draft: author creates post
    Draft --> Draft: author edits
    Draft --> Published: author publishes
    Published --> Published: author edits (creates new version)
    Published --> Archived: author archives
    Archived --> [*]
```

