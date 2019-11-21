const sanitizeHtml = require('sanitize-html');

class SanitizeRecursively {
  /**
   * Recursively sanitize.
   *
   * @param {object} params
   *
   * @returns {*}
   * @private
   */
  sanitize_params_recursively(params) {
    const oThis = this;

    if (typeof params === 'string') {
      params = oThis._sanitizeString(params);
    } else if (typeof params === 'boolean' || typeof params === 'number' || params === null) {
      // Do nothing and return param as is.
    } else if (params instanceof Array) {
      for (const index in params) {
        params[index] = oThis.sanitize_params_recursively(params[index]);
      }
    } else if (params instanceof Object) {
      Object.keys(params).forEach(function(key) {
        params[key] = oThis.sanitize_params_recursively(params[key]);
      });
    } else if (!params) {
      params = oThis._sanitizeString(params);
    } else {
      // eslint-disable-next-line no-console
      console.error('Invalid params type: ', typeof params);
      params = '';
    }

    return params;
  }

  /**
   * Sanitize string
   *
   * @param str
   *
   * @private
   */
  _sanitizeString(str) {
    return sanitizeHtml(str, { allowedTags: [] });
  }
}

const sanitizeRecursively = new SanitizeRecursively();

class Sanitizer {
  /**
   * Sanitize Request body and request query params
   *
   * @param req
   * @param res
   * @param next
   *
   * @returns {*}
   */
  sanitizeBodyAndQuery(req, res, next) {
    req.body = sanitizeRecursively.sanitize_params_recursively(req.body);
    req.query = sanitizeRecursively.sanitize_params_recursively(req.query);

    return next();
  }

}

module.exports = new Sanitizer();
