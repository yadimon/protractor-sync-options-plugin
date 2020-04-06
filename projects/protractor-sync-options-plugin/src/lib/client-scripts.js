/**
 * set of functions, that can be executed by client/frontend.
 * every function must be "all inclusive" without any references to outside,
 * because they are transferred as text to client by selenium.
 */


exports.patchTestability = patchTestability;
exports.restoreTestability = restoreTestability;

/**
 * (monkey)patches, if not already patched, angular.testability#whenStable, to be able to ignore some async tasks
 * @param {IgnoreTask[]} ignoreTasks ignore filter tasks definitions
 */
function patchTestability(ignoreTasks) {
  if (!window.getAllAngularTestabilities) {
    throw Error('Testability not found. Not an angular app?');
  }

  const testability = window.getAllAngularTestabilities()[0]; // TODO all apps
  const Testability = testability.constructor;
  const isStableOrig = Testability.prototype.isStable;

  if (!!isStableOrig.originalFn) {
    throw Error('Testability already patched');
  }

  const newIsStable = function (...args) {
    const isStable = isStableOrig.apply(this, args);
    const isStableWithoutFiltered = hasOnlyFilteredTasks(testability);
    return isStable || isStableWithoutFiltered;
  };
  newIsStable.originalFn = isStableOrig;

  Testability.prototype.isStable = newIsStable;



  // -----------------------------------------------------
  //       helpers
  // -----------------------------------------------------
  function matchesSource(/** PendingMacrotask */task, /** IgnoreTask */ignoreTask) {
    return task.source === ignoreTask.source;
  }

  function isSourceDefined(/** IgnoreTask */ignoreTask) {
    const source = ignoreTask.source;
    return (typeof source === 'string') || (source instanceof RegExp);
  }

  function matchesLocation(/** PendingMacrotask */task, /** IgnoreTask */ignoreTask) {
    const locationFilter = ignoreTask.creationLocation;
    const callLocations = getCallLocations(task);
    return callLocations.some((callLocation) => {
      if (locationFilter instanceof RegExp) {
        return callLocation.match(locationFilter)
      }

      if (typeof locationFilter === 'string') {
        return callLocation.includes(locationFilter)
      }
    })
  }

  function isLocationDefined(/** IgnoreTask */ignoreTask) {
    const loc = ignoreTask.creationLocation;
    return (typeof loc === 'string') || (loc instanceof RegExp)
  }

  /**
   * @param {PendingMacrotask} task task to check
   * @param {IgnoreTask} ignoreTask matching conditions
   * @return {boolean} true if all defined condition properties of `ignoreTask` matches (conjunction)
   */
  function areMatching(task, ignoreTask) {
    let result = true;
    if (isSourceDefined(ignoreTask)) {
      result &= matchesSource(task, ignoreTask);
    }

    if (isLocationDefined(ignoreTask)) {
      result &= matchesLocation(task, ignoreTask);
    }

    return result;
  }

  function getCallLocations(/** PendingMacrotask */task) /**string[]*/ {
    return task.creationLocation.stack.split(' at ');
  }

  function shouldIgnore(/** PendingMacrotask */t) {
    return ignoreTasks.some(it => (areMatching(t, it)));
  }

  function hasOnlyFilteredTasks(testability) {
    const trZone = testability['taskTrackingZone']; // private prop TODO use any api?
    const tasks = trZone.macroTasks;
    return tasks.every(shouldIgnore);
  }
}

/**
 * restores patched whenStable function to original, if patched.
 */
function restoreTestability() {
  if (!window.getAllAngularTestabilities) {
    throw Error('Testability not found. Not an angular app?');
  }

  const testability = window.getAllAngularTestabilities()[0]; // TODO all apps
  const Testability = testability.constructor;
  const isStableFn = Testability.prototype.isStable;

  if (!isStableFn.originalFn) {
    throw Error('Cant restore, Testability.whenStable is not patched');
  }

  Testability.prototype.isStable = isStableFn.originalFn;
}
