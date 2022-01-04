const _ = require('lodash');

const createSubject = (initialValue) => {
  let _value = initialValue;
  const _listners = new Map();

  let _isComplted = false;
  let _hasError = false;

  const _callListner = (value, listner) => {
    const { next, err, complete } = listner;
    try {
      next(value);
    } catch (e) {
      if (err) {
        err(e);
      }
    }
    if (complete) {
      complete();
    }
  };

  const _createSubscription = (observer) => {
    const { next } = observer;
    _listners.set(next, observer);
    if (initialValue) {
      _callListner(initialValue, observer);
    }
    return {
      unsubscribe: () => {
        _listners.delete(next);
      },
    };
  };

  const _callErrorCallbacks = (err) => {
    _listners.forEach((listner) => {
      if (listner.err) {
        listner.err(err);
      }
    });
  };

  const _callCompleteCallbacks = () => {
    _listners.forEach((listner) => {
      if (listner.complete) {
        listner.complete();
      }
    });
  };

  const subscribe = (observer) => {
    if (_.isFunction(observer)) {
      observer = { next: observer };
    }

    return _createSubscription(observer);
  };

  return {
    getValue: () => {
      return _value;
    },
    next: (value) => {
      if (_isComplted) {
        throw new Error('Subject is completed');
      }
      if (_hasError) {
        throw new Error('Subject has a error');
      }
      _value = value;
      _listners.forEach((listner) => {
        _callListner(_value, listner);
      });
    },
    error: (err) => {
      _callErrorCallbacks(err);
      _hasError = true;
    },
    complete: () => {
      _callCompleteCallbacks();
      _isComplted = true;
    },
    subscribe,
    unsubscribe: () => {
      _listners.clear();
    },
    asObservable: () => {
      return { subscribe };
    },
  };
};

module.exports = createSubject;
