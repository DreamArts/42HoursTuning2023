USE app;
ALTER TABLE user ADD INDEX index_mail(mail);
ALTER TABLE user ADD INDEX index_pass(password);
ALTER TABLE user ADD INDEX index_kana(kana);
ALTER TABLE user ADD INDEX index_user_id(user_id);
ALTER TABLE office ADD INDEX index_user_id(office_id);
ALTER TABLE file ADD INDEX index_user_id(file_id);
ALTER TABLE department ADD INDEX index_department_id(department_id);
ALTER TABLE department_role_member ADD INDEX index_department_role_member_id(department_id);
ALTER TABLE skill ADD INDEX index_skill_id(skill_id);
ALTER TABLE skill_member ADD INDEX index_skill_member_skill_id(skill_id);
ALTER TABLE session ADD INDEX index_session_id(session_id);
ALTER TABLE session ADD INDEX index_linked_user_id(linked_user_id);
