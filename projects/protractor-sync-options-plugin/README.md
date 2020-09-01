## Why?
There are problems by protractor in case you have some long timeouts or intervals in your app.  
Protractor will wait forever in such case.  
This plugin let you setup ignore rules for some long async calls.  

## Setup
* install the plugin `npm i protractor-sync-options-plugin -D`  

* for now, you should add
    ```
    import 'zone.js/dist/task-tracking.js';
    ```
    to your `polyfills.ts` file right after `import 'zone.js/dist/zone';` line.  
    (see github issues, help me to fix it)

* in your `protractor.js` file add plugins definition:
    ```
    exports.config = {
      plugins: [
        {
          package: 'protractor-sync-options-plugin',
          ignoreTasks: [<filter1>, <filter2> ..],
        }
      ],
      ...
    ```

the filters are of type [IgnoreTask](projects/protractor-sync-options-plugin/src/lib/interfaces.ts#L11)

## Usage example

```
exports.config = {
  plugins: [
    {
      package: 'protractor-sync-options-plugin',
      ignoreTasks: [{creationLocation: 'lodash'}, {source: 'setInterval', creationLocation: 'MyComponent.checkEveryTime'}, {source: 'XMLHttpRequest.send'}],
    }
  ],
```

* `{creationLocation: 'lodash'}` filters every promise, observable, setTimeout, setInterval etc from some code from `lodash` library  
* `{source: 'setInterval', creationLocation: 'MyComponent.checkEveryTime'}` filters only `setTinterval` calls from  `myComponent`'s `checkEveryTime` method  

see also [protractor.js](e2e/protractor.conf.js) file

## 'API' Description
The filter objects in the `ignoreTasks` array are joined over "OR" (disjunction)  
The filter properties of one single element (creationLocation and source) are joined over "AND" (conjunction)  


#### `source` option (task types): 
* setTimeout
* setInterval
* setImmediate
* XMLHttpRequest.send
* requestAnimationFrame
* webkitRequestAnimationFrame
* mozRequestAnimationFrame'

got from [angular/packages/zone.js/lib/zone-spec/fake-async-test.ts](https://github.com/angular/angular/blob/71acf9dd4904f99e6248c07ffcfb264ea4c9b1e3/packages/zone.js/lib/zone-spec/fake-async-test.ts#L496)

promises and observables uses `setTimeout`/`setInterval` in most cases.

#### `creationLocation` option
Each task in zone.js has location simple by error.stacktrace of the called place.  
The plugin searches through all function calls the defined in this property string/regex.  
So, be careful with this setting, since it can match too much.  
(for example you want to filter some library with name: 'time', and you have some method that has 'time' in its name, so the method's async calls will be filtered too)


## Contribution
Will be happy to see your PRs!  
