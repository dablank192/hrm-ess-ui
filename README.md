# HRM ESS UI Prototype

Source HTML/CSS/JavaScript để cùng phát triển prototype HRM ESS. Dữ liệu và tích hợp hiện có là dữ liệu mẫu/mô phỏng của frontend.

## Xem giao diện

Mở `index.html` ngoài cùng bằng trình duyệt. Giữ nguyên cấu trúc thư mục. Không cần cài dependency hoặc chạy Node để xem bằng file.

Trình duyệt có thể giới hạn storage trên `file://`; khi storage bị từ chối, dữ liệu trong bộ nhớ có thể mất sau khi reload hoặc chuyển trang. Google Fonts và một số ảnh ngoài cần mạng.

Để kiểm tra qua HTTP, có thể chạy server tùy chọn bằng Node:

```bash
node scripts/serve.cjs
```

Mở `http://localhost:8080`. Không cần `npm install`.

## Source

- `features/`: HTML, CSS và JavaScript theo từng chức năng.
- `shared/`: layout, component và style dùng chung.
- `data/`: fixture, store và markup iframe được sinh.
- `assets/`: ảnh và tài nguyên cục bộ.
- `scripts/prepare-local.cjs`: sinh markup iframe từ HTML nguồn.
- `scripts/serve.cjs`: server HTTP tùy chọn để phát triển local.

Sửa các file trong chức năng tương ứng. Giữ thứ tự classic scripts và dependency hiện có.

Sau khi sửa HTML của form Profile hoặc iframe Ticket, chạy:

```bash
node scripts/prepare-local.cjs
```

Commit cả HTML nguồn và `data/embedded-pages.js` đã sinh lại. Khi chỉ sửa CSS/JavaScript, không cần sinh lại markup iframe.

## Phối hợp

Tạo nhánh riêng từ baseline đã thống nhất, sửa UI và mở pull request. Mô tả màn hình/luồng thay đổi, cách kiểm tra và ảnh minh họa khi cần. Các commit sửa bổ sung được push vào cùng nhánh PR.

Repo chỉ chứa UI và công cụ phục vụ UI. Không đưa cấu hình xuất bản, credential, chỉ dẫn agent hoặc dữ liệu cá nhân thực vào commit.
