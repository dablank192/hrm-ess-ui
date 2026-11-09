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

### Workflow contribute cho member và agent

Mỗi yêu cầu dùng một nhánh và một PR hướng vào `main`. Member có quyền Write clone trực tiếp repo này; không cần fork. Người chưa có quyền Write có thể fork, tạo nhánh trong fork và mở PR về `dablank192/hrm-ess-ui:main`.

Claude đọc quy tắc tại [CLAUDE.md](CLAUDE.md) ở gốc repo. Với agent khác, yêu cầu đọc file này khi bắt đầu. Khi member yêu cầu **edit**, agent tự fetch và cập nhật baseline an toàn rồi sửa trên nhánh contribution; chưa commit/push. Khi member yêu cầu **push** hoặc **chạy flow contribute**, agent tự commit, push nhánh, tạo/cập nhật PR vào `main`, theo dõi CI và trả URL PR. Không cần nhắc từng bước. Nếu có thay đổi chưa commit và cần tích hợp nguồn mới, agent giữ nguyên công việc và hỏi cách xử lý trước khi tiếp tục.

Các bước 1–4 áp dụng khi edit; bước 5–7 chỉ chạy khi member yêu cầu push/flow contribute. Nếu đang làm cùng yêu cầu trên nhánh riêng, tiếp tục nhánh đó thay vì tạo nhánh mới cho mỗi prompt.

1. **Kiểm tra checkout và lấy baseline.** Xác nhận đúng remote, branch và `git status`. Giữ nguyên thay đổi chưa commit; nếu có thay đổi không thuộc yêu cầu, dừng để member chọn cách xử lý. Khi checkout sạch, fetch remote và tạo nhánh `feat/<ten-ngan>` hoặc `fix/<ten-ngan>` từ `origin/main` mới nhất. Nếu dùng fork, lấy baseline từ `upstream/main` của repo gốc. Không làm việc trực tiếp trên `main`.
2. **Sửa đúng phạm vi.** Đọc code liên quan và giữ HTML/CSS/JavaScript thuần, cấu trúc theo tính năng, dữ liệu mẫu và khả năng mở `index.html` trực tiếp. Không tự thay đổi nghiệp vụ ngoài yêu cầu. Không sửa test hoặc workflow CI chỉ để vượt lỗi; nếu yêu cầu cần đổi chúng, giải thích rõ trong PR.
3. **Sinh lại markup khi cần.** Nếu sửa HTML tại `features/employee-profile/forms/index.html`, `features/tickets/shared/employee/index.html` hoặc `features/tickets/shared/manager/index.html`, chạy `node scripts/prepare-local.cjs` và đưa `data/embedded-pages.js` vào cùng commit. Không sửa tay file sinh này.
4. **Kiểm tra.** Chạy các lệnh bên dưới và kiểm tra thao tác UI bị ảnh hưởng qua HTTP. Nếu thay đổi liên quan đường dẫn hoặc môi trường, kiểm tra thêm mở trực tiếp `index.html`. Ghi rõ phần đã kiểm tra, lỗi còn lại và phần chưa kiểm chứng; không báo pass khi chưa chạy. Với thay đổi chỉ có tài liệu, có thể bỏ qua test và nêu lý do.
5. **Commit và mở PR.** Xem lại diff, chỉ stage file thuộc yêu cầu, commit rồi push nhánh contribution. Mở PR vào `main` của repo gốc. Không push trực tiếp `main`, tự merge PR hoặc deploy Sites. Nếu dùng fork và muốn owner sửa trực tiếp nhánh PR, bật Allow edits from maintainers khi GitHub hỗ trợ.
6. **Theo dõi và sửa trên cùng PR.** Kiểm tra kết quả `source-checks`, `browser-smoke` và review. Sửa lỗi trong phạm vi yêu cầu, chạy lại kiểm tra phù hợp rồi commit/push vào cùng nhánh. Không mở PR mới cho từng lượt sửa. Nếu GitHub báo nhánh chưa cập nhật, merge `main` mới nhất của repo gốc vào nhánh contribution; xử lý xung đột, kiểm tra lại và push bình thường. Không force push. Nếu xung đột đòi hỏi quyết định nghiệp vụ, hỏi member/owner trước khi xử lý phần đó.
7. **Bàn giao owner.** Gửi link PR, tóm tắt thay đổi, kết quả kiểm tra và điểm cần review. Chờ owner review/approve và quyết định merge. Commit mới làm approval cũ mất hiệu lực; cần review lại.

Chuẩn bị môi trường test bằng Node.js 22 trở lên:

```bash
npm ci
npx playwright install chromium
npm test
```

