const rootPrefix = '../..',
  helper = require(rootPrefix + '/lib/helper');

let invertedStatuses = null;

class ExpensesConstants {

  get activeStatus() {
    return 'ACTIVE';
  }

  get inactiveStatus() {
    return 'INACTIVE';
  }

  get statuses() {
    const oThis = this;

    return {
      '1': oThis.activeStatus,
      '2': oThis.inactiveStatus
    };
  }

  get invertedStatuses() {
    const oThis = this;

    invertedStatuses = invertedStatuses || helper.invert(oThis.statuses);

    return invertedStatuses;
  }
}

module.exports = new ExpensesConstants();
