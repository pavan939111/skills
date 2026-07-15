# Immutability First

## 1. Definition & Core Concepts

Immutability First is a software design practice where data structures, variables, and objects are created as read-only by default and cannot be modified after initialization. State changes are achieved by creating new instances representing the updated state rather than mutating existing memory in-place.

Core pieces:
- **Immutable Objects:** Objects whose state cannot be changed after creation (e.g., Java Records, Kotlin Data Classes, Readonly structs).
- **Pure Functions:** Functions that return a value based solely on their arguments, containing zero side-effects and leaving their inputs unmodified.
- **Copy-on-Write / Structural Sharing:** Creating copies of objects with modified fields while sharing references to unmodified nested fields to save memory.
- **Thread Safety:** The inherent quality of immutable data to be shared across multiple concurrent execution threads without requiring locks (mutexes) or risk of race conditions.

## 2. Why It Exists

Mutable state is the root cause of many complex software bugs. When multiple threads, background tasks, or helper functions can modify the same in-memory object, they conflict. Debugging which line of code mutated an object's value is difficult. Immutability makes data flow predictable, simplifies testing, and eliminates concurrency race conditions.

## 3. What Breaks in Production Without It

- **Concurrency Race Conditions:** Thread A reads an order object's items list while Thread B is simultaneously removing items from the same list, causing runtime crashes (`ConcurrentModificationException`) or data corruption.
- **Silent Argument Mutation Bugs:** A service passes a `User` object to a helper function `formatUserLabel()`. The helper function silently mutates `user.email` to lowercase, breaking case-sensitive authentication systems later in the transaction.
- **Cache Pollution:** A shared cache (e.g., memory cache) stores a configuration settings object. A route handler retrieves the object and modifies a timeout property. The next request reads the polluted cached object, failing requests.
- **Fragile Event Listening:** An event publisher broadcasts a state object to multiple listeners. One listener mutates the state, causing subsequent listeners to process corrupted data.

## 4. Best Practices

- **Default to Constant Declarations:** Always define variables as read-only or constants (e.g., `const` in TypeScript, `final` in Java, `val` in Kotlin, `readonly` in C#) by default. Use mutable bindings (`let`, `var`) only when local loop variables require incrementing.
- **Modify State by Returning New Copies:** When updating an object, return a new instance with the modified attributes (e.g., using object spread operators: `const updatedUser = { ...user, status: 'active' }`).
- **Use Immutable Collections:** Use language-supported immutable lists, maps, and sets (e.g., Java's `List.of()`, Guava `ImmutableList`) that throw exceptions if write operations are attempted.
- **Write Pure Functions:** Design business logic and utility methods to be side-effect free. They must read inputs, calculate results, and return output without mutating their arguments.
- **Use Records for DTOs:** Define data transfer objects (DTOs) and API payloads as immutable record types containing zero setter methods.

## 5. Common Mistakes / Anti-Patterns

- **Mutating Input Parameters:** Modifying properties of objects passed as parameters inside utility or service functions.
- **Exposing Internal Mutable Collections:** Creating a getter method that returns a reference to an internal mutable array, allowing callers to clear or modify the class's private list directly.
- **Assuming Read-Only Reference is Immutable:** Confusing a read-only variable assignment (like `const list = []` in Javascript) with an immutable object. The variable reference cannot be reassigned, but the array contents *can* still be mutated. Use `Object.freeze` or immutable structures.
- **In-Place DB Entity Modifications:** Modifying fields of active ORM objects and saving them without verifying version concurrency, leading to lost updates.

## 6. Security Considerations

- **Tamper-Proof Data Sharing:** Passing immutable objects across system security boundaries ensures that untrusted downstream modules cannot manipulate state values (e.g., changing authorization parameters) after verification checks are completed.

## 7. Performance Considerations

- **Object Allocation and GC Overhead:** Creating new objects instead of modifying them in-place increases memory allocation rate. In high-performance, low-latency code (hot paths, gaming engines, compiler loops), reuse buffers or use mutable state locally to avoid triggering garbage collection pauses. For standard business code, JVM and V8 engines optimize garbage collection of short-lived objects efficiently.

## 8. Scalability Considerations

- **Lock-Free Concurrency:** In horizontally scaled systems processing concurrent tasks, immutable models eliminate database and memory locking overhead, allowing nodes to scale their thread execution limits linearly.

## 9. How Major Companies Implement It

- **React Framework (Meta):** Enforces strict state immutability. Views are rendered based on state changes. If state is mutated in-place rather than replaced with a new copy, React cannot detect the change, and the UI fails to update.
- **Google's Protocol Buffers:** Generates immutable class representations across languages. Once serialized or instantiated, protobuf objects are read-only, preventing mutation bugs during network transfers.

## 10. Decision Checklist

- Use **Immutability First** on: Domain model classes, DTOs, API request/response payloads, configuration settings, event messages, and concurrent background tasks.
- Skip Immutability (Allow Mutation) in: Tight performance-critical calculation loops, local algorithms with high iteration rates (e.g., sorting algorithms), or when writing low-level byte buffer manipulations.

## 11. AI Coding-Agent Implementation Guidelines

- Always declare variables as read-only constants by default.
- Never write class setters or methods that mutate internal instance states directly — return a new class instance instead.
- Always use read-only/immutable collection wrappers when exposing arrays from classes.
- Never mutate function arguments inside helper or service methods.
- Always implement state mutations in controllers or reducers using copy-spread operators or copy methods.
- Always design DTOs and API objects as immutable records.

## 12. Reusable Checklist

- [ ] All variables declared using read-only constant bindings by default
- [ ] DTOs and API payload classes designed as immutable structures (no setter methods)
- [ ] State updates create new object copies using copy/spread operations
- [ ] Function arguments are treated as read-only; no internal property mutation occurs
- [ ] Class methods exposing collections return read-only/immutable array views
- [ ] Complex object states are modified using structural sharing patterns
- [ ] Shared configurations and caches use frozen or immutable objects
- [ ] Concurrency-sensitive logic uses immutable data to eliminate locking overhead
