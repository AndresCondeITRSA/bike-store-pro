import BikeForm from "../BikeForm";
import { createBikeAction } from "../actions";

export default function NewBikePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Add New Bike</h1>
      <BikeForm action={createBikeAction} submitLabel="Create Bike" />
    </div>
  );
}
