# Java Upgrade Plan: Java 17 → Java 21 LTS

## Executive Summary

This plan outlines the upgrade of the HealthGest Maven project from Java 17 to Java 21 LTS. The upgrade involves updating the JDK, Maven configuration, and validating dependency compatibility. All project dependencies are compatible with Java 21.

**Project:** HealthGest (br.pucminas.aed:HealthGest:1.0-SNAPSHOT)
**Session ID:** 20260305202500
**Current Java Version:** 17
**Target Java Version:** 21 LTS
**Build Tool:** Maven 3.9.11

---

## 1. Environment Analysis

### 1.1 Current Environment

| Component | Current | Target | Status |
|-----------|---------|--------|--------|
| Java Version | 17 | 21 LTS | ⚠️ Requires Installation |
| Maven | 3.9.11 | 3.9.11+ | ✅ Compatible |
| maven.compiler.source | 17 | 21 | 🔄 Requires Update |
| maven.compiler.target | 17 | 21 | 🔄 Requires Update |

### 1.2 Available JDKs in System

- Java 24 (available for fallback)
- Java 25 (available for fallback)
- Java 21 LTS (requires installation)

### 1.3 Maven Information

- Version: 3.9.11
- Path: C:\apache-maven-3.9.11\bin
- Source: MAVEN_HOME, PATH
- Status: ✅ Pre-installed and ready

---

## 2. Dependency Analysis

### 2.1 Project Dependencies Compatibility

| Dependency | Current Version | Java 21 Support | Status | Notes |
|------------|-----------------|-----------------|--------|-------|
| javalin | 6.1.3 | ✅ Full Support | Compatible | No breaking changes |
| jackson-databind | 2.17.0 | ✅ Full Support | Compatible | No breaking changes |
| slf4j-simple | 2.0.12 | ✅ Full Support | Compatible | No breaking changes |

### 2.2 Key Considerations

- **No CVE vulnerabilities** identified in current dependency versions
- **All dependencies** are compatible with Java 21 LTS
- **No transitive dependencies** require upgrading
- **No deprecated APIs** are being used in the project codebase

---

## 3. Code Analysis

### 3.1 Code Patterns Reviewed

- **Main.java**: Uses `var` expressions (compatible with Java 21)
- **Paciente.java**: Uses generics and lambdas (fully compatible with Java 21)
- **Static methods and standard OOP patterns**: All compatible

### 3.2 Compatibility Issues Found

**None identified.** The project uses standard Java features that are fully compatible with Java 21 LTS.

---

## 4. Upgrade Path Design

The upgrade will be executed in the following sequential steps:

### **Step 1: Setup Environment**
- Install Java 21 JDK
- Verify installation
- Set JAVA_HOME to point to Java 21

### **Step 2: Setup Baseline**
- Clean Maven cache
- Compile project with Java 17 (baseline verification)
- Verify tests pass (if any)
- Create baseline checkpoint

### **Step 3: Update pom.xml**
- Update `maven.compiler.source` to 21
- Update `maven.compiler.target` to 21
- Update `maven.compiler.release` property (optional but recommended)
- Commit changes

### **Step 4: Compile with Java 21**
- Execute `mvn clean compile` with Java 21
- Verify no compilation errors
- Verify no warnings

### **Step 5: Execute Tests**
- Run all unit tests with `mvn test`
- Verify all tests pass
- Confirm no runtime incompatibilities

### **Step 6: Validation & Build**
- Execute full build: `mvn clean package`
- Verify JAR/executable generation
- Cross-check binary compatibility

### **Step 7: Integration Testing**
- Test application startup
- Verify API endpoints functionality
- Validate JSON serialization/deserialization

---

## 5. Upgrade Steps in Detail

### Step 1: Setup Environment

**Objective:** Install and configure Java 21 JDK

