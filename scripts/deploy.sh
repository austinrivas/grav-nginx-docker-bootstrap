#!/usr/bin/env bash

source ./scripts/git_deploy.sh
source ./scripts/merge_env_pages.sh

WORKTREE=./
UNCLEAN=$(git --work-tree=${WORKTREE} status --porcelain)

if [ -n "${UNCLEAN}" ]; then

    echo -e "\nThis repo has uncommitted changes, aborting deploy to $1."

else

    merge_env_pages $1

    CHANGED=$(git --work-tree=${WORKTREE} status --porcelain)

    echo $CHANGED

    if [ -n "${CHANGED}" ]; then

        echo -e "\nThe ./grav/user/pages directory on $1 has changes that have not been committed to this deployment."

        read -p "\nWould you like to overwrite the changes made on $1? [Y/n]" -n 1 -r

        if [[ ! $REPLY =~ ^[Yy]$ ]]

            echo -e "\nAborting deploy to $1."

            [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell

        then

            echo -e "\nProceeding with deploy to $1."

            git_deploy $1

        fi

    else

        git_deploy $1

    fi

fi