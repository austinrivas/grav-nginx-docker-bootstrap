#!/usr/bin/env bash

source ./git_deploy.sh
source ./merge_env_pages.sh

merge_env_pages $1

if git diff-index --quiet HEAD --; then
    git_deploy $1
else
    # Changes to pages directory
    echo "The ./grav/user/pages directory on $1 has changes that have not been committed to this deployment."

    read -p "Would you like to overwrite the changes made on $1? [Y/n]" -n 1 -r
    if [[ ! $REPLY =~ ^[Yy]$ ]]
        git_deploy $1
    then
        [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell
    fi
fi