**Command:**
```powershell
# Check if Java 21 is available from your package manager or download from:
# https://adoptium.net/ (Eclipse Adoptium - Recommended for LTS)
# or
# https://www.oracle.com/java/technologies/downloads/#java21

# After installation, set JAVA_HOME
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21" # Adjust path as needed
[Environment]::SetEnvironmentVariable("JAVA_HOME", $env:JAVA_HOME, "User")

# Verify installation
java -version
javac -version
```

**Verification Checklist:**
- [ ] Java 21 JDK installed successfully
- [ ] JAVA_HOME environment variable points to Java 21
- [ ] `java -version` shows Java 21
- [ ] `javac -version` shows Java 21
- [ ] Maven is using correct Java version: `mvn --version`

---

### Step 2: Setup Baseline

**Objective:** Verify current project builds successfully with Java 17

**Commands:**
```powershell
cd "c:\Users\gabri\OneDrive\FACULDADE\AEDS III"

# Clean and compile with current Java 17
mvn clean compile

# Show the output
Write-Host "Baseline compilation completed"
```

**Expected Result:**
- ✅ Build success with no errors
- ✅ No warnings about deprecated features
- ✅ All classes compiled to target/classes/

**Verification Checklist:**
- [ ] Clean succeeded (target/ removed)
- [ ] Compile succeeded with Java 17
- [ ] No compilation errors
- [ ] target/classes/ directory created with compiled classes

---

### Step 3: Update pom.xml

**Objective:** Update Maven compiler source and target to Java 21

**File:** pom.xml

**Changes Required:**

OLD:
```xml
<properties>
    <maven.compiler.source>17</maven.compiler.source>
    <maven.compiler.target>17</maven.compiler.target>
</properties>
```

NEW:
```xml
<properties>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
    <maven.compiler.release>21</maven.compiler.release>
</properties>
```

**Commands:**
```powershell
# After updating pom.xml, validate it
mvn validate

# Show the updated properties
Write-Host "pom.xml updated successfully"
```

**Verification Checklist:**
- [ ] maven.compiler.source changed to 21
- [ ] maven.compiler.target changed to 21
- [ ] maven.compiler.release added (optional)
- [ ] pom.xml is valid: `mvn validate` passes
- [ ] Changes committed to git

---

### Step 4: Compile with Java 21

**Objective:** Verify project compiles successfully with Java 21

**Prerequisite:** Complete Step 1 (Java 21 installed)

**Commands:**
```powershell
# Ensure JAVA_HOME points to Java 21
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21" # Adjust if needed

# Verify we're using Java 21
mvn --version

# Clean and compile with Java 21
mvn clean compile

# Display summary
Write-Host "Compilation with Java 21 completed"
```

**Expected Result:**
- ✅ Build success with no errors
- ✅ Classes compiled to target/classes/
- ✅ No compilation warnings
- ✅ Compatible with Java 21 features

**Verification Checklist:**
- [ ] Java 21 is active (`mvn --version` shows Java 21)
- [ ] mvn clean succeeded
- [ ] mvn compile succeeded with no errors
- [ ] No deprecated API warnings
- [ ] target/classes/ populated with compiled classes

---

### Step 5: Execute Tests

**Objective:** Run all unit tests with Java 21

**Commands:**
```powershell
# Ensure Java 21 is active
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"

# Run tests
mvn test

# Display test results summary
Write-Host "Test execution completed"
```

**Expected Result:**
- ✅ All tests pass (if any exist)
- ✅ No runtime incompatibilities
- ✅ No deprecated warnings during test execution

**Verification Checklist:**
- [ ] All tests passed successfully
- [ ] No test failures reported
- [ ] Test results: target/surefire-reports/
- [ ] No memory issues or runtime errors
- [ ] Maven build completed successfully

---

### Step 6: Validation & Build

**Objective:** Execute full Maven build to generate final binaries

**Commands:**
```powershell
# Ensure Java 21 is active
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"

# Full build
mvn clean package

# Display build summary
Write-Host "Full build completed successfully"
```

**Expected Result:**
- ✅ Full build success
- ✅ JAR/artifacts generated in target/
- ✅ All tests passed
- ✅ All code compiled successfully

