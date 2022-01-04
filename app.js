const _ = require('lodash');

const createObservable = (initialData) => {
  let currentData = initialData;
  const listners = new Map();

  const callListner = (data, listner) => {
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

  const createSubscription = (observer) => {
    const { next, err, complete } = observer;
    listners.set(next, { next, err, complete });
    if (initialData) {
      callListner(initialData, { next, err, complete });
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
        callListner(currentData, listner);
      });
    },
    subscribe: (observer) => {
      if (_.isFunction(observer)) {
        observer = { next: observer };
      }

      return createSubscription(observer);
    },
  };
};

// TEST
const observer = createObservable(11);

const subscription = observer.subscribe((data) => {
  console.log(data);
});
observer.next(1);
observer.next(3);
observer.subscribe({
  next: (data) => {
    console.log(data);
  },
  complete: () => {
    console.log('Complete');
  },
});
subscription.unsubscribe();
observer.next(6);
observer.subscribe((data) => {
  console.log(data);
});

observer.next(10);
