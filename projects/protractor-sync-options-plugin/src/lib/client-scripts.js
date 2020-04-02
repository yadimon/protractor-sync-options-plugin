/**
 * patches angular.testability#whenStable, to be able to ignore some async tasks
 * @param {IgnoreTask[]} ignoreTasks ignore filter tasks definitions
 */
exports.patchTestability = function (ignoreTasks) {
  if (!window.getAllAngularTestabilities) {
    return "non angular";
  }

  const testability = window.getAllAngularTestabilities()[0]; // TODO all apps
  const Testability = testability.constructor;
  const isStableOrig = Testability.prototype.isStable;
  const newIsStable = function (...args) {
    const isStable = isStableOrig.apply(this, args);
    const isStableWithoutFiltered = hasOnlyFilteredTasks(testability);
    return isStable || isStableWithoutFiltered;
  };

  // already patched
  if (isStableOrig.toString() === newIsStable.toString()) {
    return "already patched";
  }

  Testability.prototype.isStable = newIsStable;

  return "patch done";


  // -----------------------------------------------------
  //       helpers
  // -----------------------------------------------------
  function matchSource(/** PendingMacrotask */task, /** IgnoreTask */ignoreTask) {
    return task.source === ignoreTask.source;
  }

  function matchLocation(/** PendingMacrotask */task, /** IgnoreTask */ignoreTask) {
    if (!ignoreTask.creationLocation) {
      return false;
    }

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

  function matchTask(/** PendingMacrotask */task, /** IgnoreTask */ignoreTask) {
    return matchSource(task, ignoreTask) || matchLocation(task, ignoreTask)
  }

  function getCallLocations(/** PendingMacrotask */task) /**string[]*/ {
    return task.creationLocation.stack.split(' at ');
  }

  function shouldIgnore (/** PendingMacrotask */t) {
    return ignoreTasks.some(it => (matchTask(t, it)));
  }

  function hasOnlyFilteredTasks(testability) {
    const trZone = testability['taskTrackingZone']; // private prop TODO use any api?
    const tasks = trZone.macroTasks;
    return tasks.every(shouldIgnore);
  }
};
