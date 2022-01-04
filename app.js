const createObservable = (initialData) => {
  let currentData = initialData;
  const listners = [];

  const next = (data) => {
    currentData = data;
    listners.forEach((listner) => {
      callListner(currentData, listner);
    });
  };

  const callListner = (data, listner) => {
    const { next, err, complete } = listner;
    try {
      next(currentData);
    } catch (e) {
      if (err) {
        err(e);
      }
    }
    if (complete) {
      complete();
    }
  };

  const subscribe = (next, err, complete) => {
    listners.push({ next, err, complete });
    if (initialData) {
      callListner(initialData, { next, err, complete });
    }
    return {
      unsubscribe: () => {
        listners.splice(
          listners.findIndex((_listner) => _listner.next === next),
          1
        );
      },
    };
  };

  return { next, subscribe };
};

// TEST
const observer = createObservable(11);

const subscription = observer.subscribe((data) => {
  console.log(data);
});
observer.next(1);
observer.next(3);
observer.subscribe(
  (data) => {
    console.log(data);
  },
  null,
  () => {
    console.log('Complete');
  }
);
subscription.unsubscribe();
observer.next(6);
observer.subscribe((data) => {
  console.log(data);
});

observer.next(10);
