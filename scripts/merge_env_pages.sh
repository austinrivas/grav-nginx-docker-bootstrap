#!/usr/bin/env bash
# https://superuser.com/questions/547282/which-is-the-rsync-command-to-smartly-merge-two-folders#547316
# merges the local pages directory with the source directory
merge_env_pages() {
	rsync -avc push_dev@lc-www1:~/www.lwrcommercial.com/$1/grav/user/pages/ ./grav/user/pages
}
