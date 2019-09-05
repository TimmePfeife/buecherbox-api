CREATE OR REPLACE VIEW dashboard_bookboxes_view
AS
SELECT b.id,
       u.username,
       b.description,
       (
           SELECT COUNT(*)
           FROM favorites f
           WHERE b.id = f.bookboxid
       ) favorites,
       b.imgid,
       b.location,
       b.lat,
       b.lng,
       b.hint,
       b.created,
       b.updated
FROM bookboxes b,
     users u
WHERE b.userid = u.id;

CREATE OR REPLACE VIEW dashboard_users_view
AS
SELECT u.id,
       u.username,
       r.name rolename,
       (
           SELECT COUNT(*)
           FROM favorites f
           WHERE u.id = f.userid
       ) favorites,
       u.deleted,
       u.created,
       u.updated,
       u.last_login
FROM users u,
     roles r
WHERE u.roleid = r.id;
