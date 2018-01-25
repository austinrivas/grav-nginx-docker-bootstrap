# Abstract

This application uses the Grav flat-file cms to serve a static web application via a Nginx/PHP-fpm docker image.

The scope of the application is to serve as a CMS for pages, blog posts, custom post types, and media assets while providing
the ability to version control content/configuration changes.

# CMS Guide

## DO NOT UPDATE THE HAYWIRE THEME, IT WILL OVERWRITE OUR APPLICATION.

TODO: Fork Haywire into a theme that is managed by Push. 

### Sitewide Configuration
Admin -> Configuration -> Site

    description: Site meta description for search results
    gtm-id: XXXXXXX
            
### ArcGIS Property Model | [Source](grav/user/config/ArcGIS.yaml)
Admin -> Configuration -> ArcGIS

The admin provides an interface for defining model properties and mapping them to ArcGIS fields.

    arc-gis-feature-server: 'https://services2.arcgis.com/XS7JKtqtY6stbXzM/arcgis/rest/services/SMRLWR_Commercial_Sample_20171205/FeatureServer/0'
    model-properties:
      -
        label: Acres // Field label for use in UI
        key: acres // key in the application PropertyModel definition
        arc-key: Acres // ArcGIS field feature key
        field-type: text | enummerable | range
        filterable: true | false // filterable fields must be enumerable or range type

## Page Frontmatter

### Modular Pages
    content:
        items: '@self.modular'
        order:
            by: default
            dir: asc

### Property Filter
    filters:
        cta:
            field: type
            value: Industrial
            label: 'View Industrial Land'
            
            or
            
            link: http://lwrwaterside.com/waterside-place/
            label: 'Waterside Place'

### ArcGIS Map
    arcmap:
        basemap: hybrid # https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap
        center:
            latitude: 27.4119421
            longitude: -82.4638901
            zoomEmpty: 13
            zoomSingleResult: 15

# Environments

Place the following in your `/etc/hosts` file:

	138.197.68.166 lc-www1

Run the following commands to add your git remote repositories:

	git remote add prod push_dev@lc-www1:~/repos/www.lwrcommercial.com/Prod.git
	git remote add stage push_dev@lc-www1:~/repos/www.lwrcommercial.com/Stage.git
	git remote add test push_dev@lc-www1:~/repos/www.lwrcommercial.com/Test.git

## [Production](https://www.lwrcommercial.com) | [Admin](https://www.lwrcommercial.com/admin)

TODO: Deploy to production url with coming soon page

TODO: Describe prod environment snowflakes

### Deployment

TODO: Describe prod deployment

## [Staging](https://lwrcommercial-stage.pushdev.net/) | [Admin](https://lwrcommercial-stage.pushdev.net/admin)

The staging environment is meant to be ephemeral, meaning it should be able to be created and destroyed as needed and is not meant to preserve application state.

### Deployment

- `$ ./scripts/deploy.sh stage`

If you encounter a message notifying you that there are changes on stage not present locally you should abort the deploy and resolve the local git diff before redeploying.

## [Local](http://localhost) | [Admin](http://localhost/admin)

The local dev environment runs in a docker service name `nginx-php-grav` that is hosted on dockerhub.

For more information on the docker image see the section of the README below. 

# Build App

Note: All paths are relative to the project root.

