const createObservable = (initialData = []) => {
  let currentData = initialData;
  const listners = [];

  const next = (data) => {
    currentData = data;
    listners.forEach((listner) => {
      listner(currentData);
    });
    console.log(listners);
  };

  const subscribe = (listner) => {
    listners.push(listner);
    return {
      unsubscribe: () => {
        listners.splice(
          listners.findIndex((_listner) => _listner === listner),
          1
        );
      },
    };
  };

  return { next, subscribe };
};

// TEST
const observer = createObservable();

const subscription = observer.subscribe((data) => {
  console.log(data);
});
observer.next(1);
observer.next(3);
observer.subscribe((data) => {
  console.log(data);
});
subscription.unsubscribe();
observer.next(6);
observer.subscribe((data) => {
  console.log(data);
});

observer.next(10);
