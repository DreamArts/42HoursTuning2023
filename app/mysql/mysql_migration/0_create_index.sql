USE app;
ALTER TABLE user ADD INDEX index_mail(mail);
ALTER TABLE user ADD INDEX index_pass(password);
ALTER TABLE user ADD INDEX index_kana(kana);
ALTER TABLE user ADD INDEX index_user_id(user_id);
