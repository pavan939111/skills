# File Organization

## 1. Definition & Core Concepts

File Organization is the practice of structuring source code files, folders, and modules in a logical, standardized, and predictable hierarchy that matches architectural boundaries.

Core pieces:
- **One Primary Concept Per File:** Enforcing that each file contains exactly one primary class, interface, or module, keeping files small and focused.
- **Logical Directory Layering:** Grouping files by their architectural layer (e.g., placing all database repositories in `/repositories` or `/data-access`).
- **Import Hygiene:** Organizing and pruning import statements, and using absolute/aliased paths instead of brittle relative paths (e.g., `import { User } from '@/domain/user'` instead of `import { User } from '../../../../domain/user'`).
- **Circular Dependency Prevention:** Avoiding import loops where File A imports File B, which imports File A, causing compiler or runtime failures.

## 2. Why It Exists

As projects grow from small prototypes to large systems, disorganized code becomes a "junk drawer". Developers waste time searching for files, duplicate code because they cannot find existing helpers, and create circular import loops that cause runtime boot crashes. Standardizing folder layouts ensures the codebase remains navigable.

## 3. What Breaks in Production Without It

- **Circular Import Boot Loops:** File A imports File B, which imports File A. During bootstrap, the runtime environment throws `ReferenceError: Cannot access X before initialization` or silently assigns `undefined` values, crashing the container rollout.
- **Broken Path Resolutions in Containers:** Using inconsistent casing in file names (e.g., naming a file `userService.ts` but importing it as `import './UserService'`). This works on local case-insensitive OS (macOS/Windows) but crashes in case-sensitive production Linux Docker containers.
- **Accidental Deployment of Scratch Files:** Leaving developer scrap files (e.g., `test-script-old.js`, `temp_backup.py`) in source folders, which get packaged into production container images, bloating image size and exposing security risks.
- **Search Latency Blockages:** Locating a bug during a critical incident takes hours because files are stored in unstructured, deeply nested subdirectories.

## 4. Best Practices

- **Enforce One Class Per File:** Keep files focused. If you create a class `PaymentProcessor`, place it in a file named `PaymentProcessor.ts` (or matching extension). Do not group multiple large classes in a single file.
- **Adopt standard Aliased Paths:** Configure compiler paths (e.g., `tsconfig.json` paths or Webpack aliases) to use clean root aliases (e.g. `@/controllers/user`) instead of deep relative paths (`../../../../controllers/user`).
- **Limit File Lengths:** Keep source files under 500 lines of code. If a file exceeds this limit, it is likely violating Single Responsibility and should be decomposed.
- **Use Standardized Naming Cases:** Choose a naming convention for files and folders (e.g., kebab-case: `user-repository.ts`, or PascalCase: `UserRepository.ts`) and enforce it globally.
- **Keep Folders Flat:** Limit folder hierarchy depth to maximum 3 to 4 levels. Deep nesting makes navigation difficult.
- **Scrub Dead Files Immediately:** Remove unused files, obsolete tests, and scratch scripts from source directories. Never commit backup files to git.

## 5. Common Mistakes / Anti-Patterns

- **The Monolithic Utility File:** Creating a single file (like `utils.js` or `helpers.py`) containing thousands of lines of unrelated helper functions.
- **Circular Imports via Index Barrels:** Using `index.ts` files (barrel exports) carelessly, leading to circular dependency paths during builds.
- **Case Mismatches in Imports:** Importing files using casing that diverges from the actual filesystem path, leading to container build failures.
- **Mixing Tests with Source Code Unstructured:** Placing test files inside source code directories without clean filename separators (e.g. using `user.ts` and `test.ts` instead of `user.test.ts`).

## 6. Security Considerations

- **Excluding Non-Production Files:** Ensure build configurations (e.g. `.dockerignore`, `.gitignore`) explicitly exclude test files, configuration backups, and local env files from being compiled or copied into production environments.

## 7. Performance Considerations

- **Tree Shaking Efficiency:** Organizing files into modular, granular imports allows compilers and bundlers (like Webpack or Esbuild) to prune dead code (Tree Shaking), keeping production bundle sizes minimal.

## 8. Scalability Considerations

- **Decoupled Architecture Scaling:** Uniform file structures allow developer teams to work in parallel on separate directories (e.g., separate feature domains) without generating constant merge conflicts in shared index files.

## 9. How Major Companies Implement It

- **Google:** Enforces strict naming and directory structure conventions across all repositories. Projects are structured with clean package boundaries, and circular dependencies are blocked automatically at the compiler level.
- **NextJS / Modern Frameworks:** Enforce convention-based file organization (e.g., file-system routing where folder hierarchies under `/app` directly dictate HTTP route paths).

## 10. Decision Checklist

- Enforce **Standardized File Organization** on: Every software repository, component framework, database migration folder, and configuration directory.
- Skip complex folder splits ONLY when: Building trivial, single-file scripts or serverless handler scripts with zero external imports.

## 11. AI Coding-Agent Implementation Guidelines

- Always structure generated project folders according to the standard convention of the target framework.
- Never place more than one primary class or interface inside a single file.
- Always use aliased paths (e.g., `@/...`) for imports if configured in the repository.
- Never create nested directory structures deeper than 4 levels of folder paths.
- Always name source files and test files consistently, using standard separators (e.g., `.test.ts`, `.spec.py`).
- Never import files using casing that deviates from the actual filesystem path naming.

## 12. Reusable Checklist

- [ ] Each source file contains exactly one primary class, interface, or module
- [ ] No circular dependencies exist between import modules (validated via static analysis)
- [ ] File names match filesystem casings exactly in all import paths
- [ ] File and directory naming conventions (e.g., kebab-case) followed uniformly
- [ ] Import statements use absolute/aliased paths instead of deep relative paths (`../../`)
- [ ] Source files kept compact (ideally <500 lines of code)
- [ ] Tests and mock files stored with clear file extensions (e.g., `.test.ts`)
- [ ] Obsolete scratch files, old scripts, and commented backups deleted from source folders
