const InformationQuestForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-custom-primary shadow-sm ring-1 ring-gray-900/5 w-1/3 sm:rounded-xl md:col-span-2"
    >
      <div className="px-4 py-6 sm:p-8">
        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-span-full">
            <label
              htmlFor="quest-title"
              className="text-sm font-medium leading-6 text-custom-primary"
            >
              Quest Title
            </label>
            <div className="mt-2">
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-custom-primary focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                <input
                  id="quest-title"
                  name="quest-title"
                  type="text"
                  className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-custom-gray placeholder:text-custom-gray focus:ring-0 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="quest-description"
              className="block text-sm font-medium leading-6 text-custom-primary"
            >
              Quest Description
            </label>
            <div className="mt-2">
              <textarea
                id="quest-description"
                name="quest-description"
                rows={3}
                className="block w-full rounded-md border-0 bg-transparent py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-custom-primary placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="col-span-full flex justify-between gap-x-2">
            <div className="w-1/2">
              <label
                htmlFor="reward"
                className="block text-sm font-medium leading-6 text-custom-primary"
              >
                Reward
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    id="reward"
                    name="reward"
                    type="number"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="w-1/2">
              <label
                htmlFor="deadline"
                className="block text-sm font-medium leading-6 text-custom-primary"
              >
                Deadline
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    id="deadline"
                    name="deadline"
                    type="date"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-custom-primary"
        >
          Reset
        </button>
        <button
          type="submit"
          className="rounded-full bg-custom-primary px-6 py-2 border border border-custom-accent text-sm font-semibold text-custom-black shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Publish Quest
        </button>
      </div>
    </form>
  );
};

export default InformationQuestForm;
