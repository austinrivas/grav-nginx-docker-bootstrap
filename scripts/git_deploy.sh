#!/usr/bin/env bash
# deploys the application to the specified environment
function git_deploy() {
	git push $1 +HEAD:master
	git fetch $1
	git push origin --tags
}