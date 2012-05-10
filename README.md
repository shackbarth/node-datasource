#XTUPLE DATASOURCE

> THIS DOCUMENTATION IS CURRENTLY UNDER CONSTRUCTION AND INCOMPLETE

> It is __highly recommended__ that this software be used for educational purposes and testing only as it is designed to be integrated with many other components and requires a high level of technical ability and domain knowledge to use properly.

The datasource requires the following components before being able to be run.

##Requirements

__Currently the datasource requires a *nix environment to run__. This is both a dependency of portions of Node.js and other components at this time. It is possible _but not decided_ that in the future this limitation will not exist. Currently it does and no timeline has been set to change it.

##Prerequisites

* [Node.js] (https://github.com/joyent/node) -- `v0.7.2`
* [Redis] (https://github.com/antirez/redis) -- `v2.6.0` (if running locally)

##Instructions  
  
Once the datasource source has been cloned, from the project root simply execute `./server` and it will attempt to install/update any of its dependencies and npm required packages including building the native bindings for the PostgreSQL driver. Should the auto installer fail it is usually caused by a permissions issue or incorrect version of node/npm. If it is a permissions issue you will need to `cd lib/xt` and `sudo npm install --force`. If this does not resolve the issue, may God have mercy on your soul...and you probably have some other issues with your environment.   

Also note that the datasource clones and maintains its own copy of the [the xTuple build-tools project](https://github.com/xtuple/build-tools). If the npm install fails with version mismatch errors, try the same as above `cd lib/xt/node_modules/build-tools; npm install --force`.

##Configuration

By default the datasource looks for and reads from a configuration file `lib/config.js`. This file can be overriden at runtime by passing the `-c path/to/custom_config.js`. In the default configuration file some inline comments describe the settings and what they are for. The options are key/value pairs collected by associated module. If some of these settings need to be modified (and they would for any production environment or network available development environment) it is advised that a copy of the `lib/config.js` file be made and modified and executed using the override method just described.   

Out of the box the configuration is set to run in `development` mode with the build-tools turned on. In development mode the build-tools will compile and preprocess the client source and host it at the default hostname and port `localhost:4020`. Also, in `development` mode the build-tools have additional terminal output for debugging as well as deploy the client in a very different fashion to assist in development debugging. It is not appropriate for production.  

###Build-tools Configuration

To better understand the build-tools and how they function, see their documentation. A quick note, however, on the structure of their settings in the default `lib/config.js` file. The configuration options by default look something like the following

```javascript
  //.......................................
  // BUILDER CONFIGURATION OPTIONS
  //

  builder: {

    // whether or not the datasource should include the
    // client builder
    useBuilder: true,

    // project structure file path
    projectStructure: _path.join(__dirname, '../../client', 'postbooks.json'),

    // project mode
    projectMode: 'development',

    // project root directory
    projectRoot: _path.join(__dirname, '../../client'),

    // project package mode
    projectPackageMode: 'normal',

    // project title (display in browser)
    projectTitle: 'Postbooks (development)',

    // project www directory for static files and builder index
    projectWWW: _path.join(__dirname, '../../client', 'www'),

    // datasource hostname to insert into the index
    datasourceHost: 'localhost',

    // datasource host port
    datasourceHostPort: 9000,

    // builder hostname for clients to connect to via socket
    builderHost: 'localhost',

    // builder host port
    builderHostPort: 4020,

    // builder host namespace for sockets to connect to the builder
    builderHostNamespace: 'build',

    // development mode only option
    printTreeOnBuild: true,

    // development mode only option
    sortedFilesListInIndex: true
  },
```

and are usable as-is from `localhost:4020` if the source tree is structured properly. In order to avoid using the builder (which can be useful if running on separate machines/VM's or for any of a variety of useful reasons) integrated with the datasource simply switch the `useBuilder` flag to `false`.   

Other key properties to understand are the `datasourceHost*` options and `builderHost*` options. These are values that will be interpreted by the client. So, for example, if you are running the datasource and the build-tools from a Linux VM but connecting to them from a remote machine or host machine with a different IP address, `localhost` will fail to work. So in this example we would need to switch `localhost` to the IP address of the VM so remote client's could access the services on the correct server. 