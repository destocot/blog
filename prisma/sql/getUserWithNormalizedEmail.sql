-- @param {String} $1:email The email of the user
SELECT u.*
FROM "users" u
WHERE UPPER(u.email) = UPPER($1)