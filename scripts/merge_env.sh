#!/usr/bin/env bash
# https://superuser.com/questions/547282/which-is-the-rsync-command-to-smartly-merge-two-folders#547316
# merges the local pages directory with the source directory
REMOTE_PATH='push_dev@lc-www1:~/www.lwrcommercial.com'
GRAV_USER_PATH='grav/user'
GRAV_PAGES_PATH="$GRAV_USER_PATH/pages"
GRAV_CONFIG_PATH="$GRAV_USER_PATH/config"
merge_env_pages() {
	rsync -aviuzP "$REMOTE_PATH/$1/$GRAV_PAGES_PATH" "./$GRAV_USER_PATH"
}

merge_env_config() {
    rsync -aviuzP "$REMOTE_PATH/$1/$GRAV_CONFIG_PATH" "./$GRAV_USER_PATH"
}
