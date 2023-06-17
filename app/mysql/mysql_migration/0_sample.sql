USE app;
CREATE INDEX idx_user_mail_password ON user (mail, password);

ALTER TABLE user ADD FULLTEXT INDEX user_full_idx (user_name) WITH PARSER ngram;
ALTER TABLE user ADD FULLTEXT INDEX kana_full_idx (kana) WITH PARSER ngram;
