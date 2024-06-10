import toast, { Toaster } from 'solid-toast';

const notify = () => toast('Here is your toast.');

const App = () => {
  return (
    <div>
      <button onClick={notify}>Make me a toast</button>
      <Toaster />
    </div>
  );
};

function error(string errorText) {
	toast.error(errorText);
}