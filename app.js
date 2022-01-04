const _ = require('lodash');

const createSubject = (initialValue) => {
  let _value = initialValue;
  const _listners = new Map();

  let isComplted = false;
  let hasError = false;

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

  return {
    getValue: () => {
      return _value;
    },
    next: (value) => {
      if (isComplted) {
        throw new Error('Subject is completed');
      }
      if (hasError) {
        throw new Error('Subject has a error');
      }
      _value = value;
      _listners.forEach((listner) => {
        _callListner(_value, listner);
      });
    },
    error: (err) => {
      _callErrorCallbacks(err);
      hasError = true;
    },
    complete: () => {
      _callCompleteCallbacks();
      isComplted = true;
    },
    unsubscribe: () => {
      _listners.clear();
    },
    asObservable: () => {
      return {
        subscribe: (observer) => {
          if (_.isFunction(observer)) {
            observer = { next: observer };
          }

          return _createSubscription(observer);
        },
      };
    },
  };
};

// TEST
const subject = createSubject(11);

const subscription = subject.asObservable().subscribe((data) => {
  console.log(data);
});
subject.next(1);
subject.next(3);
subject.asObservable().subscribe({
  next: (data) => {
    console.log(data);
  },
  complete: () => {
    console.log('Complete');
  },
});
subscription.unsubscribe();
subject.next(6);
subject.asObservable().subscribe((data) => {
  console.log(data);
});
// subject.complete();

// subject.next(10);
