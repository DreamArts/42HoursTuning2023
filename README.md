# 42 時間耐久パフォーマンスチューニング

競技参加者は、初めに[document](./document)を参照してください。

## 計測
topでcpu使用率見る

スコア見る

## mysql
クエリをいい感じに


## nginx
設定変えて，プロセスどうするか


## 問題点分析・議論
- 操作をしてみる（サービス）
	- 少し変えて、変化を確かめる
- 問題点に対して優先度をつける
- 理解にはgpt使うのも１つ

```
bash init.sh env-goat.ftt2306.dabaas.net ./goat_ssh_key.pem
```

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
