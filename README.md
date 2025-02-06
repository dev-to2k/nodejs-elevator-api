# NodeJS Elevator API

## Giới thiệu

Dự án **NodeJS Elevator API** là một hệ thống quản lý thang máy được xây dựng bằng **Node.js, Express, TypeScript và MySQL**. API này cung cấp các tính năng chính như:

- **Quản lý trạng thái thang máy**: Theo dõi vị trí hiện tại, hướng di chuyển và trạng thái cửa.
- **Xử lý yêu cầu gọi thang máy**: Hỗ trợ yêu cầu gọi thang từ người dùng và xử lý chọn tầng.
- **Cập nhật trạng thái thang máy tự động**: Sử dụng **WebSocket** để gửi thông báo thời gian thực.

## Công nghệ sử dụng

- **Node.js** (>=12.x)
- **Express.js** - Framework web cho Node.js
- **TypeScript** - Viết code có kiểm tra kiểu tĩnh
- **MySQL** - Hệ quản trị cơ sở dữ liệu
- **WebSocket** - Xử lý cập nhật trạng thái thang máy theo thời gian thực
- **Jest** - Testing framework

## Cấu trúc dự án

```
nodejs-elevator-api/
├── .env                  # Biến môi trường
├── .gitignore            # Ignore files khi push lên Git
├── jest.config.js        # Cấu hình Jest
├── package.json          # Quản lý dependencies
├── README.md             # Hướng dẫn dự án
├── schema.sql            # Cấu trúc database
├── tsconfig.json         # Cấu hình TypeScript
├── src/
│   ├── controllers/
│   │   └── ElevatorController.ts  # Xử lý các request API
│   ├── db.ts                      # Cấu hình MySQL
│   ├── enums/
│   │   └── index.ts               # Định nghĩa enum (Direction,...)
│   ├── managers/
│   │   └── ElevatorManager.ts      # Quản lý logic di chuyển của thang máy
│   ├── models/
│   │   ├── Elevator.ts             # Định nghĩa model Elevator
│   │   └── Request.ts              # Định nghĩa model Request
│   ├── routes/
│   │   └── elevatorRoutes.ts       # Định nghĩa routes cho API
│   ├── server.ts                   # Khởi động server Express
│   ├── tests/
│   │   ├── Elevator.test.ts        # Unit test cho Elevator
│   │   └── ElevatorManager.test.ts # Unit test cho ElevatorManager
│   ├── validates/
│   │   └── index.ts                # Validate request từ API
│   └── websocket.ts                # Cấu hình WebSocket server
```

## Cài đặt và chạy dự án

### 1. Clone repository

```sh
git clone <repository-url>
cd nodejs-elevator-api
```

### 2. Cài đặt dependencies

```sh
npm install
```

### 3. Cấu hình cơ sở dữ liệu MySQL

- Tạo cơ sở dữ liệu **elevator_system**
- Chạy file `schema.sql` để tạo bảng
- Cấu hình biến môi trường trong file `.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=elevator_system
```

### 4. Chạy dự án

#### Chạy dự án với TypeScript (development mode)

```sh
npx tsc
node dist/server.js
```

### 5. Chạy test

```sh
npm test
```

## API Endpoints

### 1. Gọi thang máy

**POST** `/api/elevator/call`

**Request Body:**

```json
{
  "floor": 3,
  "direction": 1 // -1: Down, 0: Idle, 1: Up
}
```

**Response:**

```json
{
  "message": "Request sent"
}
```

### 2. Lấy trạng thái thang máy

**GET** `/api/elevator/status`

**Response:**

```json
{
    "elevators": [
        {
            "id": 1,
            "currentFloor": 1,
            "targetFloors": [],
            "pendingUpRequests": [],
            "pendingDownRequests": [],
            "direction": 0,
            "doorOpen": false
        },
        {
            "id": 2,
            "currentFloor": 1,
            "targetFloors": [],
            "pendingUpRequests": [],
            "pendingDownRequests": [],
            "direction": 0,
            "doorOpen": false
        },
        {
            "id": 3,
            "currentFloor": 1,
            "targetFloors": [],
            "pendingUpRequests": [],
            "pendingDownRequests": [],
            "direction": 0,
            "doorOpen": false
        }
    ]
}
```

## Góp ý và phát triển

Nếu bạn có góp ý hoặc muốn tham gia phát triển, vui lòng mở **Issue** hoặc gửi **Pull Request** trên repository GitHub.

## Giấy phép

Dự án được phát hành dưới giấy phép **MIT License**.
