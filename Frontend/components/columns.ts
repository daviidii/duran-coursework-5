import {
  DataTableDropdown,
  DataTableEditableCell,
  DataTableStatusCell,
  DatePicker,
} from "#components";
import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import type { TaskProps, StatusType, ButtonVariants } from "~/types/types";
import Button from "./ui/button/Button.vue";
import { ArrowUpDown } from "lucide-vue-next";

export const taskColumns: ColumnDef<TaskProps>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Title", h(ArrowUpDown, { class: "ml-2 h-2 w-2" })]
      );
    },
    size: 100,
    id: "title",
    cell: (props) => {
      return h(DataTableEditableCell, {
        getValue: props.getValue,
        row: props.row,
        column: props.column,
        table: props.table,
        inputType: "INPUT",
        placeholder: "title",
      });
    },
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 50,
    id: "description",
    cell: (props) => {
      return h(DataTableEditableCell, {
        getValue: props.getValue,
        row: props.row,
        column: props.column,
        table: props.table,
        inputType: "TEXTAREA",
        placeholder: "description",
      });
    },
  },
  {
    accessorKey: "collaborators",
    header: "Collaborators",
    size: 50,
    id: "collaborators",
    cell: (props) => {
      return h(
        "p",
        {
          class: "text-muted",
        },
        "collabrator"
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    id: "status",
    size: 300,
    cell: (props) => {
      const statusOption: StatusType[] = ["Completed", "Pending"];
      return h(DataTableStatusCell, {
        options: statusOption,
        getValue: props.getValue,
        table: props.table,
        column: props.column,
        row: props.row,
      });
    },
  },
  {
    accessorKey: "due_date",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Due date", h(ArrowUpDown, { class: "ml-2 h-2 w-2" })]
      );
    },
    id: "due_date",
    size: 300,
    cell: (props) => {
      return h(DatePicker, {
        getValue: props.getValue,
        table: props.table,
        column: props.column,
        row: props.row,
      });
    },
    sortingFn: "datetime",
  },

  {
    id: "actions",
    enableHiding: false,
    cell: (props) => {
      return h(
        "div",
        { class: "relative" },
        h(DataTableDropdown, { row: props.row, table: props.table })
      );
    },
  },
];
