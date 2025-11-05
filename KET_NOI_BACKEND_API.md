# Kết Nối Frontend với Backend API

## ✅ Đã Hoàn Thành

Tất cả services đã được cập nhật để kết nối với Backend API theo `STUDENT_API_ENDPOINTS.md`.

---

## 📋 Services Đã Cập Nhật

### 1. `src/services/contentService.ts`

**Base Path**: `/api/student`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `listCourses()` | `GET /api/student/courses` | Lấy danh sách khóa học |
| `getCourseOutlineBySlug()` | `GET /api/student/courses/{slug}/outline` | Lấy outline khóa học |
| `getLesson()` | `GET /api/student/lessons/{lessonUid}` | Lấy chi tiết lesson |
| `getTopic()` | `GET /api/student/topics/{topicUid}` | Lấy chi tiết topic |
| `getSubtopic()` | `GET /api/student/subtopics/{subtopicUid}` | Lấy nội dung subtopic |
| `updateSubtopicProgress()` | `POST /api/student/subtopics/{subtopicUid}/progress` | Cập nhật tiến độ |
| `enrollCourse()` | `POST /api/student/courses/{courseUid}/enroll` | Đăng ký khóa học |
| `getMyEnrollments()` | `GET /api/student/users/me/enrollments` | Lấy danh sách đã đăng ký |

---

### 2. `src/services/quizService.ts`

**Base Path**: `/api/student`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `listQuizzes()` | `GET /api/student/quizzes` | Lấy danh sách quiz |
| `getQuiz()` | `GET /api/student/quizzes/{quizUid}` | Lấy chi tiết quiz (đề thi) |
| `submitQuiz()` | `POST /api/student/quiz-submissions` | Nộp bài quiz |
| `getQuizSubmission()` | `GET /api/student/quiz-submissions/{submissionUid}` | Xem kết quả quiz |

---

### 3. `src/services/progressService.ts` (Mới)

**Base Path**: `/api/student`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `getCourseProgress()` | `GET /api/student/users/me/progress/courses/{courseUid}` | Tiến độ khóa học |
| `getLessonProgress()` | `GET /api/student/users/me/progress/lessons/{lessonUid}` | Tiến độ lesson |

---

## 🔄 Các Thay Đổi Chính

### 1. Base URL
- **Trước**: `/api/courses`, `/api/quizzes`
- **Sau**: `/api/student/courses`, `/api/student/quizzes`

### 2. Response Format
- Backend trả về: `{ "data": {...} }`
- Frontend đã xử lý: `res.data?.data ?? res.data`

### 3. Authentication
- Tất cả API calls đều tự động thêm token từ `localStorage.getItem('access_token')`
- Header: `Authorization: Bearer <token>`

---

## 📝 Cập Nhật Components

### `ModuleDetailPage.tsx`
- ✅ Tự động cập nhật progress khi đọc subtopic (100%)
- ✅ Xử lý submit quiz với đúng format request
- ✅ Hiển thị kết quả quiz sau khi nộp

---

## 🔍 Kiểm Tra Kết Nối

### 1. Test API Calls

```typescript
// Test lấy danh sách courses
import contentService from './services/contentService';
const courses = await contentService.listCourses({ category: 'linux' });
console.log(courses);

// Test lấy outline
const outline = await contentService.getCourseOutlineBySlug('linux');
console.log(outline);

// Test lấy subtopic
const subtopic = await contentService.getSubtopic('subtopic-uid');
console.log(subtopic);

// Test lấy quizzes
import quizService from './services/quizService';
const quizzes = await quizService.listQuizzes({ courseSlug: 'linux' });
console.log(quizzes);
```

### 2. Kiểm Tra Network Requests

Mở **DevTools → Network** khi test:
- Kiểm tra URL: phải có prefix `/api/student`
- Kiểm tra Headers: phải có `Authorization: Bearer <token>`
- Kiểm tra Response: phải có format `{ "data": {...} }`

---

## ⚠️ Lưu Ý Quan Trọng

### 1. Backend API Base URL
Đảm bảo `API_BASE_URL` trong `.env` trỏ đúng backend:
```env
VITE_API_BASE_URL=http://localhost:5000
# hoặc
VITE_API_BASE_URL=https://your-backend-domain.com
```

### 2. Authentication Token
- Token được lưu trong `localStorage.getItem('access_token')`
- Token tự động được thêm vào header qua `axiosInstance` interceptor
- Nếu token hết hạn (401), sẽ tự động redirect về `/login`

### 3. Error Handling
- Tất cả API calls đều có try-catch
- Errors được log ra console
- User sẽ thấy thông báo lỗi phù hợp

---

## 📊 Mapping API Endpoints

| Frontend Service | Backend Endpoint | Status |
|-----------------|------------------|--------|
| `contentService.listCourses()` | `GET /api/student/courses` | ✅ |
| `contentService.getCourseOutlineBySlug()` | `GET /api/student/courses/{slug}/outline` | ✅ |
| `contentService.getLesson()` | `GET /api/student/lessons/{lessonUid}` | ✅ |
| `contentService.getTopic()` | `GET /api/student/topics/{topicUid}` | ✅ |
| `contentService.getSubtopic()` | `GET /api/student/subtopics/{subtopicUid}` | ✅ |
| `contentService.updateSubtopicProgress()` | `POST /api/student/subtopics/{subtopicUid}/progress` | ✅ |
| `contentService.enrollCourse()` | `POST /api/student/courses/{courseUid}/enroll` | ✅ |
| `contentService.getMyEnrollments()` | `GET /api/student/users/me/enrollments` | ✅ |
| `quizService.listQuizzes()` | `GET /api/student/quizzes` | ✅ |
| `quizService.getQuiz()` | `GET /api/student/quizzes/{quizUid}` | ✅ |
| `quizService.submitQuiz()` | `POST /api/student/quiz-submissions` | ✅ |
| `quizService.getQuizSubmission()` | `GET /api/student/quiz-submissions/{submissionUid}` | ✅ |
| `progressService.getCourseProgress()` | `GET /api/student/users/me/progress/courses/{courseUid}` | ✅ |
| `progressService.getLessonProgress()` | `GET /api/student/users/me/progress/lessons/{lessonUid}` | ✅ |

---

## 🚀 Sẵn Sàng Sử Dụng

Tất cả services đã được cập nhật và sẵn sàng kết nối với Backend API. Chỉ cần:

1. ✅ Đảm bảo Backend API đang chạy
2. ✅ Đảm bảo `API_BASE_URL` trong `.env` đúng
3. ✅ User phải đã đăng nhập (có token)
4. ✅ Test các chức năng: lấy outline, đọc lý thuyết, làm quiz

---

**Tài liệu được tạo bởi:** Auto AI Assistant  
**Ngày:** 2024  
**Status:** ✅ Đã kết nối xong với Backend API

