USE app;
CREATE INDEX idx_user_mail_password ON user (mail, password);
CREATE INDEX idx_entry_date ON user (entry_date);
CREATE INDEX idx_kana ON user (kana);
CREATE INDEX idx_user_id ON match_group_member (user_id);

ALTER TABLE user ADD FULLTEXT INDEX user_full_idx (user_name) WITH PARSER ngram;
ALTER TABLE user ADD FULLTEXT INDEX kana_full_idx (kana) WITH PARSER ngram;
ALTER TABLE user ADD FULLTEXT INDEX mail_full_idx (mail) WITH PARSER ngram;


