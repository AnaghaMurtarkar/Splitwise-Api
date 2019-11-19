const rootPrefix = '../..';

/**
 * Base class for all services.
 *
 * @class ServicesBase
 */
class ServicesBase {
  /**
   * Constructor for base class for all services.
   *
   * @constructor
   */
  constructor() {}

  /**
   * Main performer for class.
   *
   * @returns {Promise<*>}
   */
  perform() {
    const oThis = this;

    return oThis._asyncPerform().catch(async function(err) {
      let errorObject = err;

      if(!errorObject.internal_error_identifier) {
        errorObject = {
          success: false,
          code: 500,
          internal_error_identifier: 'a_s_b_1',
          api_error_identifier: 'something_went_wrong',
          debug_options: { error: err.toString(), stack: err.stack }
        };
      }

      console.error(' In catch block of services/Base.js', JSON.stringify(errorObject));

      return errorObject;
    });
  }

  /**
   * Async perform.
   *
   * @private
   * @returns {Promise<void>}
   */
  async _asyncPerform() {
    throw new Error('Sub-class to implement.');
  }
}

module.exports = ServicesBase;
