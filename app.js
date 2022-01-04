const _ = require('lodash');

const createSubject = (initialData) => {
  let currentData = initialData;
  const listners = new Map();

  const _callListner = (data, listner) => {
    const { next, err, complete } = listner;
    try {
      next(data);
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
    listners.set(next, observer);
    if (initialData) {
      _callListner(initialData, observer);
    }
    return {
      unsubscribe: () => {
        listners.delete(next);
      },
    };
  };

  return {
    next: (data) => {
      currentData = data;
      listners.forEach((listner) => {
        _callListner(currentData, listner);
      });
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

subject.next(10);
