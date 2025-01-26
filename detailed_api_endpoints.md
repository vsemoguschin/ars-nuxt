
# Полная документация API

## Для пользователей (users):
1. **Получение всех пользователей: GET /api/users/**
   - Описание: Получение списка всех пользователей.
   - Пример ответа:
     ```json
     [
         {"id": 1, "telegram_id": "12345", "username": "JohnDoe", "user_full_name": "John Doe", "role": "admin"},
         {"id": 2, "telegram_id": "67890", "username": "JaneSmith", "user_full_name": "Jane Smith", "role": "user"}
     ]
     ```

2. **Создание нового пользователя: POST /api/users/**
   - Описание: Создание пользователя с указанными данными.
   - Пример отправки:
     ```json
     {"telegram_id": "54321", "username": "NewUser", "user_full_name": "New User", "role": "user"}
     ```
   - Пример ответа:
     ```json
     {"id": 3, "telegram_id": "54321", "username": "NewUser", "user_full_name": "New User", "role": "user"}
     ```

3. **Получение пользователя по ID: GET /api/users/{id}/**
   - Описание: Получение данных пользователя по его ID.
   - Пример ответа:
     ```json
     {"id": 1, "telegram_id": "12345", "username": "JohnDoe", "user_full_name": "John Doe", "role": "admin"}
     ```

4. **Обновление пользователя: PUT /api/users/{id}/**
   - Описание: Полное обновление данных пользователя.
   - Пример отправки:
     ```json
     {"telegram_id": "12345", "username": "UpdatedUser", "user_full_name": "Updated User", "role": "admin"}
     ```
   - Пример ответа:
     ```json
     {"id": 1, "telegram_id": "12345", "username": "UpdatedUser", "user_full_name": "Updated User", "role": "admin"}
     ```

5. **Удаление пользователя: DELETE /api/users/{id}/**
   - Описание: Удаление пользователя по ID.
   - Пример ответа: `204 No Content`

---

## Для транспортных средств (vehicles):
1. **Получение всех транспортных средств: GET /api/vehicles/**
   - Описание: Получение списка всех транспортных средств.
   - Пример ответа:
     ```json
     [
         {"id": 1, "vehicle_type": "Truck", "registration_number": "A123BC", "volume": 10.5, "status": "active"}
     ]
     ```

2. **Фильтрация по статусу, объему: GET /api/vehicles/?status=active&volume=10**
   - Описание: Фильтрация транспортных средств по статусу и объему.
   - Пример ответа:
     ```json
     [
         {"id": 2, "vehicle_type": "Van", "registration_number": "B456DE", "volume": 10, "status": "active"}
     ]
     ```

3. **Создание нового транспортного средства: POST /api/vehicles/**
   - Пример отправки:
     ```json
     {"vehicle_type": "Truck", "registration_number": "C789FG", "volume": 15, "status": "inactive"}
     ```
   - Пример ответа:
     ```json
     {"id": 3, "vehicle_type": "Truck", "registration_number": "C789FG", "volume": 15, "status": "inactive"}
     ```

4. **Обновление транспортного средства: PUT /api/vehicles/{id}/**
   - Пример отправки:
     ```json
     {"vehicle_type": "Truck", "registration_number": "C789FG", "volume": 20, "status": "active"}
     ```
   - Пример ответа:
     ```json
     {"id": 3, "vehicle_type": "Truck", "registration_number": "C789FG", "volume": 20, "status": "active"}
     ```

5. **Удаление транспортного средства: DELETE /api/vehicles/{id}/**
   - Пример ответа: `204 No Content`

---

## Для контрагентов (contractors):
1. **Получение всех контрагентов: GET /api/contractors/**
   - Пример ответа:
     ```json
     [
         {"id": 1, "name": "ABC Corp", "phone": "+123456789", "inn": "123456789012"}
     ]
     ```

2. **Получение контрагента по ID: GET /api/contractors/{id}/**
   - Пример ответа:
     ```json
     {"id": 1, "name": "ABC Corp", "phone": "+123456789", "inn": "123456789012"}
     ```

3. **Фильтрация по ИНН: GET /api/contractors/?inn=123456789012**
   - Пример ответа:
     ```json
     [
         {"id": 1, "name": "ABC Corp", "phone": "+123456789", "inn": "123456789012"}
     ]
     ```

4. **Создание нового контрагента: POST /api/contractors/**
   - Пример отправки:
     ```json
     {"name": "New Corp", "phone": "+987654321", "inn": "987654321098"}
     ```
   - Пример ответа:
     ```json
     {"id": 2, "name": "New Corp", "phone": "+987654321", "inn": "987654321098"}
     ```

5. **Обновление контрагента: PUT /api/contractors/{id}/**
   - Пример отправки:
     ```json
     {"name": "Updated Corp", "phone": "+987654321", "inn": "987654321098"}
     ```
   - Пример ответа:
     ```json
     {"id": 2, "name": "Updated Corp", "phone": "+987654321", "inn": "987654321098"}
     ```

6. **Удаление контрагента: DELETE /api/contractors/{id}/**
   - Пример ответа: `204 No Content`

---

## Для заявок (orders):
1. **Получение всех заявок: GET /api/orders/**
   - Пример ответа:
     ```json
     [
         {
             "id": 1, "order_type": "Delivery", "contractor_name": "ABC Corp", 
             "vehicle_number": "A123BC", "driver_name": "John Doe", "status": "pending", 
             "order_date": "2025-01-10", "created_at": "2025-01-09T10:00:00Z", "completed_at": null
         }
     ]
     ```

2. **Фильтрация по дате и статусу: GET /api/orders/?status=pending&order_date__gte=2025-01-01**
   - Пример ответа:
     ```json
     [
         {
             "id": 2, "order_type": "Pickup", "contractor_name": "New Corp", 
             "vehicle_number": "C789FG", "driver_name": "Jane Smith", "status": "pending", 
             "order_date": "2025-01-11", "created_at": "2025-01-10T10:00:00Z", "completed_at": null
         }
     ]
     ```

3. **Создание новой заявки: POST /api/orders/**
   - Пример отправки:
     ```json
     {
         "order_type": "Delivery", "contractor": 1, "vehicle_number": "A123BC", 
         "driver": 1, "status": "pending", "order_date": "2025-01-10"
     }
     ```
   - Пример ответа:
     ```json
     {
         "id": 3, "order_type": "Delivery", "contractor_name": "ABC Corp", 
         "vehicle_number": "A123BC", "driver_name": "John Doe", "status": "pending", 
         "order_date": "2025-01-10", "created_at": "2025-01-09T10:00:00Z", "completed_at": null
     }
     ```

4. **Обновление заявки: PUT /api/orders/{id}/**
   - Пример отправки:
     ```json
     {
         "order_type": "Delivery", "contractor": 1, "vehicle_number": "A123BC", 
         "driver": 1, "status": "completed", "order_date": "2025-01-10"
     }
     ```
   - Пример ответа:
     ```json
     {
         "id": 3, "order_type": "Delivery", "contractor_name": "ABC Corp", 
         "vehicle_number": "A123BC", "driver_name": "John Doe", "status": "completed", 
         "order_date": "2025-01-10", "created_at": "2025-01-09T10:00:00Z", "completed_at": "2025-01-10T18:00:00Z"
     }
     ```

5. **Удаление заявки: DELETE /api/orders/{id}/**
   - Пример ответа: `204 No Content`

---

## Для адресов контрагентов (contractor-addresses):
1. **Получение всех адресов: GET /api/contractor-addresses/**
   - Пример ответа:
     ```json
     [
         {"id": 1, "contractor": 1, "contractor_name": "ABC Corp", "address": "123 Main St", "type": "warehouse"}
     ]
     ```

2. **Получение адреса по ID: GET /api/contractor-addresses/{id}/**
   - Пример ответа:
     ```json
     {"id": 1, "contractor": 1, "contractor_name": "ABC Corp", "address": "123 Main St", "type": "warehouse"}
     ```

3. **Создание нового адреса: POST /api/contractor-addresses/**
   - Пример отправки:
     ```json
     {"contractor": 1, "address": "456 Elm St", "type": "office"}
     ```
   - Пример ответа:
     ```json
     {"id": 2, "contractor": 1, "contractor_name": "ABC Corp", "address": "456 Elm St", "type": "office"}
     ```

4. **Обновление адреса: PUT /api/contractor-addresses/{id}/**
   - Пример отправки:
     ```json
     {"contractor": 1, "address": "789 Oak St", "type": "warehouse"}
     ```
   - Пример ответа:
     ```json
     {"id": 2, "contractor": 1, "contractor_name": "ABC Corp", "address": "789 Oak St", "type": "warehouse"}
     ```

5. **Удаление адреса: DELETE /api/contractor-addresses/{id}/**
   - Пример ответа: `204 No Content`

---

## Для истории заявок (order-history):
1. **Получение всей истории: GET /api/order-history/**
   - Пример ответа:
     ```json
     [
         {"id": 1, "order": 1, "completed_by_name": "John Doe", "volume_handled": 10, "trips_count": 1, "notes": "Completed successfully", "completed_at": "2025-01-09T18:00:00Z"}
     ]
     ```

2. **Фильтрация по заявке: GET /api/order-history/?order_id=1**
   - Пример ответа:
     ```json
     [
         {"id": 1, "order": 1, "completed_by_name": "John Doe", "volume_handled": 10, "trips_count": 1, "notes": "Completed successfully", "completed_at": "2025-01-09T18:00:00Z"}
     ]
     ```

3. **Создание новой записи: POST /api/order-history/**
   - Пример отправки:
     ```json
     {"order": 1, "completed_by": 1, "volume_handled": 10, "trips_count": 1, "notes": "Completed successfully"}
     ```
   - Пример ответа:
     ```json
     {"id": 2, "order": 1, "completed_by_name": "John Doe", "volume_handled": 10, "trips_count": 1, "notes": "Completed successfully", "completed_at": "2025-01-10T18:00:00Z"}
     ```

4. **Обновление записи: PUT /api/order-history/{id}/**
   - Пример отправки:
     ```json
     {"volume_handled": 12, "trips_count": 2, "notes": "Updated successfully"}
     ```
   - Пример ответа:
     ```json
     {"id": 2, "order": 1, "completed_by_name": "John Doe", "volume_handled": 12, "trips_count": 2, "notes": "Updated successfully", "completed_at": "2025-01-10T18:00:00Z"}
     ```

5. **Удаление записи: DELETE /api/order-history/{id}/**
   - Пример ответа: `204 No Content`