- [Install Docker Compose](https://docs.docker.com/compose/install/)

- [Install yarn](https://yarnpkg.com/lang/en/docs/install/)

- `git clone git@bitbucket.org:push-orlando/lwrc-grav.git lwrc-grav`

- `cd lwrc-grav`

- `docker-compose up -d`

- `docker-compose exec nginx-php-grav php bin/grav install`

- `cd grav/user/themes/haywire`

- `yarn && yarn run production`

- or `yarn && yarn run dev`

- or `yarn && yarn run watch`

## Known Issues

If after you run `docker-compose up` you see an error like:

```
Starting lwrc-grav ... 
Starting lwrc-grav ... error

ERROR: for lwrc-grav  Cannot start service nginx-php-grav: driver failed programming external connectivity on endpoint lwrc-grav (ce07c3b7c8c4c93c90370e8e0843f79e2fdbf892681374382b9b08317d0a057d): Error starting userland proxy: Bind for 0.0.0.0:80: unexpected error (Failure EADDRINUSE)

ERROR: for nginx-php-grav  Cannot start service nginx-php-grav: driver failed programming external connectivity on endpoint lwrc-grav (ce07c3b7c8c4c93c90370e8e0843f79e2fdbf892681374382b9b08317d0a057d): Error starting userland proxy: Bind for 0.0.0.0:80: unexpected error (Failure EADDRINUSE)
ERROR: Encountered errors while bringing up the project.
```

Then you need to stop whatever service is running on port `80`.

If you visit http://localhost and see a message that reads "It Works!", then it is Apache that is tying up port 80.

Stop Apache by running `sudo apachectl stop` or `sudo apachectl -k stop` and rerun `docker-compose up`.

TODO: Bind container to a static ip locally and use a hosts declaration to avoid this issue in the future.

# Front End

The front end application can be found in the [grav/user/themes/haywire](grav/user/themes/haywire) folder.

You can view which theme is currently active in [grav/user/config/system.yaml](grav/user/config/system.yaml)

```yaml
pages:
  theme: haywire
```

## Theme | [README](grav/user/themes/haywire/README.md) | [Github](https://github.com/robbinfellow/haywire-grav)

Its key features are : 

- Laravel Mix (webpack asset pipeline wrapped in Laravel) | [Github](https://github.com/JeffreyWay/laravel-mix)

- Bulma SASS Framework | [Github](https://github.com/jgthms/bulma) | [Docs](https://bulma.io/documentation/overview/start/)

- VueJS Framework | [Github](https://github.com/vuejs/vue) | [Docs](https://vuejs.org/v2/guide/)

### VueJS Application | [Source](grav/user/themes/haywire/js)

- `app.js`
    - `app.js` is the entry point for the application. It is where browser polyfills are loaded, property collections are initialized and attached to the global scope, VueJS is initialized, Vue components are imported, and VueJS is configured.
- `bootstrap.js`
    - `bootstrap.js` is a secondary loader file that is responsible for loading vendor libraries that operate outside the scope of the main VueJS application, an example of this is the `object-fit` polyfill.
- `components`
    - The components directory contains the definitions for the VueJS components that compose the application
        - `mixins` - The mixins directory warehouses VueJS mixins that apply shared functionality to Vue Components
        - Noteworthy Components
            - `PageState.vue` acts as the "router" for the application. In reality all it does is parse the url state and supply it as parts and parameters to child components, most notably the `PropertyAggregate.vue`. `PageState.vue` is also the handler for `updateQueryParam` events emitted by the `EventBus`.
                - `PropertyAggregate.vue` handles the logic of taking url param supplied by page state and executing queries against the ArcGIS api to populate collections. The resulting collection is then passed to child components along with the filter state.
                - `PropertyFilter.vue` is the "query builder" of the application and is responsible for both displaying the current filter state and emitting change events to update the collection state and url params based on new query values.
                - `ArcMap.vue` is the view layer for the ArcGIS map component. It is responsible for fetching the required ArcGIS modules using the proprietary Arc loader and then rendering the current state of the map depending on the state of the collection parameter.
                - `PropertyListGrid.vue / PropertyListTable.vue` components renders the state of the paginated collection in list form.
                - `PropertyTile.vue` is the tile representation of a property model. It implements the `FavoriteIcon` component and links to the `PropertyDetail` component page.
                - `PropertyDetail.vue` is a page level component that consumes a the output of `PageState` and renders the details for a given property model based on the url state.
                - `FavoriteIcon.vue` is responsible for displaying the favorite status of a given property model and providing the ui for saving a model to local storage as a favorite.
- `event-handlers`
    - `event-bus.js` defines the primary Event Bus for dispatching events throughout the VueJS application. The same `EventBus` is passed as a parameter to child components in order to tightly scope events.
    - `image-loader.js` defines the default behaviour for all `img` tags on the site and sets up the event handlers for animating images into the dom after load.
- `filters`
    - `vue-currency-filter.js` defines the text filter for displaying currency values in the ui.
- `models`
    - The `models` directory is the storage location for all classes that act as the application data layer.
        - `arcModel.js` initializes the ArcGIS query layer and is the root of all external api interactions with ArcGIS.
        - `collection.js` is an abstract class that acts as a parent for all other collections in the application.
            - `localStorageCollection.js` is an abstract class that implements the localStorage layer used by the favorites feature.
                - `favoritePropertiesCollection.js` defines the behaviour for the favorites feature and provides the query methods for retrieving favorite properties.
            - `propertyCollection.js` defines the api surface for querying properties directly, this is the intended interface for all Property actions and queries.
        - `propertyModelJSON.js` is a set of helper methods that build the `PropertyModel` definition from the [ArcGIS](grav/user/config/ArcGIS.yaml) cms configuration.
        - `proeprtyModel.js` is dynamic class that is built at runtime from the [ArcGIS](grav/user/config/ArcGIS.yaml) cms configuration. `PropertyModel` is the type of all elements of collections in the application.
- `vendor`
    - The default storage location for 3rd party libraries such as `noUISlider` and `nProgress`.

### SASS Structure / Style Guide | [Source](grav/user/themes/haywire/sass)

There is a style guide defined in the [`styles.html.twig`](grav/user/themes/haywire/templates/styles.html.twig) that can be enabled via the cms for reference.

- `app.sass` - The entry point for sass compilation. Imports bulma modules and application specific styles.
- `browsers` - Storage location for browser specific stylesheets.
- `common` - Storage location for all common styles such as typography, buttons, fonts, icons, inputs, etc.
- `components` - Storage location for all VueJS component specific styles.
- `partials` - Storage location for all layout and non functional styles related to markup.

### Twig Templates | [Source](grav/user/themes/haywire/templates)

- page templates - The root level of the `templates` directory is reserved for page level templates only.
- `components` - VueJS components use twig templates to render their html contents into the initial markup, those templates are named after their components on a 1-1 basis.
- `forms` - The `forms` directory contains the twig templates responsible for rendering all html forms and their input elements into the dom.
- `modular` -  The `modular` directory contains the templates for [Grav Modular Pages](https://learn.getgrav.org/content/modular).
- `partials` - The partials directory contains the twig templates for all non VueJS markup elements.

# Grav | [README](grav/README.md) | [DOCS](https://learn.getgrav.org/)

If you are using the admin plugin, you can update Grav itself from the notice. 

You can click the Update button to update plugins and themes. If you don't see any updates, you can clear the GPM cache by clicking the Check for Updates button in the top-right.

Updating is now a simple affair. Simply navigate to the root of the Grav install in your terminal and type:

`docker-compose exec nginx-php-grav php bin/gpm selfupgrade -f`

This will upgrade the Grav core to the latest version. Additionally, you should update all your plugins and themes to the latest version (including the admin plugin if you have that installed).

You can do this using the command below:

`docker-compose exec nginx-php-grav php bin/gpm update -f`

## Content

All page content is stored in the [grav/user/pages](grav/user/pages) directory.

For additional information on the function and capabilities of the `pages` directory see the [Grav Content Docs](https://learn.getgrav.org/content).

## Plugins | [Registry](https://getgrav.org/downloads/plugins)

Grav provides a plugin system that is available by executing the `docker-compose exec nginx-php-grav php bin/gpm install <plugin-name>` command.

Plugins are stored in the [grav/user/plugins](grav/user/plugins) directory.

Exercise caution when installing plugins and ensure that they have been tested prior to committing them to the application source.

### Grav Admin | [README](grav/user/plugins/admin/README.md) | [DOCS](https://learn.getgrav.org/admin-panel) | [Github](https://github.com/getgrav/grav-plugin-admin)

Grav Admin is a Grav official plugin found at [grav/user/plugins/admin](grav/user/plugins/admin).

It has hard dependencies on the `email`, `form`, and `login` plugins.

### Grav Login | [README](grav/user/plugins/login/README.md) | [Github](https://github.com/getgrav/grav-plugin-login)

Grav Login is a Grav plugin found at [grav/user/plugins/login](grav/user/plugins/login).

`login` plugin configuration can be found in [grav/user/config/plugins/login.yaml](grav/user/config/plugins/login.yaml) and is also manageable via the admin ui.

The admin portal url is defined in `login.yml` and is also available for management in the admin ui.

#### User Management

User management is done via the `bin/plugin login newuser` command and is described in further detail in the `login` plugin and this entry in the [Admin FAQ](https://learn.getgrav.org/admin-panel/faq#adding-and-managing-users).

The application is setup with a default admin user `pushadmin`.

It is encouraged that you setup your own administrative user instead of relying on the shared `pushadmin` user.

All user accounts are versioned and stored a yaml file named after their username e.g. [grav/user/accounts/pushadmin.yaml](grav/user/accounts/pushadmin.yaml).

### Grav Email | [README](grav/user/plugins/email/README.md) | [Github](https://github.com/getgrav/grav-plugin-email)

Grav Email is a Grav official plugin found at [grav/user/plugins/email](grav/user/plugins/email).

TODO: Configure and test email in docker context

### Grav Forms | [README](grav/user/plugins/form/README.md) | [Github](https://github.com/getgrav/grav-plugin-form)

Grav Form is a Grav official plugin found at [grav/user/plugins/form](grav/user/plugins/form).

TODO: Configure and test form in docker context

# Docker Image | [Bitbucket](https://bitbucket.org/push-orlando/nginx-php-grav) | [Docker Hub](https://hub.docker.com/r/pushhere/nginx-php-grav/)

The `nginx-php-grav` docker image is used to serve this application.

TODO: evaluate nginx config for hardening

## Volumes

The `.ssh`, `grav`, and `nginx` directories are all mounted external volumes of the `nginx-php-grav` docker image.

+ [grav](grav) 
    
    **/usr/share/nginx/html/**

  Here you can find the Grav home folder where you can add and manage your content.

+ [nginx](nginx) 

    **/etc/nginx/**

  (Optional) Here you can tweak Nginx configuration and sites 

+ [.ssh](.ssh) 

    **/root/.ssh/**

  (Optional) Here you can put your **public** key so you can access container via SSH. After that, open a SSH connection to root@your_server:2222 specifying your **private** key.
  
# Scripts

### deploy.sh

- usage : `$ ./scripts/deploy.sh <environment>`

The deploy script checks the remote and pulls down any changes in the `./grav/user/pages` and `./grav/user/config` directory.

If changes are detected it prompts the user to either abort the deploy and commit the changes, or overwrite the changes present in the remote environment.

The deploy script will also abort the deploy if any uncommitted changes are detected in the repo prior to pulling down the `pages` directory.

### git_deploy.sh

This script is not meant to be executed directly and is sourced into `deploy.sh`.

However you can execute it directly by calling `$ source ./scripts/git_deploy.sh && git_deploy <environment>`.

Use at your own risk, this script does not check the remote before overwriting any changes made there.

### merge_env.sh

This script is not meant to be executed directly and is sourced into `deploy.sh`.

The file contains two function declarations for `merge_env_pages` and `merge_env_config`.

You can execute them directly by calling `$ source ./scripts/merge_env.sh && merge_env_pages <environment>`.

This will pull down the `./grav/user/pages` directory from the remote and attempt to intelligently merge the changes with you local `pages`.

The same is true for the `merge_env_config` function.

### post-receive

This is a git `post-receive` hook that is executed by the remote serve on deploy.

### build.sh

This script is executed by `post-receive` and is responsible for setting up the server and installing dependencies.