/**
 * patches angular.testability#whenStable, to be able to ignore some async tasks
 * @param {IgnoreTask[]} ignoreTasks ignore filter tasks definitions
 */
exports.patchTestability = function (ignoreTasks) {

  function hasOnlyFilteredTasks(testability) {
    const trZone = testability['taskTrackingZone']; // private prop TODO use any api?
    const tasks = trZone.macroTasks;
    const isFiltered = (/**Task*/t) => ignoreTasks.some(it => it.source === t.source);
    return tasks.every(isFiltered);
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
  if (isStableOrig === newIsStable) {
    return;
  }

  Testability.prototype.isStable = newIsStable;
};
