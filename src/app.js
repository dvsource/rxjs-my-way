const createSubject = require('./lib/subject');

// Playground
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
subject.subscribe((data) => {
  console.log(data);
});
// subject.complete();

// subject.next(10);
