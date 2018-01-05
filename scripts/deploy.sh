#!/usr/bin/env bash

source ./scripts/git_deploy.sh
source ./scripts/merge_env_pages.sh

function exit_shell() {
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell
}

function git_diff() {
    echo $(git --work-tree=./ status --porcelain)
}

UNCLEAN=$(git_diff)

if [ -n "${UNCLEAN}" ]; then

    echo -e "\nThis repo has uncommitted changes, aborting deploy to $1."

    exit_shell

else

    merge_env_pages $1

    CHANGED=$(git_diff)

    if [ -n "${CHANGED}" ]; then

        echo -e "\nThe ./grav/user/pages directory on $1 has changes that have not been committed to this deployment.\n"

        read -p "Would you like to overwrite the changes made on $1? [Y/n]" -n 1 -r

        if [[ ! $REPLY =~ ^[Yy]$ ]]

            echo -e "\nAborting deploy to $1."

            exit_shell

        then

            echo -e "\nProceeding with deploy to $1."

            git_deploy $1

        fi

    else

        git_deploy $1

    fi

fi