USE app;
CREATE INDEX idx_user_mail_password ON user (mail, password);
CREATE INDEX idx_entry_date ON user (entry_date);
CREATE INDEX idx_kana ON user (kana);
CREATE INDEX idx_user_id ON match_group_member (user_id);

CREATE INDEX idx_department_role_member_user_id ON department_role_member (user_id);
CREATE INDEX idx_department_role_member_belong ON department_role_member (belong);
CREATE INDEX idx_department_department_id ON department (department_id);
CREATE INDEX idx_entry_date_kana ON user (entry_date ASC, kana ASC);

ALTER TABLE user ADD FULLTEXT INDEX user_full_idx (user_name) WITH PARSER ngram;
ALTER TABLE user ADD FULLTEXT INDEX kana_full_idx (kana) WITH PARSER ngram;
ALTER TABLE user ADD FULLTEXT INDEX mail_full_idx (mail) WITH PARSER ngram;
ALTER TABLE user ADD FULLTEXT INDEX goal_full_idx (goal) WITH PARSER ngram;


