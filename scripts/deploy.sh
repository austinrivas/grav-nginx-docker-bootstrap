#!/usr/bin/env bash

# deploys the application to the specified environment
function push_git_deploy() {
	git push $1 +HEAD:master
	git fetch $1
	git push origin --tags
}

# https://superuser.com/questions/547282/which-is-the-rsync-command-to-smartly-merge-two-folders#547316
# merges the local pages directory with the source directory
merge_env_pages() {
	rsync -avc push_dev@lc-www1:~/www.lwrcommercial.com/$1/grav/user/pages/ ./grav/user/pages
}

merge_env_pages $1

if git diff-index --quiet HEAD --; then
    # No changes to pages directory
    # push_git_deploy $1
    echo "No changes detected"
else
    # Changes to pages directory
    echo "The ./grav/user/pages directory on $1 has changes that have not been committed to this deployment."
    echo "Commit the changes and deploy again. You can force the deploy with the --force option."
fi