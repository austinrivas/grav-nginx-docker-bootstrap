#!/usr/bin/env bash

source ./scripts/git_deploy.sh
source ./scripts/merge_env_pages.sh

ENVIRONMENT=$1

function exit_shell() {
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell
}

function git_diff() {
    echo $(git --work-tree=./ status --porcelain)
}

function git_discard_changes() {
    git clean -df
    git checkout -- .
}

function handle_merge_conflict() {
    while true
        do
          # (1) prompt user, and read command line argument
          read -p "Would you like to overwrite the changes made on $ENVIRONMENT? [Y/n]" REPLY

          # (2) handle the input we were given
          case $REPLY in
           [yY]* )  echo -e "\nProceeding with deploy to $ENVIRONMENT."
                    git_discard_changes
                    git_deploy $ENVIRONMENT
                    break;;

           [nN]* )  echo -e "\nAborting deploy to $ENVIRONMENT."
                    exit_shell;;

           * )      echo "Dude, just enter Y or N, please.";;
          esac
        done
}

UNCLEAN=$(git_diff)

if [ -n "${UNCLEAN}" ]; then

    echo -e "\nThis repo has uncommitted changes, aborting deploy to $ENVIRONMENT."

    exit_shell

else

    merge_env_pages $ENVIRONMENT

    CHANGED=$(git_diff)

    if [ -n "${CHANGED}" ]; then

        echo -e "\nThe ./grav/user/pages directory on $ENVIRONMENT has changes that have not been committed to this deployment.\n"

        handle_merge_conflict $ENVIRONMENT

    else

        git_deploy $ENVIRONMENT

    fi

fi