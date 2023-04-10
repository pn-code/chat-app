"use client";

import React from "react";
import Button from "./ui/Button";

function AddFriendForm() {
  return (
    <form className="max-w-sm">
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Add friend by email
      </label>

      <div className="mt-2 flex gap-4">
        <input
          className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          type="email"
          placeholder="you@example.com"
        />
        <Button>Add</Button>
      </div>
    </form>
  );
}

export default AddFriendForm;