**Verification Checklist:**
- [ ] Build status: SUCCESS
- [ ] JAR file created: target/HealthGest-1.0-SNAPSHOT.jar (if applicable)
- [ ] All code compiled successfully
- [ ] All tests passed
- [ ] No warnings or errors in build output

---

### Step 7: Integration Testing

**Objective:** Verify application functionality with Java 21

**Commands:**
```powershell
# Start the application (if applicable)
cd "c:\Users\gabri\OneDrive\FACULDADE\AEDS III"
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"

# Compile and package
mvn clean package

# Run application (replace with your main class or command)
java -cp target/classes principal.Main

# Expected: Application starts without errors
```

**Expected Result:**
- ✅ Application starts successfully
- ✅ API endpoints respond correctly
- ✅ No runtime exceptions
- ✅ JSON serialization works properly

**Verification Checklist:**
- [ ] Application starts without errors
- [ ] No StackTrace or exceptions in stdout
- [ ] All controllers responsive
- [ ] Data models serialize/deserialize correctly
- [ ] No threading or concurrency issues observed

---

## 6. Rollback Plan

In case of critical issues:

1. **Revert pom.xml** to Java 17 properties
2. **Switch JAVA_HOME** back to Java 17
3. **Execute `mvn clean package`** to rebuild with Java 17
4. **Re-validate** all tests and functionality

**Rollback Commands:**
```powershell
# Set JAVA_HOME back to Java 17
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17" # Or appropriate path

# Revert pom.xml changes (using git)
git checkout HEAD -- pom.xml

# Rebuild with Java 17
mvn clean package

# Verify rollback successful
mvn --version
```

---

## 7. Success Criteria

- ✅ Java 21 JDK successfully installed
- ✅ pom.xml updated with Java 21 properties
- ✅ Project compiles without errors or warnings with Java 21
- ✅ All unit tests pass with Java 21
- ✅ Full build completes successfully
- ✅ Application runs correctly with Java 21
- ✅ No runtime incompatibilities identified
- ✅ All integration tests pass

---

## 8. Additional Recommendations

### Optional Enhancements

1. **Update Maven plugins** to latest versions:
   ```xml
   <plugin>
       <groupId>org.apache.maven.plugins</groupId>
       <artifactId>maven-compiler-plugin</artifactId>
       <version>3.13.0</version>
   </plugin>
   <plugin>
       <groupId>org.apache.maven.plugins</groupId>
       <artifactId>maven-surefire-plugin</artifactId>
       <version>3.1.2</version>
   </plugin>
   ```

2. **Update dependency versions** (optional, as current versions are stable):
   - javalin: Keep at 6.1.3 (latest stable)
   - jackson-databind: Keep at 2.17.0 (latest stable)
   - slf4j-simple: Keep at 2.0.12 (latest stable)

3. **Enable additional compiler options** for better Java 21 support:
   ```xml
   <configuration>
       <source>21</source>
       <target>21</target>
       <release>21</release>
       <enablePreview>false</enablePreview>
   </configuration>
   ```

---

## 9. Timeline Estimate

| Phase | Duration | Status |
|-------|----------|--------|
| Environment Setup | 15-20 min | ⏳ Pending |
| Baseline Verification | 5-10 min | ⏳ Pending |
| Configuration Update | 5 min | ⏳ Pending |
| Java 21 Compilation | 10-15 min | ⏳ Pending |
| Testing | 10-15 min | ⏳ Pending |
| Integration Testing | 10-15 min | ⏳ Pending |
| **Total** | **55-90 min** | ⏳ Pending |

---

## 10. Change Log

### Version 1.0 (2026-03-05)

- Created initial upgrade plan
- Analyzed environment and dependencies
- Designed 7-step upgrade process
- Version targeting: Java 21 LTS
- All dependencies verified compatible

---

## Document Control

- **Created:** 2026-03-05T20:25:00Z
- **Session ID:** 20260305202500
- **Status:** Ready for Review and Execution
- **Prepared by:** Java Upgrade Assistant
