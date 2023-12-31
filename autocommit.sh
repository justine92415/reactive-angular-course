#!/bin/bash

# 提交并推送更改的脚本

read -p "commit 訊息: " message

# 使用 git add . 将所有修改过的文件添加到暂存区
git add .

# 使用 git commit -m 提交更改
git commit -m "$message"

# 使用 git push 推送到远程仓库
git push

echo "已提交"