Trên Linux, dùng `npx playwright install --with-deps chromium`. Lệnh browser test tự chạy server riêng; xem chi tiết 8 nhóm test tại [tests/README.md](tests/README.md).

PR cần mô tả:

- Yêu cầu và màn hình/luồng bị ảnh hưởng.
- Thay đổi chính; ảnh hoặc video trước/sau nếu thay đổi giao diện.
- Lệnh test, kết quả và các bước kiểm tra UI thực tế.
- Giới hạn, lỗi còn lại hoặc điểm cần owner quyết định.

GitHub bắt buộc PR có một approval và cả hai job CI pass trước merge; nhánh phải cập nhật với `main`. Owner/admin có quyền bypass. CI cũng chạy sau mỗi push lên `main`; kết quả CI không tự xác nhận nghiệp vụ hay giao diện đã được owner duyệt.

### Lệnh mẫu theo từng bước

Ví dụ dưới đây dùng PowerShell, nhánh `fix/profile-contact` và PR số `123`. Thay tên nhánh, số PR và file bằng giá trị thực tế. `gh` thao tác trên GitHub; `git` thao tác nhánh/commit tại checkout. Chỉ chạy bước tiếp theo khi bước trước thành công; không chạy nguyên khối nếu có lỗi.

**Bước 1 — Đăng nhập, clone lần đầu và tạo nhánh.**

```powershell
gh auth status
# Nếu chưa đăng nhập: gh auth login
# Chỉ clone khi chưa có checkout; nếu đã có, cd vào checkout hiện tại.
gh repo clone dablank192/hrm-ess-ui
cd hrm-ess-ui
gh repo view --json nameWithOwner,viewerPermission
git remote -v
git status --short --branch
# Chỉ tiếp tục khi working tree sạch.
git fetch origin
git switch -c fix/profile-contact origin/main
```

Nếu không có quyền Write, thay bước clone/tạo nhánh bằng luồng fork sau; `origin` phải trỏ tới fork của member, `upstream` trỏ repo gốc. Kiểm tra remote trước khi tiếp tục, không ghi đè remote đã có.

```powershell
gh repo fork dablank192/hrm-ess-ui --clone
cd hrm-ess-ui
git remote -v
# Nếu thiếu upstream, thêm một lần:
git remote add upstream https://github.com/dablank192/hrm-ess-ui.git
git fetch upstream
git switch -c fix/profile-contact upstream/main
```

**Bước 2 — Sửa và xem diff.** Agent sửa file theo yêu cầu, sau đó xem lại các file cụ thể, ví dụ:

```powershell
git status --short
git diff -- features/employee-profile/profile.js
```

**Bước 3 — Sinh markup iframe khi HTML nguồn thay đổi.** Bỏ qua lệnh nếu không thay đổi ba file HTML đã liệt kê ở workflow.

```powershell
node scripts/prepare-local.cjs
git diff --stat -- data/embedded-pages.js
```

**Bước 4 — Test và kiểm tra UI.**

```powershell
npm ci
npx playwright install chromium
npm test
# Chạy riêng trong terminal khác để kiểm tra UI tại http://localhost:8080
node scripts/serve.cjs
```

**Bước 5 — Commit, push nhánh và mở PR.** Ví dụ chỉ stage `profile.js`; thay bằng danh sách file thực sự đã sửa. Nếu có sinh lại iframe, stage cả HTML nguồn và file sinh. Không dùng `git add .` để lấy mọi thay đổi.

```powershell
git diff --check
git add -- features/employee-profile/profile.js
git diff --cached --stat
git commit -m "Fix Profile contact interaction"
git push -u origin fix/profile-contact

# Viết mô tả vào file tạm, không commit file này vào source.
$prBodyPath = Join-Path ([System.IO.Path]::GetTempPath()) 'hrm-ess-ui-pr-body.md'
@'
## Thay đổi
- <Yêu cầu, màn hình và hành vi trước/sau>

## Kiểm tra
- <Lệnh đã chạy và kết quả thực tế>
- <Các bước kiểm tra UI, ảnh/video nếu có>

## Cần review
- <Giới hạn hoặc điểm chưa kiểm chứng>
'@ | Set-Content -LiteralPath $prBodyPath -Encoding utf8

gh pr create --repo dablank192/hrm-ess-ui --base main --head fix/profile-contact --title "Fix Profile contact interaction" --body-file $prBodyPath --reviewer dablank192
```

Với fork, thay `--head fix/profile-contact` bằng `--head TEN_GITHUB_MEMBER:fix/profile-contact`. Không thêm `--no-maintainer-edit` nếu muốn owner có thể sửa nhánh PR. Lấy số PR từ URL mà lệnh tạo PR trả về; không dùng cố định số `123`.

