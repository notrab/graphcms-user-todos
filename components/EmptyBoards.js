import NewBoardPopover from "./NewBoardPopover";

const EmptyBoards = () => {
  return (
    <div className="p-6 md:p-12 lg:p-24 text-center border-2 border-gray-300 border-dashed rounded-2xl space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold text-purple-500">
        Nothing to do?
      </h2>
      <p className="text-lg text-gray-600">
        How about you create your first board?
      </p>
      <NewBoardPopover firstTime />
    </div>
  );
};

export default EmptyBoards;
