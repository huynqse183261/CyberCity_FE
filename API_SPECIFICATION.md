# Đặc Tả API - Hệ Thống Học Linux & Pentest

## 📋 Mục Lục
1. [Tổng Quan](#tổng-quan)
2. [API Courses (Khóa Học)](#api-courses)
3. [API Lessons/Topics/Subtopics (Lý Thuyết)](#api-lý-thuyết)
4. [API Quizzes (Kiểm Tra)](#api-quizzes)
5. [API Progress (Tiến Độ)](#api-progress)
6. [API Enrollments (Đăng Ký)](#api-enrollments)
7. [Cấu Trúc Dữ Liệu](#cấu-trúc-dữ-liệu)
8. [Ví Dụ Sử Dụng](#ví-dụ-sử-dụng)

---

## 📖 Tổng Quan

Hệ thống học tập bao gồm 2 khóa học chính:
- **Linux**: Học lý thuyết Linux và làm quiz
- **Pentest**: Học lý thuyết Pentesting và làm quiz

### Cấu Trúc Học Tập
```
Course (Linux/Pentest)
  └── Modules (Module 1, 2, 3...)
      └── Lessons (Bài học)
          └── Topics (Chủ đề)
              └── Subtopics (Bài lý thuyết chi tiết)
```

### Flow Học Tập
1. **Xem Outline**: Lấy danh sách modules, lessons, topics, subtopics
2. **Học Lý Thuyết**: Đọc nội dung từng subtopic
3. **Làm Quiz**: Làm quiz theo lesson hoặc module
4. **Theo Dõi Tiến Độ**: Xem progress đã học và điểm quiz

---

## 🎓 API Courses (Khóa Học)

### 1. Lấy Danh Sách Khóa Học

**Endpoint:** `GET /api/courses`

**Query Parameters:**
- `category` (optional): `linux` | `pentest`

**Response:**
```json
{
  "data": [
    {
      "uid": "uuid-course-1",
      "slug": "linux",
      "title": "Khóa Học Linux",
      "description": "Học Linux từ cơ bản đến nâng cao",
      "coverImageUrl": "https://example.com/linux-cover.jpg"
    },
    {
      "uid": "uuid-course-2",
      "slug": "pentest",
      "title": "Khóa Học Penetration Testing",
      "description": "Học kỹ thuật pentest thực chiến",
      "coverImageUrl": "https://example.com/pentest-cover.jpg"
    }
  ]
}
```

**Database Query:**
```sql
SELECT uid, slug, title, description, cover_image_url 
FROM courses 
WHERE slug = $category OR $category IS NULL
ORDER BY created_at;
```

---

### 2. Lấy Outline Khóa Học (Cây Cấu Trúc)

**Endpoint:** `GET /api/courses/{slug}/outline`

**Path Parameters:**
- `slug`: `linux` | `pentest`

**Response:**
```json
{
  "data": {
    "course": {
      "uid": "uuid-course-1",
      "slug": "linux",
      "title": "Khóa Học Linux",
      "description": "Học Linux từ cơ bản đến nâng cao"
    },
    "modules": [
      {
        "uid": "uuid-module-1",
        "title": "Module 1: Làm Quen Với Linux",
        "orderIndex": 1,
        "lessons": [
          {
            "uid": "uuid-lesson-1",
            "title": "Lesson 1: Giới Thiệu Linux",
            "orderIndex": 1,
            "topics": [
              {
                "uid": "uuid-topic-1",
                "title": "Topic 1: Lịch Sử Linux",
                "orderIndex": 1,
                "subtopics": [
                  {
                    "uid": "uuid-subtopic-1",
                    "title": "Lịch sử và triết lý Linux",
                    "orderIndex": 1
                  },
                  {
                    "uid": "uuid-subtopic-2",
                    "title": "Các bản phân phối phổ biến",
                    "orderIndex": 2
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
```

**Database Query:**
```sql
-- Lấy course
SELECT * FROM courses WHERE slug = $slug;

-- Lấy modules với lessons, topics, subtopics
SELECT 
  m.uid, m.title, m.order_index,
  l.uid as lesson_uid, l.title as lesson_title, l.order_index as lesson_order,
  t.uid as topic_uid, t.title as topic_title, t.order_index as topic_order,
  s.uid as subtopic_uid, s.title as subtopic_title, s.order_index as subtopic_order
FROM modules m
LEFT JOIN lessons l ON l.module_uid = m.uid
LEFT JOIN topics t ON t.lesson_uid = l.uid
LEFT JOIN subtopics s ON s.topic_uid = t.uid
WHERE m.course_uid = (SELECT uid FROM courses WHERE slug = $slug)
ORDER BY m.order_index, l.order_index, t.order_index, s.order_index;
```

---

## 📚 API Lý Thuyết (Lessons/Topics/Subtopics)

### 3. Lấy Chi Tiết Lesson

**Endpoint:** `GET /api/lessons/{lessonUid}`

**Response:**
```json
{
  "data": {
    "uid": "uuid-lesson-1",
    "title": "Lesson 1: Giới Thiệu Linux",
    "orderIndex": 1,
    "topics": [
      {
        "uid": "uuid-topic-1",
        "title": "Topic 1: Lịch Sử Linux",
        "orderIndex": 1
      }
    ]
  }
}
```

**Database Query:**
```sql
SELECT l.uid, l.title, l.order_index, 
       t.uid as topic_uid, t.title as topic_title, t.order_index as topic_order
FROM lessons l
LEFT JOIN topics t ON t.lesson_uid = l.uid
WHERE l.uid = $lessonUid
ORDER BY t.order_index;
```

---

### 4. Lấy Chi Tiết Topic

**Endpoint:** `GET /api/topics/{topicUid}`

**Response:**
```json
{
  "data": {
    "uid": "uuid-topic-1",
    "title": "Topic 1: Lịch Sử Linux",
    "orderIndex": 1,
    "subtopics": [
      {
        "uid": "uuid-subtopic-1",
        "title": "Lịch sử và triết lý Linux",
        "orderIndex": 1
      }
    ]
  }
}
```

**Database Query:**
```sql
SELECT t.uid, t.title, t.order_index,
       s.uid as subtopic_uid, s.title as subtopic_title, s.order_index as subtopic_order
FROM topics t
LEFT JOIN subtopics s ON s.topic_uid = t.uid
WHERE t.uid = $topicUid
ORDER BY s.order_index;
```

---

### 5. Lấy Nội Dung Subtopic (Bài Lý Thuyết)

**Endpoint:** `GET /api/subtopics/{subtopicUid}`

**Response:**
```json
{
  "data": {
    "uid": "uuid-subtopic-1",
    "title": "Lịch sử và triết lý Linux",
    "orderIndex": 1,
    "contentHtml": "<h1>Lịch sử Linux</h1><p>Linux được tạo bởi Linus Torvalds...</p>"
  }
}
```

**Database Query:**
```sql
SELECT uid, title, order_index, content_html
FROM subtopics
WHERE uid = $subtopicUid;
```

---

### 6. Cập Nhật Tiến Độ Học Subtopic

**Endpoint:** `POST /api/subtopics/{subtopicUid}/progress`

**Request Body:**
```json
{
  "progress": 100
}
```

**Response:**
```json
{
  "data": {
    "subtopicUid": "uuid-subtopic-1",
    "progress": 100,
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Database Query:**
```sql
-- Insert or update progress
INSERT INTO subtopic_progress (subtopic_uid, user_uid, progress, updated_at)
VALUES ($subtopicUid, $userUid, $progress, NOW())
ON CONFLICT (subtopic_uid, user_uid)
DO UPDATE SET progress = $progress, updated_at = NOW();

-- Return updated record
SELECT subtopic_uid, progress, updated_at
FROM subtopic_progress
WHERE subtopic_uid = $subtopicUid AND user_uid = $userUid;
```

---

## 📝 API Quizzes (Kiểm Tra)

### 7. Lấy Danh Sách Quiz

**Endpoint:** `GET /api/quizzes`

**Query Parameters:**
- `courseSlug` (optional): `linux` | `pentest`
- `moduleUid` (optional): UUID của module
- `lessonUid` (optional): UUID của lesson

**Response:**
```json
{
  "data": [
    {
      "uid": "uuid-quiz-1",
      "title": "Quiz 1: Kiểm Tra Module 1",
      "description": "Quiz về các lệnh Linux cơ bản",
      "lessonUid": "uuid-lesson-1",
      "moduleUid": "uuid-module-1",
      "numQuestions": 10,
      "timeLimitSeconds": 1800
    }
  ]
}
```

**Database Query:**
```sql
SELECT q.uid, q.title, q.description, q.lesson_uid, q.module_uid,
       COUNT(qq.uid) as num_questions, q.time_limit_seconds
FROM quizzes q
LEFT JOIN quiz_questions qq ON qq.quiz_uid = q.uid
WHERE 
  ($courseSlug IS NULL OR q.course_uid = (SELECT uid FROM courses WHERE slug = $courseSlug))
  AND ($moduleUid IS NULL OR q.module_uid = $moduleUid)
  AND ($lessonUid IS NULL OR q.lesson_uid = $lessonUid)
GROUP BY q.uid;
```

---

### 8. Lấy Chi Tiết Quiz (Đề Thi)

**Endpoint:** `GET /api/quizzes/{quizUid}`

**Response:**
```json
{
  "data": {
    "uid": "uuid-quiz-1",
    "title": "Quiz 1: Kiểm Tra Module 1",
    "description": "Quiz về các lệnh Linux cơ bản",
    "timeLimitSeconds": 1800,
    "questions": [
      {
        "uid": "uuid-question-1",
        "content": "Lệnh nào dùng để liệt kê file trong thư mục?",
        "orderIndex": 1,
        "multipleChoice": true,
        "answers": [
          {
            "uid": "uuid-answer-1",
            "content": "ls"
          },
          {
            "uid": "uuid-answer-2",
            "content": "cd"
          },
          {
            "uid": "uuid-answer-3",
            "content": "pwd"
          },
          {
            "uid": "uuid-answer-4",
            "content": "cat"
          }
        ]
      }
    ]
  }
}
```

**⚠️ Lưu Ý:** KHÔNG trả về `isCorrect` trong `answers` để tránh gian lận.

**Database Query:**
```sql
SELECT q.uid, q.title, q.description, q.time_limit_seconds,
       qq.uid as question_uid, qq.content as question_content, 
       qq.order_index as question_order, qq.multiple_choice,
       qa.uid as answer_uid, qa.content as answer_content
FROM quizzes q
LEFT JOIN quiz_questions qq ON qq.quiz_uid = q.uid
LEFT JOIN quiz_answers qa ON qa.question_uid = qq.uid
WHERE q.uid = $quizUid
ORDER BY qq.order_index, qa.order_index;
```

---

### 9. Nộp Bài Quiz

**Endpoint:** `POST /api/quiz-submissions`

**Request Body:**
```json
{
  "quizUid": "uuid-quiz-1",
  "answers": [
    {
      "questionUid": "uuid-question-1",
      "selectedAnswerUids": ["uuid-answer-1"]
    },
    {
      "questionUid": "uuid-question-2",
      "selectedAnswerUids": ["uuid-answer-3", "uuid-answer-4"]
    }
  ]
}
```

**Response:**
```json
{
  "data": {
    "submissionUid": "uuid-submission-1",
    "score": 85.5,
    "correctCount": 8,
    "totalQuestions": 10,
    "startedAt": "2024-01-15T10:00:00Z",
    "submittedAt": "2024-01-15T10:30:00Z",
    "breakdown": [
      {
        "questionUid": "uuid-question-1",
        "isCorrect": true,
        "correctAnswerUids": ["uuid-answer-1"]
      },
      {
        "questionUid": "uuid-question-2",
        "isCorrect": false,
        "correctAnswerUids": ["uuid-answer-3", "uuid-answer-4"]
      }
    ]
  }
}
```

**Database Query:**
```sql
-- 1. Tạo submission
INSERT INTO quiz_submissions (quiz_uid, user_uid, started_at, submitted_at, score)
VALUES ($quizUid, $userUid, $startedAt, NOW(), 0)
RETURNING uid;

-- 2. Lưu từng câu trả lời và tính điểm
FOR EACH answer IN $answers:
  -- Lấy đáp án đúng
  SELECT uid FROM quiz_answers 
  WHERE question_uid = $answer.questionUid AND is_correct = true;
  
  -- Lưu câu trả lời của học sinh
  INSERT INTO quiz_submission_answers (submission_uid, question_uid, answer_uid)
  VALUES ($submissionUid, $answer.questionUid, $answer.selectedAnswerUid);
  
  -- Kiểm tra đúng/sai
  IF selectedAnswerUids == correctAnswerUids THEN
    isCorrect = true;
  END IF;
END FOR;

-- 3. Tính điểm tổng
UPDATE quiz_submissions 
SET score = (correctCount / totalQuestions) * 100
WHERE uid = $submissionUid;
```

---

### 10. Lấy Kết Quả Quiz Submission

**Endpoint:** `GET /api/quiz-submissions/{submissionUid}`

**Response:**
```json
{
  "data": {
    "submissionUid": "uuid-submission-1",
    "quizUid": "uuid-quiz-1",
    "quizTitle": "Quiz 1: Kiểm Tra Module 1",
    "score": 85.5,
    "correctCount": 8,
    "totalQuestions": 10,
    "startedAt": "2024-01-15T10:00:00Z",
    "submittedAt": "2024-01-15T10:30:00Z",
    "breakdown": [
      {
        "questionUid": "uuid-question-1",
        "questionContent": "Lệnh nào dùng để liệt kê file?",
        "isCorrect": true,
        "selectedAnswerUids": ["uuid-answer-1"],
        "correctAnswerUids": ["uuid-answer-1"]
      }
    ]
  }
}
```

---

## 📊 API Progress (Tiến Độ)

### 11. Lấy Tiến Độ Khóa Học

**Endpoint:** `GET /api/users/me/progress/courses/{courseUid}`

**Response:**
```json
{
  "data": {
    "courseUid": "uuid-course-1",
    "courseTitle": "Khóa Học Linux",
    "completedSubtopics": 25,
    "totalSubtopics": 50,
    "progressPercentage": 50,
    "quizzes": {
      "completed": 3,
      "total": 6,
      "averageScore": 85.5
    }
  }
}
```

**Database Query:**
```sql
-- Đếm subtopics đã hoàn thành (progress = 100)
SELECT COUNT(*) as completed_subtopics
FROM subtopic_progress sp
JOIN subtopics s ON s.uid = sp.subtopic_uid
JOIN topics t ON t.uid = s.topic_uid
JOIN lessons l ON l.uid = t.lesson_uid
JOIN modules m ON m.uid = l.module_uid
WHERE m.course_uid = $courseUid 
  AND sp.user_uid = $userUid 
  AND sp.progress = 100;

-- Tổng số subtopics
SELECT COUNT(*) as total_subtopics
FROM subtopics s
JOIN topics t ON t.uid = s.topic_uid
JOIN lessons l ON l.uid = t.lesson_uid
JOIN modules m ON m.uid = l.module_uid
WHERE m.course_uid = $courseUid;

-- Thống kê quiz
SELECT 
  COUNT(*) as completed_quizzes,
  AVG(score) as average_score
FROM quiz_submissions qs
JOIN quizzes q ON q.uid = qs.quiz_uid
WHERE q.course_uid = $courseUid AND qs.user_uid = $userUid;
```

---

### 12. Lấy Tiến Độ Lesson

**Endpoint:** `GET /api/users/me/progress/lessons/{lessonUid}`

**Response:**
```json
{
  "data": {
    "lessonUid": "uuid-lesson-1",
    "lessonTitle": "Lesson 1: Giới Thiệu Linux",
    "completedSubtopics": 3,
    "totalSubtopics": 5,
    "progressPercentage": 60
  }
}
```

---

## 📝 API Enrollments (Đăng Ký)

### 13. Đăng Ký Khóa Học

**Endpoint:** `POST /api/courses/{courseUid}/enroll`

**Response:**
```json
{
  "data": {
    "enrollmentUid": "uuid-enrollment-1",
    "courseUid": "uuid-course-1",
    "userId": "uuid-user-1",
    "enrolledAt": "2024-01-15T10:00:00Z"
  }
}
```

**Database Query:**
```sql
INSERT INTO course_enrollments (course_uid, user_uid, enrolled_at)
VALUES ($courseUid, $userUid, NOW())
RETURNING uid, course_uid, user_uid, enrolled_at;
```

---

### 14. Lấy Danh Sách Khóa Học Đã Đăng Ký

**Endpoint:** `GET /api/users/me/enrollments`

**Query Parameters:**
- `category` (optional): `linux` | `pentest`

**Response:**
```json
{
  "data": [
    {
      "enrollmentUid": "uuid-enrollment-1",
      "courseUid": "uuid-course-1",
      "courseSlug": "linux",
      "courseTitle": "Khóa Học Linux",
      "enrolledAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

## 📦 Cấu Trúc Dữ Liệu

### Course
```typescript
{
  uid: string;
  slug: string; // "linux" | "pentest"
  title: string;
  description: string;
  coverImageUrl?: string;
}
```

### Module
```typescript
{
  uid: string;
  title: string;
  orderIndex: number;
  lessons: Lesson[];
}
```

### Lesson
```typescript
{
  uid: string;
  title: string;
  orderIndex: number;
  topics: Topic[];
}
```

### Topic
```typescript
{
  uid: string;
  title: string;
  orderIndex: number;
  subtopics: Subtopic[];
}
```

### Subtopic
```typescript
{
  uid: string;
  title: string;
  orderIndex: number;
  contentHtml?: string; // Nội dung HTML/Markdown
}
```

### Quiz
```typescript
{
  uid: string;
  title: string;
  description?: string;
  lessonUid?: string;
  moduleUid?: string;
  numQuestions: number;
  timeLimitSeconds?: number;
  questions: QuizQuestion[];
}
```

### QuizQuestion
```typescript
{
  uid: string;
  content: string;
  orderIndex: number;
  multipleChoice: boolean;
  answers: QuizAnswer[];
}
```

### QuizAnswer
```typescript
{
  uid: string;
  content: string;
  // KHÔNG có isCorrect trong response cho học sinh
}
```

---

## 💡 Ví Dụ Sử Dụng

### Frontend: Lấy Outline và Hiển Thị

```typescript
import contentService from './services/contentService';

// Lấy outline khóa học Linux
const outline = await contentService.getCourseOutlineBySlug('linux');

// Hiển thị cây modules → lessons → topics → subtopics
outline.modules.forEach(module => {
  console.log(module.title);
  module.lessons.forEach(lesson => {
    console.log(`  ${lesson.title}`);
    lesson.topics.forEach(topic => {
      console.log(`    ${topic.title}`);
      topic.subtopics.forEach(subtopic => {
        console.log(`      ${subtopic.title}`);
      });
    });
  });
});
```

### Frontend: Học Lý Thuyết

```typescript
// Lấy nội dung subtopic
const subtopic = await contentService.getSubtopic(subtopicUid);

// Hiển thị contentHtml
<div dangerouslySetInnerHTML={{ __html: subtopic.contentHtml }} />

// Cập nhật progress khi đọc xong
await contentService.updateProgress(subtopicUid, { progress: 100 });
```

### Frontend: Làm Quiz

```typescript
import quizService from './services/quizService';

// Lấy danh sách quiz
const quizzes = await quizService.listQuizzes({ courseSlug: 'linux' });

// Lấy đề thi
const quiz = await quizService.getQuiz(quizUid);

// Hiển thị câu hỏi và đáp án
quiz.questions.forEach(question => {
  console.log(question.content);
  question.answers.forEach(answer => {
    console.log(`  - ${answer.content}`);
  });
});

// Nộp bài
const result = await quizService.submitQuiz({
  quizUid: quizUid,
  answers: [
    { questionUid: 'q1', selectedAnswerUids: ['a1'] },
    { questionUid: 'q2', selectedAnswerUids: ['a3', 'a4'] }
  ]
});

// Hiển thị kết quả
console.log(`Điểm: ${result.score}%`);
console.log(`Đúng: ${result.correctCount}/${result.totalQuestions}`);
```

---

## 🔐 Authentication

Tất cả API đều yêu cầu authentication token trong header:

```
Authorization: Bearer <access_token>
```

---

## ❌ Error Handling

### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {}
  }
}
```

### Common Error Codes
- `401`: Unauthorized - Chưa đăng nhập
- `403`: Forbidden - Không có quyền truy cập
- `404`: Not Found - Không tìm thấy resource
- `422`: Validation Error - Dữ liệu không hợp lệ
- `500`: Internal Server Error - Lỗi server

---

## 📝 Ghi Chú Quan Trọng

1. **Outline API**: Chỉ trả về cấu trúc (title, orderIndex), không trả về nội dung chi tiết để giảm payload
2. **Quiz Answers**: KHÔNG trả về `isCorrect` trong API lấy đề thi để tránh gian lận
3. **Progress**: Cập nhật progress khi học sinh đọc xong subtopic hoặc nộp quiz
4. **Ordering**: Sử dụng `order_index` để sắp xếp modules, lessons, topics, subtopics
5. **Pagination**: Có thể cần thêm pagination cho danh sách quiz nếu số lượng lớn

---

## 🚀 Next Steps

1. **Backend**: Implement các API endpoints theo đặc tả trên
2. **Frontend**: Sử dụng `contentService` và `quizService` đã tạo
3. **Testing**: Test các flow học tập và làm quiz
4. **UI/UX**: Tạo trang "Lý thuyết" và "Làm quiz" chi tiết

---

**Tài Liệu Được Tạo Bởi:** Auto AI Assistant  
**Ngày:** 2024  
**Phiên Bản:** 1.0

