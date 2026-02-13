# CÓDIGOS SQL - EVIDENCIAS POSTGRESQL

## 📸 CAPTURA 1 – Creación de Base de Datos

```sql
-- Conectar como postgres
\l
CREATE DATABASE cine_db;
\l
```

---

## 📸 CAPTURA 2 – Creación de Usuario y Permisos

```sql
CREATE USER cine_user WITH PASSWORD 'admin123';
\du
GRANT ALL PRIVILEGES ON DATABASE cine_db TO cine_user;
ALTER DATABASE cine_db OWNER TO cine_user;
\l cine_db
```

---

## 📸 CAPTURA 3 – Conexión con Usuario

```bash
# Salir de postgres
\q

# Conectar como cine_user
psql -U cine_user -d cine_db -h localhost
```

```sql
SELECT current_database();
SELECT current_user;
\l
```

---

## 📸 CAPTURA 4 – Migraciones y Tablas

```powershell
# En PowerShell
cd D:\Documentos\cine\cine_api
.\venv\Scripts\activate
python manage.py makemigrations
python manage.py migrate
```

```sql
-- En psql
\dt
```

---

## 📸 CAPTURA 5 – Estructura de Tablas

```sql
\d cine_show
\d cine_reservation
```

---

## 📸 CAPTURA 6 – Creación de Índice

```sql
CREATE INDEX idx_cine_show_movie_title
ON public.cine_show (movie_title);

SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'cine_show';
```

---

## 📸 CAPTURA 7 – Creación de Vista

```sql
/* Paso 1: Analizar tablas */
SELECT * FROM cine_show;
SELECT * FROM cine_reservation;

/* Paso 2: Construir consulta JOIN */
SELECT
    r.id,
    r.customer_name,
    r.seats,
    r.status,
    s.movie_title,
    s.room,
    s.price,
    (r.seats * s.price) AS total_cost
FROM cine_reservation AS r
INNER JOIN cine_show AS s ON r.show_id = s.id
WHERE r.status = 'Reserved';

/* Paso 3: Crear la Vista */
CREATE OR REPLACE VIEW vw_active_reservations AS
SELECT
    r.id,
    r.customer_name,
    r.seats,
    r.status,
    s.movie_title,
    s.room,
    s.price,
    (r.seats * s.price) AS total_cost
FROM cine_reservation AS r
INNER JOIN cine_show AS s ON r.show_id = s.id
WHERE r.status = 'Reserved';

/* Paso 4: Llamar a la Vista */
SELECT * FROM vw_active_reservations;
```

---

## 📸 CAPTURA 8 – Función y Trigger

```sql
/* Consulta inicial */
SELECT * FROM public.cine_show
ORDER BY id ASC;

/* --- Creación de Función --- */
CREATE OR REPLACE FUNCTION fn_validar_available_seats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.available_seats IS NULL OR NEW.available_seats <= 0 THEN
        RAISE EXCEPTION 'No se permite insertar valores negativos o nulos en available_seats';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

/* --- Creación de Trigger --- */
CREATE OR REPLACE TRIGGER trg_validar_available_seats
BEFORE INSERT ON cine_show
FOR EACH ROW
EXECUTE FUNCTION fn_validar_available_seats();

/* --- Prueba de Inserción --- */
INSERT INTO cine_show (movie_title, room, price, available_seats)
VALUES ('Avatar 3', 'Sala VIP', 120.00, 50);

INSERT INTO cine_show (movie_title, room, price, available_seats)
VALUES ('Pelicula Test', 'Sala 1', 80.00, 0); /* Fallará por el 