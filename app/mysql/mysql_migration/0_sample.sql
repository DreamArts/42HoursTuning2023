USE app;
CREATE INDEX idx_user_mail_password ON user (mail, password);
CREATE INDEX idx_entry_date ON user (entry_date);
CREATE INDEX idx_kana ON user (kana);

ALTER TABLE user ADD FULLTEXT INDEX user_full_idx (user_name) WITH PARSER ngram;
ALTER TABLE user ADD FULLTEXT INDEX kana_full_idx (kana) WITH PARSER ngram;
