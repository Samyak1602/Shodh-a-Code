# Shodh-a-Code — Lightweight Live Coding Contest Prototype

## Overview
A real-time coding contest platform that allows users to join contests, solve problems, and see live leaderboards. Features secure code execution using Docker containers and real-time submission status updates.

## Tech Stack
- Backend: Spring Boot (Java 17), JPA, H2 Database
- Judge runtime: Docker (custom judge image)
- Frontend: Next.js + Tailwind CSS + Monaco Editor
- Orchestration: docker-compose

## Quickstart (local)
1. Clone repo:
   ```bash
   git clone <repo> && cd repo
   ```

2. Build & run:
   ```bash
   docker-compose up --build
   ```

3. Open frontend:
   - http://localhost:3000 (Next.js dev)
   - Default sample contest ID: 1
   - Sample user: alice

## API Endpoints

### GET /api/contests/{contestId}
Returns contest details with problem list (without test cases)

**Response:**
```json
{
  "id": 1,
  "title": "Shodh Sample Contest",
  "description": "A sample coding contest",
  "startTime": "2024-01-01T10:00:00",
  "endTime": "2024-01-01T12:00:00",
  "problems": [
    {
      "id": 1,
      "title": "Sum Two Numbers",
      "statement": "Given two integers, return their sum."
    }
  ]
}
```

### POST /api/submissions
Submit code for a problem

**Request:**
```json
{
  "contestId": 1,
  "problemId": 2,
  "userName": "alice",
  "language": "java",
  "code": "public class Main { public static void main(String[] args) { ... } }"
}
```

**Response:**
```json
{
  "submissionId": 123
}
```

### GET /api/submissions/{submissionId}
Get submission status and result

**Response:**
```json
{
  "id": 123,
  "userName": "alice",
  "problemId": 1,
  "status": "ACCEPTED",
  "result": "All test cases passed",
  "createdAt": "2024-01-01T10:30:00",
  "runTime": 150
}
```

### GET /api/contests/{contestId}/leaderboard
Get contest leaderboard

**Response:**
```json
[
  {
    "userName": "alice",
    "acceptedCount": 2,
    "bestTimeMillis": 150
  }
]
```

## Architecture & Design Decisions

### Service Structure
- **SubmissionService**: Manages submission queue and processing
- **JudgeWorker**: Background worker that processes submissions using Docker
- **ContestService**: Handles contest and problem management

### Security Choices
- Docker containers run with `--network none` for network isolation
- Memory and CPU limits enforced (`--memory=256m --cpus=0.5`)
- Non-root user in judge container
- Temporary directories cleaned up after execution

### Database Selection
- H2 in-memory database for simplicity and development
- Can be easily switched to PostgreSQL for production

## How Judge Works

1. Submission is queued with status `PENDING`
2. JudgeWorker picks up submission and sets status to `RUNNING`
3. Creates temporary directory `/tmp/shodhacode/{submissionId}`
4. Writes code to appropriate file (e.g., `Main.java`)
5. Executes Docker container with:
   - Mounted workspace directory
   - Network isolation
   - Resource limits
   - Timeout enforcement
6. Compares output with expected results
7. Updates submission status and result
8. Cleans up temporary files

## Known Issues & Future Work

- **Concurrency**: Single-threaded judge processing (can be improved with multiple workers)
- **Sandboxing**: Consider gVisor/Podman for production-grade isolation
- **Languages**: Currently supports Java, can be extended to Python, C++, etc.
- **Scaling**: In-memory queue doesn't persist across restarts

## Testing

### Manual Test Steps
1. Start the application: `docker-compose up --build`
2. Open http://localhost:3000
3. Join contest with ID `1` and username `alice`
4. Select problem "Sum Two Numbers"
5. Submit sample Java code:
   ```java
   import java.util.Scanner;
   public class Main {
       public static void main(String[] args) {
           Scanner sc = new Scanner(System.in);
           int a = sc.nextInt();
           int b = sc.nextInt();
           System.out.println(a + b);
       }
   }
   ```
6. Verify submission is processed and leaderboard updates
