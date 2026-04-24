const BOOKS = [
  { id: 1, title: "Tư Duy Nhanh Và Chậm", author: "Daniel Kahneman", genre: "Tâm lý", publisher: "Farrar, Straus and Giroux", price: 189000, rating: 4.8, year: 2024, pages: 612, isbn: "9780374533557", sold: 980, cover: "https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg", description: "Giải thích cơ chế suy nghĩ của con người và các sai lệch nhận thức." },
  { id: 2, title: "Nhà Giả Kim", author: "Paulo Coelho", genre: "Văn học", publisher: "HarperOne", price: 99000, rating: 4.7, year: 2025, pages: 228, isbn: "9780061122415", sold: 1400, cover: "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg", description: "Hành trình theo đuổi giấc mơ và kho báu của chính mình." },
  { id: 3, title: "Clean Code", author: "Robert C. Martin", genre: "Khoa học", publisher: "Prentice Hall", price: 259000, rating: 4.6, year: 2026, pages: 464, isbn: "9780132350884", sold: 780, cover: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg", description: "Nguyên tắc viết mã sạch, dễ bảo trì và chuyên nghiệp cho lập trình viên." },
  { id: 4, title: "Cha Giàu Cha Nghèo", author: "Robert Kiyosaki", genre: "Kinh tế", publisher: "Plata Publishing", price: 129000, rating: 4.6, year: 2025, pages: 336, isbn: "9781612680194", sold: 1300, cover: "https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg", description: "Bài học tài chính cá nhân giúp thay đổi tư duy về tiền bạc." },
  { id: 5, title: "Harry Potter Và Hòn Đá Phù Thủy", author: "J.K. Rowling", genre: "Thiếu nhi", publisher: "Scholastic", price: 179000, rating: 4.9, year: 2026, pages: 320, isbn: "9780590353427", sold: 1800, cover: "https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg", description: "Cuộc phiêu lưu phép thuật kinh điển dành cho mọi lứa tuổi." },
  { id: 6, title: "Steve Jobs", author: "Walter Isaacson", genre: "Tiểu sử", publisher: "Simon & Schuster", price: 219000, rating: 4.5, year: 2024, pages: 656, isbn: "9781451648539", sold: 420, cover: "https://covers.openlibrary.org/b/isbn/9781451648539-L.jpg", description: "Chân dung nhà sáng lập Apple và bài học đổi mới." },
  { id: 7, title: "Lược Sử Thời Gian", author: "Stephen Hawking", genre: "Khoa học", publisher: "Bantam", price: 169000, rating: 4.7, year: 2025, pages: 256, isbn: "9780553380163", sold: 860, cover: "https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg", description: "Khám phá vũ trụ, thời gian và những bí ẩn vật lý hiện đại." },
  { id: 8, title: "Đắc Nhân Tâm", author: "Dale Carnegie", genre: "Tâm lý", publisher: "Pocket Books", price: 119000, rating: 4.8, year: 2026, pages: 320, isbn: "9780671027032", sold: 2200, cover: "https://covers.openlibrary.org/b/isbn/9780671027032-L.jpg", description: "Nghệ thuật giao tiếp và xây dựng mối quan hệ hiệu quả." },
  { id: 9, title: "Atomic Habits", author: "James Clear", genre: "Văn học", publisher: "Avery", price: 189000, rating: 4.8, year: 2024, pages: 320, isbn: "9780735211292", sold: 1540, cover: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg", description: "Phương pháp xây dựng thói quen tốt và loại bỏ thói quen xấu bền vững." },
  { id: 10, title: "Charlotte's Web", author: "E.B. White", genre: "Thiếu nhi", publisher: "HarperCollins", price: 145000, rating: 4.5, year: 2026, pages: 192, isbn: "9780064400558", sold: 640, cover: "https://covers.openlibrary.org/b/isbn/9780064400558-L.jpg", description: "Tác phẩm thiếu nhi kinh điển về tình bạn và lòng nhân ái." },
  { id: 11, title: "Sapiens: Lược Sử Loài Người", author: "Yuval Noah Harari", genre: "Tiểu sử", publisher: "Harper", price: 235000, rating: 4.9, year: 2025, pages: 498, isbn: "9780062316097", sold: 970, cover: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg", description: "Góc nhìn toàn cảnh về tiến trình phát triển của loài người." },
  { id: 12, title: "Principles of Marketing", author: "Philip Kotler", genre: "Kinh tế", publisher: "Pearson", price: 249000, rating: 4.5, year: 2026, pages: 736, isbn: "9780134492513", sold: 510, cover: "https://covers.openlibrary.org/b/isbn/9780134492513-L.jpg", description: "Nền tảng marketing hiện đại cho học tập và ứng dụng thực tế." }
];

const REVIEWS = [
  { name: "Anh Thư", text: "Giao hàng nhanh, đóng gói kỹ. Chất lượng sách rất tốt.", rating: 5 },
  { name: "Minh Quân", text: "Tìm kiếm sách dễ, gợi ý đúng gu đọc của mình.", rating: 5 },
  { name: "Ngọc Anh", text: "Trang web mượt, thanh toán MoMo nhanh gọn.", rating: 4 }
];

const BLOG_POSTS = [
  { title: "Top 10 sách mùa hè nên đọc", tag: "Gợi ý theo chủ đề", date: "20/04/2026" },
  { title: "Sách cho người mới đi làm", tag: "Kỹ năng - sự nghiệp", date: "18/04/2026" },
  { title: "Review chuyên sâu: Tư Duy Nhanh Và Chậm", tag: "Review sách", date: "15/04/2026" },
  { title: "Phỏng vấn tác giả trẻ Việt Nam", tag: "Tác giả", date: "12/04/2026" }
];

const ORDER_STEPS = ["Xác nhận", "Đóng gói", "Bàn giao vận chuyển", "Đang giao", "Đã giao"];
