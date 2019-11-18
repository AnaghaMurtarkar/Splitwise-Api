const rootPrefix = '../..',
  helper = require(rootPrefix + '/lib/helper');

let invertedStatuses = null;

class ExpensesConstants {

  get activeStatus() {
    return 'ACTIVE';
  }

  get deletedStatus() {
    return 'DELETED';
  }

  get settledUpStatus() {
    return 'SETTLEDUP';
  }

  get statuses() {
    const oThis = this;

    return {
      '1': oThis.activeStatus,
      '2': oThis.deletedStatus,
      '3': oThis.settledUpStatus
    };
  }

  get invertedStatuses() {
    const oThis = this;

    invertedStatuses = invertedStatuses || helper.invert(oThis.statuses);

    return invertedStatuses;
  }
}

module.exports = new ExpensesConstants();