**Bước 6 — Theo dõi CI/review và cập nhật cùng PR.**

```powershell
gh pr checks 123 --repo dablank192/hrm-ess-ui --watch
gh pr view 123 --repo dablank192/hrm-ess-ui --comments
gh api repos/dablank192/hrm-ess-ui/pulls/123/comments --paginate --jq '.[] | {path, line, body}'
# Nếu CI lỗi, lấy run ID rồi xem log lỗi của đúng run:
gh run list --repo dablank192/hrm-ess-ui --branch fix/profile-contact --limit 5
gh run view RUN_ID --repo dablank192/hrm-ess-ui --log-failed
```

Nếu PR đến từ fork, run CI của PR có thể không được trả về theo tên nhánh ở `gh run list`; lấy link run từ `gh pr checks` rồi dùng run ID trên link đó. Đọc cả review tổng thể và comment từng dòng; không tự coi mọi góp ý là đã được chấp thuận thay đổi nghiệp vụ.

Nếu cần cập nhật baseline, khi working tree sạch chạy:

```powershell
git fetch origin
git merge origin/main
# Với fork, dùng git fetch upstream và git merge upstream/main thay hai lệnh trên.
# Nếu có conflict: sửa đúng file rồi git add -- <file> và git merge --continue.
# Dừng ở đây nếu còn conflict hoặc cần quyết định nghiệp vụ.
npm test
git push origin fix/profile-contact
```

Khi sửa theo review, commit và push bổ sung vào chính nhánh PR:

```powershell
git diff --check
git add -- features/employee-profile/profile.js
git commit -m "Address Profile contact review feedback"
git push origin fix/profile-contact
gh pr checks 123 --repo dablank192/hrm-ess-ui --watch
```

**Bước 7 — Bàn giao.** Lấy URL và trạng thái để gửi owner, rồi chờ review; member/agent không chạy lệnh merge.

```powershell
gh pr view 123 --repo dablank192/hrm-ess-ui --json url,state,reviewDecision,mergeStateStatus
gh pr checks 123 --repo dablank192/hrm-ess-ui
```

### Prompt mẫu giao cho agent

```text
Hãy thực hiện yêu cầu sau trong repo hrm-ess-ui: <mô tả thay đổi>.

Đọc CLAUDE.md và README.md, áp dụng workflow contribute cho member và agent.
Kiểm tra remote và working tree, tạo nhánh riêng từ main mới nhất của repo gốc,
sửa đúng phạm vi, sinh lại markup iframe nếu cần, chạy test và kiểm tra UI.
Prompt này yêu cầu chạy trọn flow contribute: commit, push nhánh và mở PR vào dablank192/hrm-ess-ui:main bằng gh CLI
hoặc công cụ GitHub có sẵn. Theo dõi CI và sửa lỗi thuộc phạm vi yêu cầu trên
cùng PR. Không push main, force push, tự merge hoặc deploy Sites.
Giữ thay đổi chưa commit đang có; nếu thiếu quyền/công cụ hoặc gặp quyết định
nghiệp vụ chưa rõ, báo cụ thể điểm cần tôi xử lý. Kết thúc bằng link PR,
kết quả test và phần chưa kiểm chứng. Nếu không thể mở PR, cung cấp nhánh
đã push và hướng dẫn mở PR thủ công; không khẳng định đã tạo PR.
```

### Review và tích hợp với Sites

GitHub là nơi nhận contribution. Owner/agent của owner đối chiếu diff UI của PR với source Sites hiện tại, tích hợp trên nhánh riêng của checkout Sites để preview và review. Source GitHub có thể khác phiên bản Sites live; member không tự ghi đè hoặc đồng bộ toàn bộ hai nơi.

Nếu review tích hợp cần sửa thêm UI, owner/agent cập nhật vào chính nhánh PR khi có quyền, kiểm tra lại và xin review lại. Sau khi owner duyệt nội dung cuối, owner/agent merge PR vào GitHub và triển khai nội dung đã đối chiếu lên Sites theo phạm vi được cho phép. PR đã merge hoặc CI pass không tự cấp quyền deploy.

Test, `.github/`, `package.json`, `package-lock.json` và `CLAUDE.md` phục vụ repo GitHub; không chuyển kèm khi bàn giao diff UI sang checkout Sites hoặc OneDrive.

Repo chứa UI, công cụ kiểm tra và workflow contribution. `CLAUDE.md` ở gốc là file chỉ dẫn agent dùng chung được cho phép; không đưa cấu hình xuất bản, credential, state/chỉ dẫn agent riêng khác hoặc dữ liệu cá nhân thực vào commit.
