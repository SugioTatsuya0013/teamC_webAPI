# teamC_webAPI

## tableの構成
|           |                 |      |     |         |                | 
| --------- | --------------- | ---- | --- | ------- | -------------- | 
| Field     | Type            | Null | Key | Default | Extra          | 
| id        | bigint unsigned | NO   | PRI | NULL    | auto_increment | 
| task_name | varchar(255)    | NO   |     | NULL    |                | 
| state     | tinyint(1)      | NO   |     | NULL    |                | 
| comment   | varchar(255)    | YES  |     | NULL    |                | 

## 使い方
### taskの追加
localhost:8080/tasksに対して、
以下のようなJSON形式でPOST通信を行う。<br><br>
{
	"name" : "タスクの名称",
	"comment" : "タスクに関するコメント"
}

### taskの確認
localhost:8080/tasksにアクセスすると、登録された情報が一覧で表示される

### taskの状態を更新
localhost:8080/tasksに対して、
以下の様なJSON形式でPUT通信を行うと、指定idのタスクのstateがtrueに更新される<br><br>
{
	"id":idの数字
}
