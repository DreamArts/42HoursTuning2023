# 42 時間耐久パフォーマンスチューニング

競技参加者は、初めに[document](./document)を参照してください。

## 計測
topでcpu使用率見る

スコア見る

## mysql
クエリをいい感じに

```
docker container ls
```
mysqlの欄に表示されたコンテナのIDを用いて
```
docker exec -i -t コンテナのID mysql
```
mysqlに入れると思うので，入ったら以下のコマンドで，データベースを見ます。
```
mysql> SHOW DATABASES;
```
以下のコマンドで，appテーブルを選択します。
```
USE app;
```
以下のコマンドで，'app'データベースにある，テーブル一覧を見ます。
```
SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE' AND table_schema = 'app';
```
以下のコマンドで，実際に skillのテーブルを見ることができます。
```
select * FROM skill;
```
行数の多いテーブルは，以下のようにLIMITで制限します。
```
select * FROM user LIMIT 10;
```

## nginx
設定変えて，プロセスどうするか


## 問題点分析・議論
- 操作をしてみる（サービス）
	- 少し変えて、変化を確かめる
- 問題点に対して優先度をつける
- 理解にはgpt使うのも１つ

<!-- ```
bash init.sh env-goat.ftt2306.dabaas.net ./goat_ssh_key.pem
``` -->

```
ssh -i ./goat_ssh_key.pem azureuser@env-goat.ftt2306.dabaas.net

bash entry.sh https://github.com/88-yana/42HoursTuning2023.git

cd 42HoursTuning2023
bash run.sh
```

## 土曜午前
documentの見逃しを無くす

処理の全体像を把握する

apiの流れを見る

-> 3人で進む

## 土曜午後
クエリの改善のやり方の共有 ->できれば役割分担


SELECT department_name FROM department WHERE department_id = (SELECT department_id FROM department_role_member WHERE user_id = 


SELECT department_name FROM department LEFT JOIN department_role_member ON department.department_id=department_role_member.department_id WHERE user_id = 


SELECT department_name FROM department WHERE department_id = (SELECT department_id FROM department_role_member WHERE user_id = '90e89a6c-9000-425e-b7ce-3e857db67f72' AND belong = true);

SELECT department_name FROM department LEFT JOIN department_role_member ON department.department_id=department_role_member.department_id WHERE user_id = '90e89a6c-9000-425e-b7ce-3e857db67f72' AND belong = true;

SELECT skill_name FROM skill WHERE skill_id IN (SELECT skill_id FROM skill_member WHERE user_id = 'f07463eb-513c-4766-889a-b827fb7f1ef0');

SELECT skill_name FROM skill LEFT JOIN skill_member ON skill.skill_id = skill_member.skill_id WHERE skill_member.user_id = 'f07463eb-513c-4766-889a-b827fb7f1ef0';


